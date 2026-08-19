import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { toDate } from '../utils/dateUtils';
import { subscribeToUnbilledTimes, subscribeToUnbilledExpenses, subscribeToOpenFixedFeeProjects, subscribeToInvoices } from '../redux/actions/index';
import '../styles/UnbilledProjects.css';

const mapStateToProps = state => {
    return {
        unbilledTimes: state.unbilledTimes,
        unbilledExpenses: state.unbilledExpenses,
        fixedFeeProjects: state.fixedFeeProjects,
        invoiceRecords: state.invoiceRecords,
        projectsNames: state.projectsNames,
        projectsByClient: state.projectsByClient,
        clientsNames: state.clientsNames,
        loadingUnbilledTimes: state.loadingUnbilledTimes,
        loadingUnbilledExpenses: state.loadingUnbilledExpenses,
        loadingFixedFeeProjects: state.loadingFixedFeeProjects,
        loadingInvoices: state.loadingInvoices,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getUnbilledTimes: () => dispatch(subscribeToUnbilledTimes()),
        getUnbilledExpenses: () => dispatch(subscribeToUnbilledExpenses()),
        getFixedFeeProjects: () => dispatch(subscribeToOpenFixedFeeProjects()),
        getInvoices: () => dispatch(subscribeToInvoices()),
    };
}

const daysAgo = (date) => {
    if (!date) return 0;
    return Math.max(0, Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)));
};

const formatHours = (totalHours, totalMinutes) => {
    const combinedMinutes = totalHours * 60 + totalMinutes;
    const hrs = Math.floor(combinedMinutes / 60);
    const mins = combinedMinutes % 60;
    return `${hrs}:${String(mins).padStart(2, '0')}`;
};

const formatCurrency = (amount) => `$${Number(amount).toFixed(2)}`;

class UnbilledProjectsDashboard extends Component {
    componentDidMount() {
        this.unsubscribeUnbilledTimes = this.props.getUnbilledTimes();
        this.unsubscribeUnbilledExpenses = this.props.getUnbilledExpenses();
        this.unsubscribeFixedFeeProjects = this.props.getFixedFeeProjects();
        this.unsubscribeInvoices = this.props.getInvoices();
    }

    componentWillUnmount() {
        if (this.unsubscribeUnbilledTimes) this.unsubscribeUnbilledTimes();
        if (this.unsubscribeUnbilledExpenses) this.unsubscribeUnbilledExpenses();
        if (this.unsubscribeFixedFeeProjects) this.unsubscribeFixedFeeProjects();
        if (this.unsubscribeInvoices) this.unsubscribeInvoices();
    }

    buildProjectClientMap() {
        const map = {};
        Object.entries(this.props.projectsByClient || {}).forEach(([clientUid, projects]) => {
            projects.forEach(p => { map[p.uid] = clientUid; });
        });
        return map;
    }

    groupByProject() {
        const projectClientMap = this.buildProjectClientMap();
        const groups = {};

        const ensureGroup = (projectUid) => {
            if (!groups[projectUid]) {
                const clientUid = projectClientMap[projectUid];
                groups[projectUid] = {
                    projectUid,
                    projectTitle: this.props.projectsNames?.[projectUid] || 'Unknown project',
                    clientName: (clientUid && this.props.clientsNames?.[clientUid]) || 'Unknown client',
                    totalHours: 0,
                    totalMinutes: 0,
                    timeAmount: 0,
                    expenseAmount: 0,
                    entryCount: 0,
                    oldestDate: null,
                    isFixedFee: false,
                    fixedFeeAmount: null,
                    neverInvoiced: false,
                };
            }
            return groups[projectUid];
        };

        // Entries listed on an invoice that hasn't finished marking yet are already
        // reserved for that invoice even though isBilled is still false on the
        // entry itself — showing them here as "pending" would invite generating a
        // second invoice for the same work. Skip anything an incomplete invoice
        // already claims.
        const reservedTimeUids = new Set();
        const reservedExpenseUids = new Set();
        (this.props.invoiceRecords || []).forEach(inv => {
            if (inv.entriesComplete === false) {
                (inv.timeUids || []).forEach(uid => reservedTimeUids.add(uid));
                (inv.expenseUids || []).forEach(uid => reservedExpenseUids.add(uid));
            }
        });

        (this.props.unbilledTimes || []).forEach(t => {
            if (reservedTimeUids.has(t.uid)) return;
            const group = ensureGroup(t.timeProject);
            group.totalHours += Number(t.timeHours) || 0;
            group.totalMinutes += Number(t.timeMinutes) || 0;
            group.timeAmount += Number(t.timeTotal) || 0;
            group.entryCount += 1;
            const d = toDate(t.timeDate);
            if (d && (!group.oldestDate || d < group.oldestDate)) group.oldestDate = d;
        });

        (this.props.unbilledExpenses || []).forEach(e => {
            if (reservedExpenseUids.has(e.uid)) return;
            const group = ensureGroup(e.expenseProject);
            group.expenseAmount += Number(e.expenseTotal) || 0;
            group.entryCount += 1;
            const d = toDate(e.expenseDate);
            if (d && (!group.oldestDate || d < group.oldestDate)) group.oldestDate = d;
        });

        const invoicedProjectUids = new Set();
        (this.props.invoiceRecords || []).forEach(inv => {
            (inv.projectUids || []).forEach(uid => invoicedProjectUids.add(uid));
        });

        // Fixed-fee projects are billed once, then closed by the admin — once
        // invoiced they drop out of subscribeToOpenFixedFeeProjects (isOpen filter)
        // and won't reappear here. They also never carry additional expenses in
        // practice, so the "Unbilled Expenses" stat on these cards is just a
        // defensive fallback, not something expected to show a nonzero value.
        (this.props.fixedFeeProjects || []).forEach(p => {
            if (invoicedProjectUids.has(p.uid)) return;
            const group = ensureGroup(p.uid);
            group.projectTitle = p.projectTitle || group.projectTitle;
            group.clientName = this.props.clientsNames?.[p.projectClient] || group.clientName;
            group.isFixedFee = true;
            group.fixedFeeAmount = Number(p.projectFee) || 0;
            group.neverInvoiced = true;
        });

        return Object.values(groups).sort((a, b) => {
            const aTime = a.oldestDate ? a.oldestDate.getTime() : 0;
            const bTime = b.oldestDate ? b.oldestDate.getTime() : 0;
            if (aTime !== bTime) return aTime - bTime;
            return a.projectTitle.localeCompare(b.projectTitle);
        });
    }

