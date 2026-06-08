import React, { Component } from 'react';
import { toDate } from '../utils/dateUtils';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { updateExpense, deleteExpense, getProjectsMapping, getUsers, addProject, getProjectByClient, addExpense, subscribeToExpenses, subscribeToAllExpenses } from "../redux/actions/index";
import BarLoader from "react-spinners/BarLoader";
import { connect } from "react-redux";
import DateFnsUtils from '@date-io/date-fns';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import * as ROLES from '../constants/roles';
import { expenseClasses } from "../constants/enums";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { trimString } from '../utils/inputUtils';

const mapStateToProps = state => ({
    clients: state.clients,
    loadingClients: state.loadingClients,
    users: state.users,
    projectsByClient: state.projectsByClient,
    projects: state.projects,
    loadingUsers: state.loadingUsers,
    expenses: state.expenses,
    loadingExpenses: state.loadingExpenses,
    clientsNames: state.clientsNames,
    projectsNames: state.projectsNames,
    loadingProjectsMapping: state.loadingProjectsMapping
});

const today = new Date();
const PAGE_SIZE = 20;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = Array.from({ length: 8 }, (_, i) => today.getFullYear() - 5 + i);

// Form state only — filter state is kept separate so form resets don't clear filters
const FORM_INITIAL_STATE = {
    showModal: false,
    selectedOption: null,
    selectedClientModal: null,
    validated: false,
    selectedDate: new Date(),
    selectedProjectModal: null,
    selectedExpenseModal: null,
    selectedAttorneyModal: null,
    expenseTitle: '',
    expenseTotal: 0,
    isModalAdd: true,
    showSavedAlert: false,
};

const INITIAL_STATE = {
    ...FORM_INITIAL_STATE,
    filterFromMonth: today.getMonth(),
    filterFromYear: today.getFullYear(),
    filterToMonth: today.getMonth(),
    filterToYear: today.getFullYear(),
    filterClient: null,
    filterUsers: [],
    currentPage: 1,
};

const shortExpenseLabel = label => {
    const idx = label.indexOf('(');
    return idx > -1 ? label.slice(0, idx).trim() : label;
};

const formatDate = date =>
    date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const selectStyle = { width: 'auto', display: 'inline-block', fontSize: 14 };

