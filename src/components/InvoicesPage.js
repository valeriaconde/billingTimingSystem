import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Badge } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { connect } from 'react-redux';
import { subscribeToInvoices, markInvoiceSent, markInvoicePaid } from '../redux/actions/index';
import BarLoader from 'react-spinners/BarLoader';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

const mapStateToProps = state => ({
    invoiceRecords: state.invoiceRecords,
    loadingInvoices: state.loadingInvoices,
});

const toDateString = (ts) => {
    if (!ts) return null;
    const d = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
};

class InvoicesPage extends Component {
    componentDidMount() {
        this.unsubscribe = this.props.subscribeToInvoices();
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    getStatus(record) {
        if (record.paidAt) return { label: 'Paid', variant: 'success' };
        if (record.sentAt) return { label: 'Sent', variant: 'primary' };
        return { label: 'Pending', variant: 'secondary' };
    }

    render() {
        return (
            <AuthUserContext.Consumer>
                {() =>
                    this.props.loadingInvoices ? <BarLoader css={{ width: '100%' }} loading={true} /> :
                    <div>
                        <h4 className="blueLetters topMargin leftMargin">Invoices</h4>
                        {this.props.invoiceRecords.length === 0 ? (
                            <p className="leftMargin topMargin">No invoices yet.</p>
                        ) : (
                            <TableContainer style={{ marginTop: '20px', paddingLeft: '16px', paddingRight: '16px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>#</strong></TableCell>
                                            <TableCell><strong>Client</strong></TableCell>
                                            <TableCell><strong>Projects</strong></TableCell>
                                            <TableCell><strong>Date</strong></TableCell>
                                            <TableCell><strong>Total</strong></TableCell>
                                            <TableCell><strong>Status</strong></TableCell>
                                            <TableCell><strong>Sent</strong></TableCell>
                                            <TableCell><strong>Paid</strong></TableCell>
                                            <TableCell><strong>Actions</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.props.invoiceRecords.map(record => {
                                            const status = this.getStatus(record);
                                            return (
                                                <TableRow key={record.uid}>
                                                    <TableCell>{record.invoiceNumber}</TableCell>
                                                    <TableCell>{record.clientName}</TableCell>
                                                    <TableCell>{(record.projectNames || []).join(', ')}</TableCell>
                                                    <TableCell>{toDateString(record.createdAt)}</TableCell>
                                                    <TableCell>${record.totalAmount}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={status.variant}>{status.label}</Badge>
                                                    </TableCell>
                                                    <TableCell>{record.sentAt ? toDateString(record.sentAt) : '—'}</TableCell>
                                                    <TableCell>{record.paidAt ? toDateString(record.paidAt) : '—'}</TableCell>
                                                    <TableCell>
                                                        {!record.sentAt && (
                                                            <Button size="sm" variant="outline-primary" style={{ marginRight: '6px' }}
                                                                onClick={() => this.props.markInvoiceSent(record.uid)}>
                                                                Mark Sent
                                                            </Button>
                                                        )}
                                                        {!record.paidAt && (
                                                            <Button size="sm" variant="outline-success"
                                                                onClick={() => this.props.markInvoicePaid(record.uid)}>
                                                                Mark Paid
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

InvoicesPage.propTypes = {
    invoiceRecords: PropTypes.array,
    loadingInvoices: PropTypes.bool,
    subscribeToInvoices: PropTypes.func,
    markInvoiceSent: PropTypes.func,
    markInvoicePaid: PropTypes.func,
};

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    subscribeToInvoices,
    markInvoiceSent,
    markInvoicePaid,
})(withAuthorization(condition)(InvoicesPage));