    render() {
        if (this.props.loadingUnbilledTimes || this.props.loadingUnbilledExpenses
            || this.props.loadingFixedFeeProjects || this.props.loadingInvoices) {
            return null;
        }

        const groups = this.groupByProject();

        return (
            <div className="ud-dashboard leftMargin topMargin">
                <div className="ud-dashboard-header">
                    <h5 className="ud-dashboard-title">Pending Invoicing</h5>
                    {groups.length > 0 && <span className="ud-count-badge">{groups.length}</span>}
                </div>

                {groups.length === 0 ? (
                    <div className="ud-empty">All caught up — no pending hours, expenses, or fixed fees.</div>
                ) : (
                    <Row>
                        {groups.map(group => (
                            <Col md={4} sm={6} xs={12} key={group.projectUid} className="ud-card-col">
                                <div className="ud-card">
                                    <div className="ud-card-client">{group.clientName}</div>
                                    <div className="ud-card-project">{group.projectTitle}</div>
                                    <div className="ud-card-stats">
                                        {group.isFixedFee ? (
                                            <>
                                                <div className="ud-card-stat">
                                                    <div className="ud-card-stat-label">Fixed Fee</div>
                                                    <div className="ud-card-stat-value">{formatCurrency(group.fixedFeeAmount)}</div>
                                                </div>
                                                <div className="ud-card-stat">
                                                    <div className="ud-card-stat-label">Unbilled Expenses</div>
                                                    <div className="ud-card-stat-value">{formatCurrency(group.expenseAmount)}</div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="ud-card-stat">
                                                    <div className="ud-card-stat-label">Hours</div>
                                                    <div className="ud-card-stat-value">{formatHours(group.totalHours, group.totalMinutes)}</div>
                                                </div>
                                                <div className="ud-card-stat">
                                                    <div className="ud-card-stat-label">Unbilled Fees</div>
                                                    <div className="ud-card-stat-value">{formatCurrency(group.timeAmount)}</div>
                                                </div>
                                                <div className="ud-card-stat">
                                                    <div className="ud-card-stat-label">Unbilled Expenses</div>
                                                    <div className="ud-card-stat-value">{formatCurrency(group.expenseAmount)}</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="ud-card-footer">
                                        <span>{group.entryCount} {group.entryCount === 1 ? 'item' : 'items'}</span>
                                        {group.oldestDate ? (
                                            <span className={`ud-pending-badge ${daysAgo(group.oldestDate) > 30 ? 'ud-pending-old' : ''}`}>
                                                Pending {daysAgo(group.oldestDate)} {daysAgo(group.oldestDate) === 1 ? 'day' : 'days'}
                                            </span>
                                        ) : group.neverInvoiced && (
                                            <span className="ud-pending-badge ud-pending-old">Never invoiced</span>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        );
    }
}

UnbilledProjectsDashboard.propTypes = {
    unbilledTimes: PropTypes.array,
    unbilledExpenses: PropTypes.array,
    fixedFeeProjects: PropTypes.array,
    invoiceRecords: PropTypes.array,
    projectsNames: PropTypes.object,
    projectsByClient: PropTypes.object,
    clientsNames: PropTypes.object,
    loadingUnbilledTimes: PropTypes.bool,
    loadingUnbilledExpenses: PropTypes.bool,
    loadingFixedFeeProjects: PropTypes.bool,
    loadingInvoices: PropTypes.bool,
    getUnbilledTimes: PropTypes.func,
    getUnbilledExpenses: PropTypes.func,
    getFixedFeeProjects: PropTypes.func,
    getInvoices: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(UnbilledProjectsDashboard);
