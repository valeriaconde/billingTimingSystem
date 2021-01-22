import React, { Component } from 'react';
import Select from 'react-select';
import { Container, Row, Col, Card, Button, Form, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import BarLoader from "react-spinners/BarLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import * as ROLES from '../constants/roles';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { addAlert, addTime, deleteProject, updateProject, addExpense, deletePayment, updateTime, deleteTime, updateExpense, deleteExpense, getProjectById, getProjectsMapping, getClients, getUsers, getTimes, getExpenses, addDownPayment, getPayments } from "../redux/actions/index";
import { AlertType } from '../stores/AlertStore';
import { connect } from "react-redux";
import { expenseClasses } from "../constants/enums";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

const mapStateToProps = state => {
    return {
        loadingProjects: state.loadingProjects,
        projects: state.projects,
        project: state.project,
        users: state.users,
        loadingUsers: state.loadingUsers,
        clients: state.clients,
        clientsNames: state.clientsNames,
        expenses: state.expenses,
        loadingExpenses: state.loadingExpenses,
        times: state.times,
        loadingTimes: state.loadingTimes,
        projectsNames: state.projectsNames,
        loadingProjectsMapping: state.loadingProjectsMapping,
        loadedPaymentsOnce: state.loadedPaymentsOnce,
        payments: state.payments,
        loadingProject: state.loadingProject
     };
};

const INITIAL_STATE = {
    showModal: false,
    showExpenseModal: false,
    showTimeModal: false,
    showEditModal: false,
    selectedDate: new Date(),
    paymentTotal: 0,
    timeMinutes: 15,
    selectedOption: null,
    selectedClientModal: null,
    validated: false,
    selectedProjectModal: null,
    selectedExpenseModal: null,
    expenseTitle: '',
    expenseTotal: 0,
    timeTitle: '',
    timeHours: 0,
    hourlyRate: 0,
    isModalAdd: true,
    projectTitle: null
};

class detailedProject extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE, clientId: this.props.match.params.clientId, projectId: this.props.match.params.projectId  };
        this.attorney = React.createRef();
        this.hour = React.createRef();
    }

    componentDidMount() {
        this.props.getProjectById(this.props.match.params.projectId);

        if (this.props.clients.length === 0) {
            this.props.getClients();
        }

        if (this.props.users.length === 0) {
            this.props.getUsers();
        }

        if (Object.keys(this.props.projectsNames).length === 0) {
            this.props.getProjectsMapping();
        }

        let self = this;
        self.props.getTimes(this.props.match.params.projectId, false);
        self.props.getExpenses(this.props.match.params.projectId, false);
        self.props.getPayments(this.props.match.params.projectId);
    }

    isFloat(n) {
        n = n?.toString();
        return n?.length > 0 && !isNaN(n) && n >= 0;
    }

    handleChangeExpense = selectedExpenseModal => {
        this.setState({ selectedExpenseModal });
    }

    handleAttorneyModal = selectedAttorneyModal => {
        this.setState({ selectedAttorneyModal });

        const userSelect = this.props.users !== null ?
            this.props.users.map((u) => ({
                label: u.name,
                value: u.uid,
                ...u
            })).sort((a, b) => a.name?.localeCompare(b.name)) : [];
        const idx = userSelect.map(function (u) { return u.value }).indexOf(selectedAttorneyModal.uid);
        const selectedHourlyRate = userSelect[idx]?.salary;
        this.setState({ hourlyRate: selectedHourlyRate });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleShow = modal => {
        if (modal === 1) this.setState({ showModal: true });
        else if(modal === 2) this.setState({ showExpenseModal: true });
        else if(modal === 3) this.setState({ showTimeModal: true });
        else if(modal === 4) this.setState({ showEditModal: true });
    }

    handleClose = modal => {
        if(modal === 1) this.setState({ showModal: false });
        else if(modal === 2) this.setState({ showExpenseModal: false });
        else if(modal === 3) this.setState({ showTimeModal: false });
        else if(modal === 4) this.setState({ showEditModal: false });
    }

    handleDateChange = selectedDate => {
        this.setState({ selectedDate });
    };

    handleNewPayment = event => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        const { paymentTotal, selectedDate } = this.state;

        if (!this.isFloat(paymentTotal)) return;
        if (selectedDate == null) return;

        const payload = {
            paymentTotal: Number(paymentTotal),
            paymentDate: selectedDate,
            paymentProject: this.props.match.params.projectId
        };

        this.setState(INITIAL_STATE);

        this.props.addDownPayment(payload);
    }

    renderModal() {
        const { selectedDate, paymentTotal } = this.state;

        return (
            <Modal show={this.state.showModal} onHide={() => this.handleClose(1)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add down payment</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Date</Form.Label>
                            <Col sm="7">
                                {/* DAY PICKER */}
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        
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
                            <Form.Label column sm="3">Amount</Form.Label>
                            <Col sm="7">
                                <Form.Control isInvalid={!this.isFloat(paymentTotal)} name="paymentTotal" value={paymentTotal} onChange={this.onChange} required />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.handleClose(1)}>
                        Cancel
                            </Button>
                    <Button className="legem-primary" onClick={this.handleNewPayment}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
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
            selectedAttorneyModal: { value: expense.expenseAttorney, label: this.props.users.find(u => u.uid === expense.expenseAttorney)?.name},
            expenseTitle: expense.expenseTitle,
            expenseTotal: expense.expenseTotal,
            selectedDate: expense.expenseDate.toDate(),
            selectedExpenseModal: expenseClasses.find(obj => obj.value === expense.expenseClass),
            showExpenseModal: true,
            isModalAdd: false,
            selectedExpenseUid: expense.uid
        });
    }

    handleAddExpense = () => {
        this.setState({ 
            showExpenseModal: true, 
            isModalAdd: true,
            selectedClientModal: { value: this.props.match.params.clientId, label: this.props.clientsNames[this.props.match.params.clientId], uid: this.props.match.params.clientId },
            selectedProjectModal: { value: this.props.match.params.projectId, label: this.props.projectsNames[this.props.match.params.projectId], uid: this.props.match.params.projectId }, 
        });
    }

    handleDeleteExpense = event => {
        if(window.confirm('Are you sure you want to delete this expense?')) {
            this.props.deleteExpense(this.state.selectedExpenseUid);
        }
        this.setState(INITIAL_STATE);
    }

    renderExpenseModal(authUSer, isHidden) {
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c, i) => ({
                label: c.denomination,
                value: c.uid,
                ...c
            })).sort((a, b) => a.label?.localeCompare(b.label)) : [];

        const projectSelect = this.props.projects !== null ?
            this.props.projects.map((p, i) => ({
                label: p.projectTitle,
                value: p.uid,
                ...p
            })).sort((a, b) => a.label?.localeCompare(b.label)) : [];

        const userSelect = this.props.users !== null ?
            this.props.users.map((u, i) => ({
                label: u.name,
                value: u.uid,
                ...u
            })).sort((a, b) => a.name?.localeCompare(b.name)) : [];

        const idx = userSelect.map(function (u) { return u.value }).indexOf(authUSer.uid);

        const { selectedClientModal, selectedProjectModal, selectedDate, expenseTitle, expenseTotal, selectedExpenseModal, selectedAttorneyModal, isModalAdd } = this.state;
        const selectedAttorney = selectedAttorneyModal || userSelect[idx];
        return (
            <Modal show={this.state.showExpenseModal} onHide={() => this.handleClose(2)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleNewExpense}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Client
                        </Form.Label>
                            <Col sm="7">
                                <Select isDisabled={true} placeholder="Select client..." options={clientSelect} value={selectedClientModal} onChange={this.handleChangeClient} />
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
                                                <Select isDisabled={true} placeholder="Select project..." options={projectSelect} value={selectedProjectModal} onChange={this.handleChangeProject} />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">Title</Form.Label>
                                            <Col sm="7">
                                                <Form.Control isInvalid={expenseTitle?.length === 0} name="expenseTitle" value={expenseTitle} onChange={this.onChange} as="textarea" rows="2" required />
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
                    <Button variant="secondary" onClick={() => this.handleClose(2)}>
                        Cancel
                    </Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleNewExpense} >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    handleAddTime = () => {
        this.setState({ 
            showTimeModal: true, 
            isModalAdd: true,
            selectedClientModal: { value: this.props.match.params.clientId, label: this.props.clientsNames[this.props.match.params.clientId], uid: this.props.match.params.clientId },
            selectedProjectModal: { value: this.props.match.params.projectId, label: this.props.projectsNames[this.props.match.params.projectId], uid: this.props.match.params.projectId }, 
        });
    }

    handleNewTime = event => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        const { selectedTimeUid, timeHours, timeMinutes, selectedClientModal, selectedProjectModal, selectedDate, timeTitle, selectedAttorneyModal, isModalAdd, hourlyRate } = this.state;
        
        if (!this.isFloat(timeHours)) return;
        if (selectedDate == null || timeTitle === '' || selectedClientModal == null || selectedProjectModal == null || timeMinutes == null) return;
        var att = selectedAttorneyModal?.value || this.attorney?.current.props.value.value;
        var hr = hourlyRate || this.hour.current.value;
        const timeTotal = +hr * (+timeHours + timeMinutes / 60.0);
        const payload = {
            timeTitle: timeTitle,
            timeDate: selectedDate,
            timeClient: selectedClientModal.uid,
            timeProject: selectedProjectModal.uid,
            timeAttorney: att,
            timeHours: timeHours,
            timeMinutes: timeMinutes,
            timeTotal: timeTotal,
            hourlyRate: hr,
            isBilled: false
        };

        this.setState(INITIAL_STATE);
        if(isModalAdd) this.props.addTime(payload);
        else this.props.updateTime(selectedTimeUid, payload);
    }

    editTime = time => {
        this.setState({
            selectedClientModal: { value: time.timeClient, label: this.props.clientsNames[time.timeClient], uid: time.timeClient },
            selectedProjectModal: { value: time.timeProject, label: this.props.projectsNames[time.timeProject], uid: time.timeProject },
            selectedAttorneyModal: { value: time.timeAttorney, label: this.props.users.find(u => u.uid === time.timeAttorney)?.name},
            timeTitle: time.timeTitle,
            selectedDate: time.timeDate.toDate(),
            timeHours: time.timeHours,
            timeMinutes: time.timeMinutes,
            showTimeModal: true,
            isModalAdd: false,
            selectedTimeUid: time.uid
        });
    }

    handleDeleteTime = event => {
        if(window.confirm('Are you sure you want to delete this time?')) {
            this.props.deleteTime(this.state.selectedTimeUid);
        }
        this.setState(INITIAL_STATE);
    }

    renderTimeModal(authUser, isHidden) {
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c) => ({
                label: c.denomination,
                value: c.uid,
                ...c
            })).sort((a, b) => a.label?.localeCompare(b.label)) : [];

        const projectSelect = this.props.projects !== null ?
            this.props.projects.map((p) => ({
                label: p.projectTitle,
                value: p.uid,
                ...p
            })).sort((a, b) => a.label?.localeCompare(b.label)) : [];

        const userSelect = this.props.users !== null ?
            this.props.users.map((u) => ({
                label: u.name,
                value: u.uid,
                ...u
            })).sort((a, b) => a.name?.localeCompare(b.name)) : [];

        const idx = userSelect.map(function (u) { return u.value }).indexOf(authUser.uid);
        const { timeHours, timeMinutes, selectedClientModal, selectedProjectModal, selectedDate, timeTitle, selectedAttorneyModal, isModalAdd, hourlyRate } = this.state;
        const selectedAttorney = selectedAttorneyModal || userSelect[idx];
        const selectedHourlyRate = hourlyRate || userSelect[idx]?.salary;

        return (
            <Modal show={this.state.showTimeModal} onHide={() => this.handleClose(3)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Time</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Client
                            </Form.Label>
                            <Col sm="7">
                                <Select isDisabled={true} placeholder="Select client..." options={clientSelect} value={selectedClientModal} onChange={this.handleChangeClient} />
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
                                        <Select isDisabled={true} placeholder="Select project..." options={projectSelect} value={selectedProjectModal} onChange={this.handleChangeProject} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">Title</Form.Label>
                                    <Col sm="7">
                                        <Form.Control isInvalid={timeTitle?.length === 0} name="timeTitle" value={timeTitle} onChange={this.onChange} as="textarea" rows="2" required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">
                                        Date
                                    </Form.Label>
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
                                    <Form.Label column sm="3">
                                        Time
                                    </Form.Label>
                                    <Col sm="7">
                                        <Container>
                                            <Row>
                                                <Col>
                                                    <Form.Control isInvalid={timeHours < 0 || timeHours > 100} value={timeHours} name="timeHours" onChange={this.onChange} type="number" min="0" max="100" required />
                                                </Col>
                                                <Col>
                                                    <Form.Control name="timeMinutes" value={timeMinutes} onChange={this.onChange} as="select" required >
                                                        <option value={0}>0</option>
                                                        <option value={15}>15</option>
                                                        <option value={30}>30</option>
                                                        <option value={45}>45</option>
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col><Form.Label> hours </Form.Label></Col>
                                                <Col><Form.Label> minutes </Form.Label></Col>
                                            </Row>
                                        </Container>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">Attorney</Form.Label>
                                    <Col sm="7">
                                        <Select ref={this.attorney} placeholder="Select attorney..." isDisabled={isHidden} isHidden={isHidden} options={userSelect} value={selectedAttorney} onChange={this.handleAttorneyModal} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">Hourly Rate</Form.Label>
                                    <Col sm="7">
                                        <Form.Control ref={this.hour} isInvalid={selectedHourlyRate <= 0} value={selectedHourlyRate} name="hourlyRate" onChange={this.onChange} type="number" min="0" required />
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
                        <IconButton onClick={this.handleDeleteTime} color="secondary" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    }
                    <Button variant="secondary" onClick={() => this.handleClose(3)}>
                        Cancel
                    </Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleNewTime}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    handleDeletePayment = payment => {
        if(window.confirm('Are you sure you want to delete this down payment?')) {
            this.props.deletePayment(payment.uid);
        }
        this.setState(INITIAL_STATE);
    }

    archiveProject = event => {
        let payload = this.props.project;
        payload.isOpen = false;

        if(window.confirm('Are you sure you want to archive this project?')) {
            this.props.updateProject(this.props.match.params.projectId, payload);
        }
    }

    onDelete = event => {
        if(window.confirm('Are you sure you want to delete this project?')) {
            this.props.deleteProject(this.props.match.params.projectId);
            this.props.history.push('/projects');
            this.props.addAlert(AlertType.Success, "Project successfully deleted.");
        }
    }

    handleEditProject = event => {
        event.preventDefault();
        this.setState({ validated: true });
        const { projectTitle } = this.state;

        if(projectTitle === '') return;

        let payload = this.props.project;
        payload.projectTitle = projectTitle;

        this.props.updateProject(this.props.match.params.projectId, payload);
        this.setState({ ...INITIAL_STATE });
    }

    renderEditModal(){
        const { showEditModal } = this.state;
        const projectTitle = this.state.projectTitle ?? this.props.project?.projectTitle;

        return(
            <Modal show={showEditModal} onHide={() => this.handleClose(4)}>
                <Modal.Header closeButton>
                    <Modal.Title>New project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleNewProject}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Title</Form.Label>
                            <Col sm="9">
                                <Form.Control isInvalid={projectTitle?.length === 0} name="projectTitle" value={projectTitle} onChange={this.onChange} as="textarea" rows="2" required/>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.handleClose(4)}>Cancel</Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleEditProject}> Save </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        const expenses = this.props.expenses !== null ?
            this.props.expenses.map((e, i) => ({
                ...e
            })) : [];

        // eslint-disable-next-line no-extend-native
        Array.prototype.sum = function (prop) {
            var total = 0
            for ( var i = 0, _len = this.length; i < _len; i++ ) {
                total += this[i][prop]
            }
            return total
        }

        const times = this.props.times !== null ?
            this.props.times.map(t => ({
                ...t
            })) : [];

        const payments = this.props.payments !== null ?
            this.props.payments.map(p => ({
                ...p
            })) : [];

        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    this.props.loadingProject || this.props.loadingProjects || this.props.loadingExpenses || this.props.loadingTimes || this.props.loadingUsers ? 
                    <BarLoader css={{width: "100%"}} loading={this.props.loadingProjects}></BarLoader> :
                    <div>
                        {this.renderModal()}
                        {this.renderExpenseModal(authUser, !authUser?.roles[ROLES.ADMIN])}
                        {this.renderTimeModal(authUser, !authUser?.roles[ROLES.ADMIN])}
                        {this.renderEditModal()}

                        <h3 className="blueLetters topMargin leftMargin"> {this.props.project?.projectTitle} </h3>
                        <h6 className="bigLeftMargin"> For {this.props.clientsNames[this.state.clientId]} </h6>

                        <Container className="bigTopMargin">
                            <Row>
                                <Col className="bigLeftMargin">
                                    <Card style={{ width: '18rem' }} >
                                        <Card.Body>
                                            <Card.Title>Attorney</Card.Title>
                                            <Card.Text> { this.props.users.find(u => u.uid === this.props.project?.appointedIds)?.name || "None" } </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    <Card style={{ width: '18rem' }} className="topMargin">
                                        <Card.Body>
                                            <Card.Title> Billed by { this.props.project?.projectFixedFee ? "fixed fee" : "by the hour" } </Card.Title>
                                            <Card.Text> { this.props.project?.projectFixedFee ? `$${this.props.project?.projectFee}` : null } </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="leftMargin">
                                    <Card style={{ width: '22rem' }} >
                                        <Card.Body>
                                            <Card.Title>Down payments</Card.Title>
                                            <TableContainer>
                                                <Table aria-label="simple table">
                                                    <TableBody>
                                                        {payments.map((row) => (
                                                            <TableRow key={row.uid}>
                                                                <TableCell>{row.paymentDate?.toDate().toDateString()}</TableCell>
                                                                <TableCell className="centerText">${row.paymentTotal}</TableCell>
                                                                <TableCell>
                                                                    <IconButton onClick={() => this.handleDeletePayment(row)} color="secondary" aria-label="delete">
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Card.Body>
                                        <Card.Body className="rightAlign">
                                            <Button variant="outline-success" onClick={() => this.handleShow(1)} >Add</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>

                        {/* EXPENSES TABLE */}
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
                                            <TableCell>
                                                <b>Registered expenses</b>
                                                <IconButton onClick={this.handleAddExpense} aria-label="Add expense">
                                                    <AddIcon className="legemblue" />
                                                </IconButton>
                                            </TableCell>
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
                                                            {`${this.props.users.find(u => u.uid === row.expenseAttorney)?.name} - ${row.expenseTitle}`}
                                                        </span>
                                                    </OverlayTrigger>
                                                </TableCell>
                                                    <TableCell className="rightAlign"> ${row.expenseTotal} </TableCell>
                                                <TableCell>
                                                    <OverlayTrigger overlay={<Tooltip id="tooltip">Billed</Tooltip>}>
                                                        <span className="d-inline-block">
                                                            {row.isBilled ? <FontAwesomeIcon icon={faCheckCircle} color="green" /> : null}
                                                        </span>
                                                    </OverlayTrigger>
                                                </TableCell>
                                                <TableCell>
                                                    <FontAwesomeIcon onClick={() => this.editExpense(row)} icon={faEdit} className="legemblue" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        }
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell className="rightAlign">${expenses.sum("expenseTotal")}</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <b>Registered time</b>
                                                <IconButton onClick={this.handleAddTime} aria-label="Add time">
                                                    <AddIcon className="legemblue" />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                        {times.map((row) => (
                                        <TableRow key={row.uid}>
                                            <TableCell>
                                                <OverlayTrigger overlay={
                                                    <Tooltip>
                                                        {row.timeDate?.toDate().toDateString()}
                                                    </Tooltip>
                                                }>
                                                    <span className="d-inline-block">
                                                        {`${this.props.users.find(u => u.uid === row.timeAttorney)?.name} - ${row.timeTitle}`}
                                                    </span>
                                                </OverlayTrigger>
                                            </TableCell>
                                            <TableCell className="rightAlign">{`$${row.timeTotal}`}</TableCell>
                                            <TableCell>{`${row.timeHours}:${row.timeMinutes > 0 ? row.timeMinutes : '00'} hrs`}</TableCell>
                                            <TableCell>
                                                <FontAwesomeIcon onClick={() => this.editTime(row)} icon={faEdit} className="legemblue" />
                                            </TableCell>
                                        </TableRow>
                                        ))
                                        }
                                        <TableRow>
                                            <TableCell>Total </TableCell>
                                            <TableCell className="rightAlign">${times.sum("timeTotal")}</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <br />
                        <div className="rightAlign biggerRightMargin bottomMargin">
                            <IconButton onClick={this.onDelete} color="secondary" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                            <Button onClick={() => this.handleShow(4)} variant="outline-dark">Edit project</Button>
                            &nbsp;&nbsp;
                            <Button onClick={this.archiveProject} variant="outline-danger">Archive project</Button>{' '}
                        </div>
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    getProjectById,
    getClients,
    getProjectsMapping,
    getUsers,
    getTimes,
    getExpenses,
    addDownPayment,
    getPayments,
    updateExpense,
    deleteExpense,
    updateTime,
    deleteTime,
    deletePayment,
    addTime,
    addExpense,
    updateProject,
    deleteProject,
    addAlert
})(withAuthorization(condition)(detailedProject));