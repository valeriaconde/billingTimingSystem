import React, { Component } from 'react';
import Select from 'react-select';
import { Button, Modal, Form, Row, Col, Jumbotron, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { updateExpense, deleteExpense, getProjectsMapping, getClients, getUsers, addProject, getProjectByClient, addExpense, getExpenses } from "../redux/actions/index";
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

const mapStateToProps = state => {
    return {
        clients: state.clients,
        loadingClients: state.loadingClients,
        users: state.users,
        projects: state.projects,
        loadingUsers: state.loadingUsers,
        loadingProjects: state.loadingProjects,
        expenses: state.expenses,
        loadingExpenses: state.loadingExpenses,
        loadedExpenseOnce: state.loadedExpenseOnce,
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

    componentDidMount() {
        if (this.props.clients.length === 0) {
            this.props.getClients();
        }

        if (this.props.users.length === 0) {
            this.props.getUsers();
        }

        if (Object.keys(this.props.projectsNames).length === 0) {
            this.props.getProjectsMapping();
        }
    }

    isFloat(n) {
        n = n.toString();
        return n.length > 0 && !isNaN(n) && n > 0;
    }

    handleShow = () => {
        this.setState(INITIAL_STATE);
        this.setState({ showModal: true });
    }

    handleClose() {
        this.setState({ showModal: false });
    }

    handleChangeClient = selectedClientModal => {
        this.setState({ selectedClientModal, selectedProjectModal: null });
        this.props.getProjectByClient(selectedClientModal.value);
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

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        const { selectedExpenseUid, isModalAdd, selectedClientModal, selectedAttorneyModal, selectedProjectModal, selectedDate, expenseTitle, expenseTotal, selectedExpenseModal } = this.state;

        if (!this.isFloat(expenseTotal)) return;
        if (selectedDate == null || expenseTitle === '' || selectedClientModal == null || selectedProjectModal == null || selectedExpenseModal == null) return;

        var att = selectedAttorneyModal?.value || this.attorney.current.props.value.value;

        const payload = {
            expenseTitle: expenseTitle,
            expenseTotal: Number(expenseTotal),
            expenseDate: selectedDate,
            expenseClient: selectedClientModal.uid,
            expenseProject: selectedProjectModal.uid,
            expenseClass: selectedExpenseModal.value,
            expenseAttorney: att,
            isBilled: false
        };

        this.setState(INITIAL_STATE);

        if (isModalAdd) this.props.addExpense(payload);
        else this.props.updateExpense(selectedExpenseUid, payload);
    }

    editExpense = expense => {
        this.setState({
            selectedClientModal: { value: expense.expenseClient, label: this.props.clientsNames[expense.expenseClient], uid: expense.expenseClient },
            selectedProjectModal: { value: expense.expenseProject, label: this.props.projectsNames[expense.expenseProject], uid: expense.expenseProject },
            expenseTitle: expense.expenseTitle,
            expenseTotal: expense.expenseTotal,
            selectedDate: expense.expenseDate.toDate(),
            selectedExpenseModal: expenseClasses.find(obj => obj.value === expense.expenseClass),
            showModal: true,
            isModalAdd: false,
            selectedExpenseUid: expense.uid
        });
    }

    handleDeleteExpense = event => {
        if(window.confirm('Are you sure you want to delete this expense?')) {
            this.props.deleteExpense(this.state.selectedExpenseUid);
        }
        this.setState(INITIAL_STATE);
    }

    renderModal(authUSer, isHidden) {
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c, i) => ({
                label: c.denomination,
                value: c.uid,
                ...c
            })).sort((a, b) => a.label.localeCompare(b.label)) : [];

        const projectSelect = this.props.projects !== null ?
            this.props.projects.map((p, i) => ({
                label: p.projectTitle,
                value: p.uid,
                ...p
            })).sort((a, b) => a.label.localeCompare(b.label)) : [];

        const userSelect = this.props.users !== null ?
            this.props.users.map((u, i) => ({
                label: u.name,
                value: u.uid,
                ...u
            })).sort((a, b) => a.name.localeCompare(b.name)) : [];

        const idx = userSelect.map(function (u) { return u.value }).indexOf(authUSer.uid);

        const { selectedClientModal, selectedProjectModal, selectedDate, expenseTitle, expenseTotal, selectedExpenseModal, selectedAttorneyModal, isModalAdd } = this.state;
        const selectedAttorney = selectedAttorneyModal || userSelect[idx];
        return (
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleNewExpense}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Client
                        </Form.Label>
                            <Col sm="7">
                                <Select isDisabled={!isModalAdd} placeholder="Select client..." options={clientSelect} value={selectedClientModal} onChange={this.handleChangeClient} />
                            </Col>
                        </Form.Group>

                        {
                            selectedClientModal == null ? null :
                                (this.props.loadingProjects ? <BarLoader css={{ width: "100%" }} loading={this.props.loadingUsers}></BarLoader> :
                                    <>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">
                                                Project
                                            </Form.Label>
                                            <Col sm="7">
                                                <Select isDisabled={!isModalAdd} placeholder="Select project..." options={projectSelect} value={selectedProjectModal} onChange={this.handleChangeProject} />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">Title</Form.Label>
                                            <Col sm="7">
                                                <Form.Control isInvalid={expenseTitle.length === 0} name="expenseTitle" value={expenseTitle} onChange={this.onChange} as="textarea" rows="2" required />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">Amount</Form.Label>
                                            <Col sm="7">
                                                <Form.Control isInvalid={!this.isFloat(expenseTotal)} name="expenseTotal" value={expenseTotal} onChange={this.onChange} required />
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
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">Attorney</Form.Label>
                                            <Col sm="7">
                                                <Select ref={this.attorney} placeholder="Select attorney..." isDisabled={isHidden} isHidden={isHidden} options={userSelect} value={selectedAttorney} onChange={this.handleAttorneyModal} />
                                            </Col>
                                        </Form.Group>
                                    </>
                                )
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

    getExpenses = authUser => {
        let self = this;
        if(!self.props.loadedExpenseOnce) {
            self.props.getExpenses(authUser.uid, true);
        }
        return null;
    };

    render() {
        const expenses = this.props.expenses !== null ?
            this.props.expenses.map((e, i) => ({
                ...e
            })) : [];
            
        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    this.props.loadingProjectsMapping ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                    <div>
                        {/* MODAL */}
                        <Button className="legem-primary" size="lg" block onClick={this.handleShow}>
                            New expense
                        </Button>

                        {this.renderModal(authUser, !authUser?.roles[ROLES.ADMIN])}

                        {/* EXPENSES */}
                        {this.getExpenses(authUser)}
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
                                                                {row.expenseDate?.toDate().toDateString()}
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
                                                        <TableCell className="rightAlign"> ${row.expenseTotal} </TableCell>
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

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    getClients,
    getUsers,
    addProject,
    getProjectByClient,
    addExpense,
    getExpenses,
    getProjectsMapping,
    updateExpense,
    deleteExpense
})(withAuthorization(condition)(gastos));