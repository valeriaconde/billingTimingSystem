import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { toDate } from '../utils/dateUtils';
import '../styles/UnbilledProjects.css';

const mapStateToProps = state => {
    return {
        unbilledTimes: state.unbilledTimes,
        unbilledExpenses: state.unbilledExpenses,
        projectsNames: state.projectsNames,
        projectsByClient: state.projectsByClient,
        clientsNames: state.clientsNames,
        loadingUnbilledTimes: state.loadingUnbilledTimes,
        loadingUnbilledExpenses: state.loadingUnbilledExpenses,
    };
};

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
                };
            }
            return groups[projectUid];
        };

        (this.props.unbilledTimes || []).forEach(t => {
            const group = ensureGroup(t.timeProject);
            group.totalHours += Number(t.timeHours) || 0;
            group.totalMinutes += Number(t.timeMinutes) || 0;
            group.timeAmount += Number(t.timeTotal) || 0;
            group.entryCount += 1;
            const d = toDate(t.timeDate);
            if (d && (!group.oldestDate || d < group.oldestDate)) group.oldestDate = d;
        });

        (this.props.unbilledExpenses || []).forEach(e => {
            const group = ensureGroup(e.expenseProject);
            group.expenseAmount += Number(e.expenseTotal) || 0;
            group.entryCount += 1;
            const d = toDate(e.expenseDate);
            if (d && (!group.oldestDate || d < group.oldestDate)) group.oldestDate = d;
        });

        return Object.values(groups).sort((a, b) => {
            const aTime = a.oldestDate ? a.oldestDate.getTime() : 0;
            const bTime = b.oldestDate ? b.oldestDate.getTime() : 0;
            return aTime - bTime;
        });
    }

    render() {
        if (this.props.loadingUnbilledTimes || this.props.loadingUnbilledExpenses) {
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
                    <div className="ud-empty">All caught up — no pending hours or expenses.</div>
                ) : (
                    <Row>
                        {groups.map(group => (
                            <Col md={4} sm={6} xs={12} key={group.projectUid} className="ud-card-col">
                                <div className="ud-card">
                                    <div className="ud-card-client">{group.clientName}</div>
                                    <div className="ud-card-project">{group.projectTitle}</div>
                                    <div className="ud-card-stats">
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
                                    </div>
                                    <div className="ud-card-footer">
                                        <span>{group.entryCount} {group.entryCount === 1 ? 'entry' : 'entries'}</span>
                                        {group.oldestDate && (
                                            <span className={`ud-pending-badge ${daysAgo(group.oldestDate) > 30 ? 'ud-pending-old' : ''}`}>
                                                Pending {daysAgo(group.oldestDate)}d
                                            </span>
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
    projectsNames: PropTypes.object,
    projectsByClient: PropTypes.object,
    clientsNames: PropTypes.object,
    loadingUnbilledTimes: PropTypes.bool,
    loadingUnbilledExpenses: PropTypes.bool,
};

export default connect(mapStateToProps)(UnbilledProjectsDashboard);
