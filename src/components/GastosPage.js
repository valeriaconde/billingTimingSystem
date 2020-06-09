import React, { Component } from 'react';
import Select from 'react-select';
import { Button, Modal, Form, Row, Col, Jumbotron, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { addAlert, clearAlert, getClients, getUsers, addProject, getProjectByClient, addExpense, getExpenses } from "../redux/actions/index";
import BarLoader from "react-spinners/BarLoader";
import { connect } from "react-redux";
import DateFnsUtils from '@date-io/date-fns';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import * as ROLES from '../constants/roles';
import { expenseClasses } from "../constants/enums";

const mapStateToProps = state => {
    return {
        alerts: state.alerts,
        clients: state.clients,
        loadingClients: state.loadingClients,
        users: state.users,
        projects: state.projects,
        loadingUsers: state.loadingUsers,
        loadingProjects: state.loadingProjects,
        expenses: state.expenses,
        loadingExpenses: state.loadingExpenses,
        loadedExpenseOnce: state.loadedExpenseOnce
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
    expenseTotal: 0
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
    }

    isFloat(n) {
        return n.length > 0 && !isNaN(n) && n > 0;
    }

    handleShow = () => {
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

        const { selectedClientModal, selectedAttorneyModal, selectedProjectModal, selectedDate, expenseTitle, expenseTotal, selectedExpenseModal } = this.state;

        if (!this.isFloat(expenseTotal)) return;
        if (expenseTitle === '' || selectedClientModal == null || selectedProjectModal == null || selectedExpenseModal == null) return;

        var att = selectedAttorneyModal || this.attorney.current.props.value.value;
        const payload = {
            expenseTitle: expenseTitle,
            expenseTotal: Number(expenseTotal),
            expenseDate: selectedDate,
            expenseClient: selectedClientModal.uid,
            expenseProject: selectedProjectModal.uid,
            expenseClass: selectedExpenseModal.value,
            expenseAttorney: att
        };

        this.setState({ showModal: false });
        this.props.addExpense(selectedClientModal.uid, selectedProjectModal.uid, payload);
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

        const { selectedClientModal, selectedProjectModal, selectedDate, expenseTitle, expenseTotal, selectedExpenseModal, selectedAttorneyModal } = this.state;
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
                                <Select placeholder="Select client..." options={clientSelect} value={selectedClientModal} onChange={this.handleChangeClient} />
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
                                                <Select placeholder="Select project..." options={projectSelect} value={selectedProjectModal} onChange={this.handleChangeProject} />
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
                                                {/* DAY PICKER */}
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
                                </>)
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
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

    getExpenses(authUser) {
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
                    <div>
                        {/* MODAL */}
                        <Button className="legem-primary" size="lg" block onClick={this.handleShow}>
                            New expense
                        </Button>

                        {this.renderModal(authUser, !authUser?.roles[ROLES.ADMIN])}

                        {/* EXPENSES */}
                        {this.getExpenses(authUser)}
                        {/* JUMBOTRON SHOWS IF USER HAS NO REGISTERED EXPENSES*/}
                        <Jumbotron fluid>
                            <Container>
                                <h1>You have no registered expenses</h1>
                            </Container>
                        </Jumbotron>

                        {/* SE MUESTRAN EN ORDEN CRONOLOGICO */}
                        <div className="tableMargins ">
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <colgroup>
                                        <col width="80%" />
                                        <col width="10%" />
                                        <col width="5%" />
                                        <col width="5%" />
                                    </colgroup>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Registered expenses</b></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <OverlayTrigger overlay={
                                                    <Tooltip id="tooltip">
                                                        DATE
                                                        <br/>
                                                        TYPE
                                                    </Tooltip>}>
                                                    <span className="d-inline-block">
                                                        CLIENTE - PROYECTO
                                                        <br/>
                                                        TITULO
                                                    </span>
                                                </OverlayTrigger>
                                            </TableCell>
                                            <TableCell className="rightAlign"> MONTO </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>
                                                <FontAwesomeIcon icon={faEdit} className="legemblue" />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    clearAlert,
    addAlert,
    getClients,
    getUsers,
    addProject,
    getProjectByClient,
    addExpense,
    getExpenses
})(withAuthorization(condition)(gastos));