class gastos extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.attorney = React.createRef();
        this.handleClose = this.handleClose.bind(this);
    }

    static contextType = AuthUserContext;

    componentDidMount() {
        const authUser = this.context;
        if (authUser) {
            if (authUser.roles?.[ROLES.ADMIN]) {
                this.unsubscribeExpenses = this.props.subscribeToAllExpenses();
                if (!this.props.users) this.props.getUsers();
            } else {
                this.unsubscribeExpenses = this.props.subscribeToExpenses(authUser.uid, true);
            }
        }
    }

    componentWillUnmount() {
        if (this.unsubscribeExpenses) this.unsubscribeExpenses();
    }

    isFloat(n) {
        n = n?.toString();
        return n?.length > 0 && !isNaN(n) && n > 0;
    }

    handleShow = () => {
        this.setState({ ...FORM_INITIAL_STATE, showModal: true });
    }

    handleClose() {
        this.setState({ showModal: false });
    }

    handleChangeClient = selectedClientModal => {
        this.setState({ selectedClientModal, selectedProjectModal: null });
        if (!this.props.projectsByClient[selectedClientModal.value]) {
            this.props.getProjectByClient(selectedClientModal.value);
        }
    }

    handleChangeProject = selectedProjectModal => {
        this.setState({ selectedProjectModal });
    }

    handleDateChange = selectedDate => {
        this.setState({ selectedDate });
    }

    handleChangeExpense = selectedExpenseModal => {
        this.setState({ selectedExpenseModal });
    }

    handleAttorneyModal = selectedAttorneyModal => {
        this.setState({ selectedAttorneyModal });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    // Shifts both From and To by one month, preserving the range width
    prevMonth = () => {
        this.setState(({ filterFromMonth, filterFromYear, filterToMonth, filterToYear }) => {
            const from = new Date(filterFromYear, filterFromMonth - 1, 1);
            const to = new Date(filterToYear, filterToMonth - 1, 1);
            return {
                filterFromMonth: from.getMonth(), filterFromYear: from.getFullYear(),
                filterToMonth: to.getMonth(), filterToYear: to.getFullYear(),
                currentPage: 1,
            };
        });
    }

    nextMonth = () => {
        this.setState(({ filterFromMonth, filterFromYear, filterToMonth, filterToYear }) => {
            const from = new Date(filterFromYear, filterFromMonth + 1, 1);
            const to = new Date(filterToYear, filterToMonth + 1, 1);
            return {
                filterFromMonth: from.getMonth(), filterFromYear: from.getFullYear(),
                filterToMonth: to.getMonth(), filterToYear: to.getFullYear(),
                currentPage: 1,
            };
        });
    }

    handleNewExpense = event => {
        event.preventDefault();
        this.setState({ validated: true });

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        const { selectedExpenseUid, isModalAdd, selectedClientModal, selectedAttorneyModal, selectedProjectModal, selectedDate, expenseTitle, expenseTotal, selectedExpenseModal } = this.state;
        const trimmedExpenseTitle = trimString(expenseTitle);

        if (!this.isFloat(expenseTotal)) return;
        if (selectedDate == null || trimmedExpenseTitle === '' || selectedClientModal == null || selectedProjectModal == null || selectedExpenseModal == null) return;

        var att = selectedAttorneyModal?.value || this.attorney.current.props.value.value;

        const payload = {
            expenseTitle: trimmedExpenseTitle,
            expenseTotal: Number(expenseTotal),
            expenseDate: selectedDate,
            expenseClient: selectedClientModal.uid,
            expenseProject: selectedProjectModal.uid,
            expenseClass: selectedExpenseModal.value,
            expenseAttorney: att,
            isBilled: false
        };

        if (isModalAdd) {
            this.props.addExpense(payload);
            this.setState({
                ...FORM_INITIAL_STATE,
                showModal: true,
                selectedClientModal,
                selectedProjectModal,
                showSavedAlert: true,
            });
            setTimeout(() => this.setState({ showSavedAlert: false }), 3000);
        } else {
            this.setState(FORM_INITIAL_STATE);
            this.props.updateExpense(selectedExpenseUid, payload);
        }
    }

    editExpense = expense => {
        this.setState({
            selectedClientModal: { value: expense.expenseClient, label: this.props.clientsNames[expense.expenseClient], uid: expense.expenseClient },
            selectedProjectModal: { value: expense.expenseProject, label: this.props.projectsNames[expense.expenseProject], uid: expense.expenseProject },
            expenseTitle: expense.expenseTitle,
            expenseTotal: expense.expenseTotal,
            selectedDate: toDate(expense.expenseDate),
            selectedExpenseModal: expenseClasses.find(obj => obj.value === expense.expenseClass),
            showModal: true,
            isModalAdd: false,
            selectedExpenseUid: expense.uid
        });
    }

    handleDeleteExpense = () => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            this.props.deleteExpense(this.state.selectedExpenseUid);
        }
        this.setState(FORM_INITIAL_STATE);
    }

    // Returns [startDate, endDate] normalised so start <= end regardless of user input
    dateRange() {
        const { filterFromMonth, filterFromYear, filterToMonth, filterToYear } = this.state;
        const a = new Date(filterFromYear, filterFromMonth, 1);
        const b = new Date(filterToYear, filterToMonth + 1, 0);
        return a <= b ? [a, b] : [new Date(filterToYear, filterToMonth, 1), new Date(filterFromYear, filterFromMonth + 1, 0)];
    }

    filteredExpenses() {
        const { filterClient, filterUsers } = this.state;
        const [startDate, endDate] = this.dateRange();
        return (this.props.expenses || [])
            .filter(e => {
                const d = toDate(e.expenseDate);
                if (!d) return false;
                if (d < startDate || d > endDate) return false;
                if (filterClient && e.expenseClient !== filterClient.value) return false;
                if (filterUsers.length > 0 && !filterUsers.some(u => u.value === e.expenseAttorney)) return false;
                return true;
            })
            .sort((a, b) => {
                const da = toDate(a.expenseDate);
                const db = toDate(b.expenseDate);
                return (db?.getTime() || 0) - (da?.getTime() || 0);
            });
    }

    getClientOptions() {
        const { clients, clientsNames } = this.props;
        if (clients?.length > 0) {
            return clients
                .map(c => ({ value: c.uid, label: c.denomination || '' }))
                .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
        }
        return Object.entries(clientsNames || {})
            .map(([uid, name]) => ({ value: uid, label: name || '' }))
            .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
    }

    renderFilterBar(isAdmin) {
        const { filterFromMonth, filterFromYear, filterToMonth, filterToYear, filterClient, filterUsers } = this.state;
        const clientOptions = this.getClientOptions();

        const userOptions = (this.props.users || [])
            .map(u => ({ value: u.uid, label: u.name || u.uid }))
            .sort((a, b) => a.label.localeCompare(b.label));

        const isSingleMonth = filterFromMonth === filterToMonth && filterFromYear === filterToYear;
        const navLabel = isSingleMonth
            ? `${MONTHS[filterFromMonth]} ${filterFromYear}`
            : `${MONTHS[filterFromMonth].slice(0, 3)} ${filterFromYear} — ${MONTHS[filterToMonth].slice(0, 3)} ${filterToYear}`;

        const monthSelect = (value, onChange) => (
            <select
                className="form-control form-control-sm"
                style={selectStyle}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
            >
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
        );

        const yearSelect = (value, onChange) => (
            <select
                className="form-control form-control-sm"
                style={selectStyle}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
            >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
        );

        return (
            <div style={{ marginBottom: 16 }}>
                <div className="d-flex align-items-center" style={{ gap: 8, marginBottom: 10 }}>
                    <Button variant="outline-secondary" size="sm" onClick={this.prevMonth} className="legem-primary">&#8249;</Button>
                    <span style={{ minWidth: 180, textAlign: 'center', fontWeight: 600, fontSize: 15, color: 'rgb(25, 57, 145)' }}>{navLabel}</span>
                    <Button variant="outline-secondary" size="sm" onClick={this.nextMonth} className="legem-primary">&#8250;</Button>
                </div>
                <div className="d-flex align-items-center flex-wrap" style={{ gap: 12 }}>
                    <div className="d-flex align-items-center" style={{ gap: 6 }}>
                        <span style={{ fontSize: 13, color: '#555', whiteSpace: 'nowrap' }}>From</span>
                        {monthSelect(filterFromMonth, v => this.setState({ filterFromMonth: v, currentPage: 1 }))}
                        {yearSelect(filterFromYear, v => this.setState({ filterFromYear: v, currentPage: 1 }))}
                    </div>
                    <div className="d-flex align-items-center" style={{ gap: 6 }}>
                        <span style={{ fontSize: 13, color: '#555', whiteSpace: 'nowrap' }}>to</span>
                        {monthSelect(filterToMonth, v => this.setState({ filterToMonth: v, currentPage: 1 }))}
                        {yearSelect(filterToYear, v => this.setState({ filterToYear: v, currentPage: 1 }))}
                    </div>
                    <div style={{ minWidth: 190 }}>
                        <Select
                            placeholder="All clients"
                            isClearable
                            options={clientOptions}
                            value={filterClient}
                            onChange={v => this.setState({ filterClient: v, currentPage: 1 })}
                        />
                    </div>
                    {isAdmin && (
                        <div style={{ minWidth: 220 }}>
                            <Select
                                placeholder="All attorneys"
                                isMulti
                                options={userOptions}
                                value={filterUsers}
                                onChange={v => this.setState({ filterUsers: v || [], currentPage: 1 })}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    renderModal(authUser, isHidden) {
        const { selectedClientModal, selectedProjectModal, selectedDate, expenseTitle, expenseTotal, selectedExpenseModal, selectedAttorneyModal, isModalAdd, validated, showSavedAlert } = this.state;

        const clientSelect = this.props.clients?.length > 0
            ? this.props.clients.map((c) => ({
                label: c.denomination || '',
                value: c.uid,
                ...c
            })).sort((a, b) => a.label?.localeCompare(b.label))
            : Object.entries(this.props.clientsNames).map(([uid, name]) => ({
                label: name || '',
                value: uid,
                uid
            })).sort((a, b) => a.label?.localeCompare(b.label));

        const projectSelect = this.props.projectsByClient[selectedClientModal?.value]
            ? this.props.projectsByClient[selectedClientModal.value]
                .map(p => ({ label: p.title || '', value: p.uid, uid: p.uid }))
                .sort((a, b) => a.label?.localeCompare(b.label))
            : (this.props.projects || [])
                .map(p => ({ label: p.projectTitle || '', value: p.uid, uid: p.uid }))
                .sort((a, b) => a.label?.localeCompare(b.label));

        const userSelect = this.props.users !== null
            ? this.props.users.map((u) => ({
                label: u.name || '',
                value: u.uid,
                ...u
            })).sort((a, b) => a.name?.localeCompare(b.name))
            : [];

        const selectedAttorney = selectedAttorneyModal || userSelect.find(u => u.value === authUser.uid);

        return (
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isModalAdd ? 'New expense' : 'Edit expense'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showSavedAlert && <Alert variant="success">Saved!</Alert>}
                    <Form onSubmit={this.handleNewExpense}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Client</Form.Label>
                            <Col sm="7">
                                <Select isDisabled={!isModalAdd} placeholder="Select client..." options={clientSelect} value={selectedClientModal} onChange={this.handleChangeClient} />
                                {validated && selectedClientModal == null ? <Form.Text className="text-danger">Client is required.</Form.Text> : null}
                            </Col>
                        </Form.Group>

                        {selectedClientModal == null ? null : <>
                            <Form.Group as={Row}>
                                <Form.Label column sm="3">Project</Form.Label>
                                <Col sm="7">
                                    <Select isDisabled={!isModalAdd} placeholder="Select project..." options={projectSelect} value={selectedProjectModal} onChange={this.handleChangeProject} />
                                    {validated && selectedProjectModal == null ? <Form.Text className="text-danger">Project is required.</Form.Text> : null}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column sm="3">Title</Form.Label>
                                <Col sm="7">
                                    <Form.Control isInvalid={validated && trimString(expenseTitle).length === 0} name="expenseTitle" value={expenseTitle} onChange={this.onChange} as="textarea" rows="2" required />
                                    <Form.Control.Feedback type="invalid">Title cannot be empty.</Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column sm="3">Amount</Form.Label>
                                <Col sm="7">
                                    <Form.Control isInvalid={validated && !this.isFloat(expenseTotal)} name="expenseTotal" value={expenseTotal} onChange={this.onChange} required />
                                    <Form.Control.Feedback type="invalid">Amount must be greater than zero.</Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column sm="3">Date</Form.Label>
                                <Col sm="7">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="dd/MM/yyyy"
                                            margin="normal"
                                            id="date-picker-inline"
                                            label="Enter date dd/mm/yyyy"
                                            value={selectedDate}
                                            onChange={this.handleDateChange}
                                            KeyboardButtonProps={{ 'aria-label': 'change date' }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column sm="3">Type</Form.Label>
                                <Col sm="7">
                                    <Select placeholder="Select class..." options={expenseClasses} value={selectedExpenseModal} onChange={this.handleChangeExpense} />
                                    {validated && selectedExpenseModal == null ? <Form.Text className="text-danger">Type is required.</Form.Text> : null}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column sm="3">Attorney</Form.Label>
                                <Col sm="7">
                                    <Select ref={this.attorney} placeholder="Select attorney..." isDisabled={isHidden} isHidden={isHidden} options={userSelect} value={selectedAttorney} onChange={this.handleAttorneyModal} />
                                </Col>
                            </Form.Group>
                        </>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {!isModalAdd &&
                        <IconButton onClick={this.handleDeleteExpense} color="secondary" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    }
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleNewExpense}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        const { currentPage, filterFromMonth, filterFromYear, filterToMonth, filterToYear } = this.state;
        const filtered = this.filteredExpenses();
        const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
        const displayed = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

        const isSingleMonth = filterFromMonth === filterToMonth && filterFromYear === filterToYear;
        const emptyLabel = isSingleMonth
            ? `No expenses registered for ${MONTHS[filterFromMonth]} ${filterFromYear}.`
            : `No expenses found for this range.`;

        return (
            <AuthUserContext.Consumer>
                {authUser => {
                    const isAdmin = !!authUser?.roles?.[ROLES.ADMIN];
                    return (this.props.loadingProjectsMapping && Object.keys(this.props.projectsNames).length === 0)
                        ? <BarLoader css={{ width: "100%" }} loading={this.props.loadingProjectsMapping} />
                        : <div style={{ padding: '0 30px' }}>
                            {this.renderModal(authUser, !isAdmin)}

                            <div className="d-flex justify-content-between align-items-center topMargin" style={{ marginBottom: 20 }}>
                                <h5 className="blueLetters mb-0">{isAdmin ? 'Expenses' : 'My Expenses'}</h5>
                                <Button className="legem-primary" onClick={this.handleShow}>+ New expense</Button>
                            </div>

                            {this.renderFilterBar(isAdmin)}

                            {isAdmin && filtered.length > 0 && (
                                <div style={{ marginBottom: 10, fontSize: 14, color: '#555' }}>
                                    Total: <strong style={{ color: 'rgb(25, 57, 145)' }}>${filtered.reduce((sum, e) => sum + (e.expenseTotal || 0), 0).toFixed(2)}</strong>
                                </div>
                            )}

                            {filtered.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="greyLetters" style={{ fontSize: 16 }}>{emptyLabel}</p>
                                </div>
                            ) : (
                                <>
                                    <TableContainer>
                                        <Table aria-label="expenses table">
                                            <TableHead>
                                                <TableRow key="theader">
                                                    <TableCell style={{ width: isAdmin ? '28%' : '35%' }}><b>Description</b></TableCell>
                                                    <TableCell style={{ width: '10%' }}><b>Date</b></TableCell>
                                                    <TableCell style={{ width: isAdmin ? '22%' : '30%' }}><b>Type</b></TableCell>
                                                    {isAdmin && <TableCell style={{ width: '15%' }}><b>Attorney</b></TableCell>}
                                                    <TableCell style={{ width: '10%' }} className="rightAlign"><b>Amount</b></TableCell>
                                                    <TableCell style={{ width: '5%' }}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {displayed.map(row => {
                                                    const attorney = (this.props.users || []).find(u => u.uid === row.expenseAttorney);
                                                    return (
                                                        <TableRow key={row.uid}>
                                                            <TableCell>
                                                                <span className="greyLetters" style={{ fontSize: 12 }}>
                                                                    {this.props.clientsNames[row.expenseClient]} &mdash; {this.props.projectsNames[row.expenseProject]}
                                                                </span>
                                                                <br />
                                                                {row.expenseTitle}
                                                            </TableCell>
                                                            <TableCell style={{ whiteSpace: 'nowrap', color: '#555' }}>
                                                                {formatDate(toDate(row.expenseDate))}
                                                            </TableCell>
                                                            <TableCell style={{ color: '#555' }}>
                                                                {shortExpenseLabel(expenseClasses.find(c => c.value === row.expenseClass)?.label || '')}
                                                            </TableCell>
                                                            {isAdmin && (
                                                                <TableCell style={{ color: '#555' }}>
                                                                    {attorney?.name || '—'}
                                                                </TableCell>
                                                            )}
                                                            <TableCell className="rightAlign">
                                                                ${row.expenseTotal.toFixed(2)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <FontAwesomeIcon
                                                                    onClick={() => this.editExpense(row)}
                                                                    icon={faEdit}
                                                                    className="legemblue"
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {pageCount > 1 && (
                                        <div className="d-flex align-items-center justify-content-center" style={{ gap: 12, marginTop: 16, marginBottom: 8 }}>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                disabled={currentPage === 1}
                                                onClick={() => this.setState({ currentPage: currentPage - 1 })}
                                            >
                                                &#8249;
                                            </Button>
                                            <span style={{ fontSize: 14, color: '#555' }}>
                                                Page {currentPage} of {pageCount} &middot; {filtered.length} expenses
                                            </span>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                disabled={currentPage === pageCount}
                                                onClick={() => this.setState({ currentPage: currentPage + 1 })}
                                            >
                                                &#8250;
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>;
                }}
            </AuthUserContext.Consumer>
        );
    }
}

gastos.propTypes = {
    clients: PropTypes.array,
    loadingClients: PropTypes.bool,
    users: PropTypes.array,
    projectsByClient: PropTypes.object,
    projects: PropTypes.array,
    loadingUsers: PropTypes.bool,
    expenses: PropTypes.array,
    loadingExpenses: PropTypes.bool,
    clientsNames: PropTypes.object,
    projectsNames: PropTypes.object,
    loadingProjectsMapping: PropTypes.bool,
    getUsers: PropTypes.func,
    addProject: PropTypes.func,
    getProjectByClient: PropTypes.func,
    addExpense: PropTypes.func,
    subscribeToExpenses: PropTypes.func,
    subscribeToAllExpenses: PropTypes.func,
    getProjectsMapping: PropTypes.func,
    updateExpense: PropTypes.func,
    deleteExpense: PropTypes.func
};

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    getUsers,
    addProject,
    getProjectByClient,
    addExpense,
    subscribeToExpenses,
    subscribeToAllExpenses,
    getProjectsMapping,
    updateExpense,
    deleteExpense
})(withAuthorization(condition)(gastos));
