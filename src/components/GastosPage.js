import React, { Component } from 'react';
import { toDate } from '../utils/dateUtils';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Button, Modal, Form, Row, Col, Jumbotron, Container, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { updateExpense, deleteExpense, getProjectsMapping, getUsers, addProject, getProjectByClient, addExpense, subscribeToExpenses } from "../redux/actions/index";
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

const mapStateToProps = state => {
    return {
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
    };
};

const INITIAL_STATE = {
    showModal: false,
    selectedOption: null,
    selectedClientModal: null,
    validated: false,
    selectedDate: new Date(),
    selectedProjectModal: null,
    selectedExpenseModal: null,
    expenseTitle: '',
    expenseTotal: 0,
    isModalAdd: true
};

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
            this.unsubscribeExpenses = this.props.subscribeToExpenses(authUser.uid, true);
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
        this.setState({ ...INITIAL_STATE, showModal: true });
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
    };

    handleChangeExpense = selectedExpenseModal => {
        this.setState({ selectedExpenseModal });
    }

    handleAttorneyModal = selectedAttorneyModal => {
        this.setState({ selectedAttorneyModal });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
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
                ...INITIAL_STATE,
                showModal: true,
                selectedClientModal,
                selectedProjectModal,
                showSavedAlert: true,
            });
            setTimeout(() => this.setState({ showSavedAlert: false }), 3000);
        } else {
            this.setState(INITIAL_STATE);
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
        if(window.confirm('Are you sure you want to delete this expense?')) {
            this.props.deleteExpense(this.state.selectedExpenseUid);
        }
        this.setState(INITIAL_STATE);
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

        const userSelect = this.props.users !== null ?
            this.props.users.map((u) => ({
                label: u.name || '',
                value: u.uid,
                ...u
            })).sort((a, b) => a.name?.localeCompare(b.name)) : [];

        const selectedAttorney = selectedAttorneyModal || userSelect.find(u => u.value === authUser.uid);
        return (
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showSavedAlert && <Alert variant="success">Saved!</Alert>}
                    <Form onSubmit={this.handleNewExpense}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Client
                        </Form.Label>
                            <Col sm="7">
                                <Select isDisabled={!isModalAdd} placeholder="Select client..." options={clientSelect} value={selectedClientModal} onChange={this.handleChangeClient} />
                                {validated && selectedClientModal == null ? <Form.Text className="text-danger">Client is required.</Form.Text> : null}
                            </Col>
                        </Form.Group>

                        {
                            selectedClientModal == null ? null :
                                <>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">
                                                Project
                                            </Form.Label>
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
                                                {/* DATE PICKER */}
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
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
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
                                </>
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {
                        isModalAdd ? null : 
                        <IconButton onClick={this.handleDeleteExpense} color="secondary" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    }
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleNewExpense} >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }


    render() {
        const expenses = this.props.expenses !== null ?
            this.props.expenses.map((e) => ({
                ...e
            })) : [];
            
        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    (this.props.loadingProjectsMapping && Object.keys(this.props.projectsNames).length === 0) ? <BarLoader css={{width: "100%"}} loading={this.props.loadingProjectsMapping}></BarLoader> :
                    <div>
                        {/* MODAL */}
                        <Button className="legem-primary" size="lg" block onClick={this.handleShow}>
                            New expense
                        </Button>

                        {this.renderModal(authUser, !authUser?.roles[ROLES.ADMIN])}

                        {/* JUMBOTRON SHOWS IF USER HAS NO REGISTERED EXPENSES*/}
                        {
                            expenses.length === 0 ? 
                            <Jumbotron fluid>
                                <Container>
                                    <h1>You have no registered expenses</h1>
                                </Container>
                            </Jumbotron>
                            :
                            <div className="tableMargins topMargin">
                                <TableContainer>
                                    <Table aria-label="simple table">
                                        <colgroup>
                                            <col width="80%" />
                                            <col width="10%" />
                                            <col width="5%" />
                                            <col width="5%" />
                                        </colgroup>
                                        <TableHead>
                                            <TableRow key="theader">
                                                <TableCell><b>Registered expenses</b></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {expenses.map((row) => (
                                                <TableRow key={row.uid}>
                                                    <TableCell>
                                                        <OverlayTrigger overlay={
                                                            <Tooltip>
                                                                {toDate(row.expenseDate)?.toDateString()}
                                                                <br/>
                                                                {expenseClasses.find(obj => {
                                                                    return obj.value === row.expenseClass;
                                                                })?.label  }
                                                            </Tooltip>}>
                                                            <span className="d-inline-block">
                                                                {this.props.clientsNames[row.expenseClient]} - {this.props.projectsNames[row.expenseProject]}
                                                                <br/>
                                                                {row.expenseTitle}
                                                            </span>
                                                        </OverlayTrigger>
                                                    </TableCell>
                                                        <TableCell className="rightAlign"> ${row.expenseTotal.toFixed(2)} </TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell>
                                                        <FontAwesomeIcon onClick={() => this.editExpense(row)} icon={faEdit} className="legemblue" />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        }
                    </div>
                }
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
    getProjectsMapping,
    updateExpense,
    deleteExpense
})(withAuthorization(condition)(gastos));
