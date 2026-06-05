import React, { Component } from 'react';
import { toDate } from '../utils/dateUtils';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Button, Form, Modal, Row, Col } from 'react-bootstrap';
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
import { addAlert, addTime, deleteProject, updateProject, updateClient, addExpense, updateTime, deleteTime, updateExpense, deleteExpense, getProjectById, getProjectsMapping, getUsers, subscribeToTimes, subscribeToExpenses } from "../redux/actions/index";
import { AlertType } from '../stores/AlertStore';
import { connect } from "react-redux";
import { expenseClasses } from "../constants/enums";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { trimString } from '../utils/inputUtils';
import '../styles/DetailedProject.css';

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
        loadingProject: state.loadingProject
     };
};

const INITIAL_STATE = {
    showModal: false,
    showExpenseModal: false,
    showTimeModal: false,
    showEditModal: false,
    selectedDate: new Date(),
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

const getUserName = (users, uid) => users.find(u => u.uid === uid)?.name || 'Unknown user';

class detailedProject extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE, clientId: this.props.match.params.clientId, projectId: this.props.match.params.projectId  };
        this.attorney = React.createRef();
        this.hour = React.createRef();
    }

    componentDidMount() {
        const { projectId } = this.props.match.params;
        this.props.getProjectById(projectId);
        this.unsubscribeTimes = this.props.subscribeToTimes(projectId, false);
        this.unsubscribeExpenses = this.props.subscribeToExpenses(projectId, false);
    }

    componentWillUnmount() {
        if (this.unsubscribeTimes) this.unsubscribeTimes();
        if (this.unsubscribeExpenses) this.unsubscribeExpenses();
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

        const selectedHourlyRate = selectedAttorneyModal?.salary;
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

        this.setState(INITIAL_STATE);

        if (isModalAdd) this.props.addExpense(payload);
        else this.props.updateExpense(selectedExpenseUid, payload);
    }

    editExpense = expense => {
        this.setState({
            selectedClientModal: { value: expense.expenseClient, label: this.props.clientsNames[expense.expenseClient], uid: expense.expenseClient },
            selectedProjectModal: { value: expense.expenseProject, label: this.props.projectsNames[expense.expenseProject], uid: expense.expenseProject },
            selectedAttorneyModal: { value: expense.expenseAttorney, label: getUserName(this.props.users, expense.expenseAttorney)},
            expenseTitle: expense.expenseTitle,
            expenseTotal: expense.expenseTotal,
            selectedDate: toDate(expense.expenseDate),
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

    handleDeleteExpense = () => {
        if(window.confirm('Are you sure you want to delete this expense?')) {
            this.props.deleteExpense(this.state.selectedExpenseUid);
        }
        this.setState(INITIAL_STATE);
    }

    renderExpenseModal(authUser, isHidden) {
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c) => ({
                label: c.denomination || '',
                value: c.uid,
                ...c
            })).sort((a, b) => a.label?.localeCompare(b.label)) : [];

        const projectSelect = this.props.projects !== null ?
            this.props.projects.map((p) => ({
                label: p.projectTitle || '',
                value: p.uid,
                ...p
            })).sort((a, b) => a.label?.localeCompare(b.label)) : [];

        const userSelect = this.props.users !== null ?
            this.props.users.map((u) => ({
                label: u.name || '',
                value: u.uid,
                ...u
            })).sort((a, b) => a.name?.localeCompare(b.name)) : [];

        const { selectedClientModal, selectedProjectModal, selectedDate, expenseTitle, expenseTotal, selectedExpenseModal, selectedAttorneyModal, isModalAdd, validated } = this.state;
        const selectedAttorney = selectedAttorneyModal || userSelect.find(u => u.value === authUser.uid);
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
                                {validated && selectedClientModal == null ? <Form.Text className="text-danger">Client is required.</Form.Text> : null}
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
                                                <Form.Control.Feedback type="invalid">Amount must be zero or greater.</Form.Control.Feedback>
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
        this.setState({ validated: true });

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        const { selectedTimeUid, timeHours, timeMinutes, selectedClientModal, selectedProjectModal, selectedDate, timeTitle, selectedAttorneyModal, isModalAdd, hourlyRate } = this.state;
        const trimmedTimeTitle = trimString(timeTitle);
        
        if (!this.isFloat(timeHours)) return;
        if (selectedDate == null || trimmedTimeTitle === '' || selectedClientModal == null || selectedProjectModal == null || timeMinutes == null) return;
        var att = selectedAttorneyModal?.value || this.attorney?.current.props.value.value;
        var hr = hourlyRate || this.hour.current.value;
        const timeTotal = +hr * (+timeHours + timeMinutes / 60.0);
        const payload = {
            timeTitle: trimmedTimeTitle,
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
            selectedAttorneyModal: { value: time.timeAttorney, label: getUserName(this.props.users, time.timeAttorney)},
            timeTitle: time.timeTitle,
            selectedDate: toDate(time.timeDate),
            timeHours: time.timeHours,
            timeMinutes: time.timeMinutes,
            showTimeModal: true,
            isModalAdd: false,
            selectedTimeUid: time.uid
        });
    }

    handleDeleteTime = () => {
        if(window.confirm('Are you sure you want to delete this time?')) {
            this.props.deleteTime(this.state.selectedTimeUid);
        }
        this.setState(INITIAL_STATE);
    }

    renderTimeModal(authUser, isHidden) {
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c) => ({
                label: c.denomination || '',
                value: c.uid,
                ...c
            })).sort((a, b) => a.label?.localeCompare(b.label)) : [];

        const projectSelect = this.props.projects !== null ?
            this.props.projects.map((p) => ({
                label: p.projectTitle || '',
                value: p.uid,
                ...p
            })).sort((a, b) => a.label?.localeCompare(b.label)) : [];

        const userSelect = this.props.users !== null ?
            this.props.users.map((u) => ({
                label: u.name || '',
                value: u.uid,
                ...u
            })).sort((a, b) => a.name?.localeCompare(b.name)) : [];

        const { timeHours, timeMinutes, selectedClientModal, selectedProjectModal, selectedDate, timeTitle, selectedAttorneyModal, isModalAdd, hourlyRate, validated } = this.state;
        const defaultAttorney = userSelect.find(u => u.value === authUser.uid);
        const selectedAttorney = selectedAttorneyModal || defaultAttorney;
        const selectedHourlyRate = hourlyRate || defaultAttorney?.salary;

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
                                {validated && selectedClientModal == null ? <Form.Text className="text-danger">Client is required.</Form.Text> : null}
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
                                        {validated && selectedProjectModal == null ? <Form.Text className="text-danger">Project is required.</Form.Text> : null}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">Title</Form.Label>
                                    <Col sm="7">
                                        <Form.Control isInvalid={validated && trimString(timeTitle).length === 0} name="timeTitle" value={timeTitle} onChange={this.onChange} as="textarea" rows="2" required />
                                        <Form.Control.Feedback type="invalid">Title cannot be empty.</Form.Control.Feedback>
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
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <div style={{ flex: 1 }}>
                                                <Form.Control isInvalid={validated && (timeHours < 0 || timeHours > 100)} value={timeHours} name="timeHours" onChange={this.onChange} type="number" min="0" max="100" required />
                                                <Form.Control.Feedback type="invalid">Hours must be between 0 and 100.</Form.Control.Feedback>
                                                <Form.Label style={{ fontSize: 12, color: '#888' }}>hours</Form.Label>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <Form.Control name="timeMinutes" value={timeMinutes} onChange={this.onChange} as="select" required>
                                                    <option value={0}>0</option>
                                                    <option value={15}>15</option>
                                                    <option value={30}>30</option>
                                                    <option value={45}>45</option>
                                                </Form.Control>
                                                <Form.Label style={{ fontSize: 12, color: '#888' }}>minutes</Form.Label>
                                            </div>
                                        </div>
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
                                        <Form.Control ref={this.hour} isInvalid={validated && selectedHourlyRate <= 0} value={selectedHourlyRate} name="hourlyRate" onChange={this.onChange} type="number" min="0" required />
                                        <Form.Control.Feedback type="invalid">Hourly rate must be greater than zero.</Form.Control.Feedback>
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

    archiveProject = () => {
        if(window.confirm('Are you sure you want to close this project?')) {
            this.props.updateProject(this.props.match.params.projectId, { ...this.props.project, isOpen: false });
        }
    }

    reopenProject = () => {
        if(window.confirm('Are you sure you want to reopen this project?')) {
            this.props.updateProject(this.props.match.params.projectId, { ...this.props.project, isOpen: true });
            const clientUid = this.props.project?.projectClient;
            const client = (this.props.clients || []).find(c => c.uid === clientUid);
            if (client && client.isActive === false) {
                this.props.updateClient(clientUid, { isActive: true });
            }
        }
    }

    onDelete = () => {
        if(window.confirm('Are you sure you want to delete this project?')) {
            this.props.deleteProject(this.props.match.params.projectId);
            this.props.history.push('/projects');
            this.props.addAlert(AlertType.Success, "Project successfully deleted.");
        }
    }

    handleEditProject = event => {
        event.preventDefault();
        this.setState({ validated: true });
        const projectTitle = this.state.projectTitle ?? this.props.project?.projectTitle ?? '';
        const trimmedProjectTitle = trimString(projectTitle);

        if(trimmedProjectTitle === '') return;

        const payload = { ...this.props.project, projectTitle: trimmedProjectTitle };

        this.props.updateProject(this.props.match.params.projectId, payload);
        this.setState({ ...INITIAL_STATE });
    }

    renderEditModal(){
        const { showEditModal, validated } = this.state;
        const projectTitle = this.state.projectTitle ?? this.props.project?.projectTitle ?? '';

        return(
            <Modal show={showEditModal} onHide={() => this.handleClose(4)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleEditProject}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Title</Form.Label>
                            <Col sm="9">
                                <Form.Control isInvalid={validated && trimString(projectTitle).length === 0} name="projectTitle" value={projectTitle} onChange={this.onChange} as="textarea" rows="2" required/>
                                <Form.Control.Feedback type="invalid">Title cannot be empty.</Form.Control.Feedback>
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
            this.props.expenses.map(e => ({ ...e })) : [];

        const times = this.props.times !== null ?
            this.props.times.map(t => ({ ...t })) : [];

        const totalExpenses = expenses.reduce((acc, e) => acc + e.expenseTotal, 0);
        const totalTime = times.reduce((acc, t) => acc + t.timeTotal, 0);

        const colHeaderStyle = { color: '#bbb', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' };

        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    this.props.loadingProject || this.props.loadingProjects || this.props.loadingExpenses || this.props.loadingTimes || this.props.loadingUsers ?
                    <BarLoader css={{width: "100%"}} loading={this.props.loadingProjects} /> :
                    <div className="dp-page">
                        {this.renderExpenseModal(authUser, !authUser?.roles[ROLES.ADMIN])}
                        {this.renderTimeModal(authUser, !authUser?.roles[ROLES.ADMIN])}
                        {this.renderEditModal()}

                        {/* Header */}
                        <div className="dp-header">
                            <div>
                                <h2 className="dp-header-title">{this.props.project?.projectTitle}</h2>
                                <p className="dp-header-subtitle">For {this.props.clientsNames[this.state.clientId]}</p>
                                <span className={`project-badge ${this.props.project?.isOpen ? 'open' : 'closed'}`}>
                                    {this.props.project?.isOpen ? 'Open' : 'Closed'}
                                </span>
                            </div>
                            <div className="dp-totals dp-totals--header">
                                <div className="dp-total-item">
                                    <span className="dp-total-label">Expenses</span>
                                    <span className="dp-total-value">${totalExpenses.toFixed(2)}</span>
                                </div>
                                <div className="dp-divider" />
                                <div className="dp-total-item">
                                    <span className="dp-total-label">Time</span>
                                    <span className="dp-total-value">${totalTime.toFixed(2)}</span>
                                </div>
                                <div className="dp-divider" />
                                <div className="dp-total-item dp-grand-total">
                                    <span className="dp-total-label">Total</span>
                                    <span className="dp-total-value">${(totalExpenses + totalTime).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Info strip */}
                        <div className="dp-info-strip">
                            <div className="dp-info-item">
                                <span className="dp-info-label">Attorney</span>
                                <span className="dp-info-value">
                                    {getUserName(this.props.users, this.props.project?.appointedIds)}
                                </span>
                            </div>
                            <div className="dp-divider" />
                            <div className="dp-info-item">
                                <span className="dp-info-label">Billing</span>
                                <span className="dp-info-value">
                                    <span className={`project-badge ${this.props.project?.projectFixedFee ? 'fixed-fee' : 'hourly'}`}>
                                        {this.props.project?.projectFixedFee ? 'Fixed fee' : 'Hourly'}
                                    </span>
                                </span>
                            </div>
                            {this.props.project?.projectFixedFee && (
                                <>
                                    <div className="dp-divider" />
                                    <div className="dp-info-item">
                                        <span className="dp-info-label">Fee</span>
                                        <span className="dp-info-value">${this.props.project?.projectFee}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="dp-content">

                            {/* Expenses table */}
                            <div className="dp-section">
                                <div className="dp-section-header">
                                    <span className="dp-section-title">Expenses</span>
                                    <IconButton onClick={this.handleAddExpense} aria-label="Add expense" size="small">
                                        <AddIcon style={{ color: 'rgb(25, 57, 145)', fontSize: 18 }} />
                                    </IconButton>
                                </div>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={colHeaderStyle}>Description</TableCell>
                                                <TableCell style={colHeaderStyle}>Type</TableCell>
                                                <TableCell style={colHeaderStyle}>Date</TableCell>
                                                <TableCell style={{ ...colHeaderStyle, textAlign: 'right' }}>Amount</TableCell>
                                                <TableCell />
                                                <TableCell />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {expenses.map(row => (
                                                <TableRow key={row.uid} hover>
                                                    <TableCell>
                                                        <div>{row.expenseTitle}</div>
                                                        <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{getUserName(this.props.users, row.expenseAttorney)}</div>
                                                    </TableCell>
                                                    <TableCell style={{ color: '#555' }}>{expenseClasses.find(obj => obj.value === row.expenseClass)?.label}</TableCell>
                                                    <TableCell style={{ whiteSpace: 'nowrap', color: '#555' }}>{toDate(row.expenseDate)?.toLocaleDateString()}</TableCell>
                                                    <TableCell style={{ textAlign: 'right' }}>${Number(row.expenseTotal).toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        {row.isBilled ? <FontAwesomeIcon icon={faCheckCircle} color="green" title="Billed" /> : null}
                                                    </TableCell>
                                                    <TableCell>
                                                        <FontAwesomeIcon onClick={() => this.editExpense(row)} icon={faEdit} className="legemblue" style={{ cursor: 'pointer' }} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {expenses.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="dp-empty-cell">No expenses registered.</TableCell>
                                                </TableRow>
                                            )}
                                            <TableRow className="dp-total-row">
                                                <TableCell>Total</TableCell>
                                                <TableCell /><TableCell />
                                                <TableCell style={{ textAlign: 'right' }}>${totalExpenses.toFixed(2)}</TableCell>
                                                <TableCell /><TableCell />
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>

                            {/* Time table */}
                            <div className="dp-section">
                                <div className="dp-section-header">
                                    <span className="dp-section-title">Time</span>
                                    <IconButton onClick={this.handleAddTime} aria-label="Add time" size="small">
                                        <AddIcon style={{ color: 'rgb(25, 57, 145)', fontSize: 18 }} />
                                    </IconButton>
                                </div>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={colHeaderStyle}>Description</TableCell>
                                                <TableCell style={colHeaderStyle}>Duration</TableCell>
                                                <TableCell style={colHeaderStyle}>Date</TableCell>
                                                <TableCell style={{ ...colHeaderStyle, textAlign: 'right' }}>Amount</TableCell>
                                                <TableCell />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {times.map(row => (
                                                <TableRow key={row.uid} hover>
                                                    <TableCell>
                                                        <div>{row.timeTitle}</div>
                                                        <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{getUserName(this.props.users, row.timeAttorney)}</div>
                                                    </TableCell>
                                                    <TableCell style={{ color: '#555' }}>{`${row.timeHours}:${row.timeMinutes > 0 ? String(row.timeMinutes).padStart(2, '0') : '00'} hrs`}</TableCell>
                                                    <TableCell style={{ whiteSpace: 'nowrap', color: '#555' }}>{toDate(row.timeDate)?.toLocaleDateString()}</TableCell>
                                                    <TableCell style={{ textAlign: 'right' }}>${Number(row.timeTotal).toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        <FontAwesomeIcon onClick={() => this.editTime(row)} icon={faEdit} className="legemblue" style={{ cursor: 'pointer' }} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {times.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="dp-empty-cell">No time registered.</TableCell>
                                                </TableRow>
                                            )}
                                            <TableRow className="dp-total-row">
                                                <TableCell>Total</TableCell>
                                                <TableCell /><TableCell />
                                                <TableCell style={{ textAlign: 'right' }}>${totalTime.toFixed(2)}</TableCell>
                                                <TableCell />
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>

                            {/* Actions */}
                            <div className="dp-actions">
                                <Button onClick={() => this.handleShow(4)} variant="outline-secondary" size="sm">Edit</Button>
                                {this.props.project?.isOpen
                                    ? <Button onClick={this.archiveProject} variant="outline-danger" size="sm">Close project</Button>
                                    : <Button onClick={this.reopenProject} variant="outline-primary" size="sm">Reopen project</Button>
                                }
                                <IconButton onClick={this.onDelete} color="secondary" aria-label="delete" size="small">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </div>

                        </div>

                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

detailedProject.propTypes = {
    loadingProjects: PropTypes.bool,
    loadingProject: PropTypes.bool,
    loadingUsers: PropTypes.bool,
    loadingExpenses: PropTypes.bool,
    loadingTimes: PropTypes.bool,
    projects: PropTypes.array,
    project: PropTypes.object,
    users: PropTypes.array,
    clients: PropTypes.array,
    clientsNames: PropTypes.object,
    expenses: PropTypes.array,
    times: PropTypes.array,
    projectsNames: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    getProjectById: PropTypes.func,
    getProjectsMapping: PropTypes.func,
    getUsers: PropTypes.func,
    subscribeToTimes: PropTypes.func,
    subscribeToExpenses: PropTypes.func,
    updateExpense: PropTypes.func,
    deleteExpense: PropTypes.func,
    updateTime: PropTypes.func,
    deleteTime: PropTypes.func,
    addTime: PropTypes.func,
    addExpense: PropTypes.func,
    updateProject: PropTypes.func,
    updateClient: PropTypes.func,
    deleteProject: PropTypes.func,
    addAlert: PropTypes.func
};

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    getProjectById,
    getProjectsMapping,
    getUsers,
    subscribeToTimes,
    subscribeToExpenses,
    updateExpense,
    deleteExpense,
    updateTime,
    deleteTime,
    addTime,
    addExpense,
    updateProject,
    updateClient,
    deleteProject,
    addAlert
})(withAuthorization(condition)(detailedProject));
