import React, { Component } from 'react';
import Select from 'react-select';
import { Row, Col, OverlayTrigger, Tooltip, Container, Button, Form, Modal, Jumbotron } from 'react-bootstrap';
import BarLoader from "react-spinners/BarLoader";
import { AuthUserContext, withAuthorization } from './Auth';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import * as ROLES from '../constants/roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { deleteTime, updateTime, getTimes, addTime, getProjectsMapping, getClients, getUsers, addProject, getProjectByClient } from "../redux/actions/index";
import { connect } from "react-redux";
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
        times: state.times,
        loadingTimes: state.loadingTimes,
        loadedTimesOnce: state.loadedTimesOnce,
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
    timeTitle: '',
    timeHours: 0,
    timeMinutes: 0,
    hourlyRate: 0,
    isModalAdd: true
};

class tiemposPage extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.attorney = React.createRef();
        this.hour = React.createRef();

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
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
        return n.length > 0 && !isNaN(n) && n >= 0;
    }

    handleShow() {
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

    handleAttorneyModal = selectedAttorneyModal => {
        this.setState({ selectedAttorneyModal });

        const userSelect = this.props.users !== null ?
            this.props.users.map((u) => ({
                label: u.name,
                value: u.uid,
                ...u
            })).sort((a, b) => a.name.localeCompare(b.name)) : [];
        const idx = userSelect.map(function (u) { return u.value }).indexOf(selectedAttorneyModal.uid);
        const selectedHourlyRate = userSelect[idx]?.salary;
        this.setState({ hourlyRate: selectedHourlyRate });
    }

    handleChangeTime = selectedTimeModal => {
        this.setState({ selectedTimeModal });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
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
        var att = selectedAttorneyModal?.value || this.attorney.current.props.value.value;
        var hr = hourlyRate || this.hour.current.value;
        const timeTotal = +hr * (+timeHours + timeMinutes / 60.0);
        const payload = {
            timeTitle: timeTitle,
            timeDate: selectedDate,
            timeClient: selectedClientModal.uid,
            timeProject: selectedProjectModal.uid,
            timeAttorney: att,
            timeHours: Number(timeHours),
            timeMinutes: Number(timeMinutes),
            timeTotal: Number(timeTotal),
            hourlyRate: Number(hr),
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
            timeTitle: time.timeTitle,
            selectedDate: time.timeDate.toDate(),
            timeHours: time.timeHours,
            timeMinutes: time.timeMinutes,
            showModal: true,
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

    renderModal(authUser, isHidden) {
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c) => ({
                label: c.denomination,
                value: c.uid,
                ...c
            })).sort((a, b) => a.label.localeCompare(b.label)) : [];

        const projectSelect = this.props.projects !== null ?
            this.props.projects.map((p) => ({
                label: p.projectTitle,
                value: p.uid,
                ...p
            })).sort((a, b) => a.label.localeCompare(b.label)) : [];

        const userSelect = this.props.users !== null ?
            this.props.users.map((u) => ({
                label: u.name,
                value: u.uid,
                ...u
            })).sort((a, b) => a.name.localeCompare(b.name)) : [];

        const idx = userSelect.map(function (u) { return u.value }).indexOf(authUser.uid);
        const { timeHours, timeMinutes, selectedClientModal, selectedProjectModal, selectedDate, timeTitle, selectedAttorneyModal, isModalAdd, hourlyRate } = this.state;
        const selectedAttorney = selectedAttorneyModal || userSelect[idx];
        const selectedHourlyRate = hourlyRate || userSelect[idx]?.salary;

        return (
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Time register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
                                        <Form.Control isInvalid={timeTitle.length === 0} name="timeTitle" value={timeTitle} onChange={this.onChange} as="textarea" rows="2" required />
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
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleNewTime}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    getTimes = authUser => {
        let self = this;
        if(!self.props.loadedTimesOnce) {
            self.props.getTimes(authUser.uid, true);
        }
        return null;
    }

    render() {
        const times = this.props.times !== null ?
            this.props.times.map(t => ({
                ...t
            })) : [];

        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    this.props.loadingProjectsMapping ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                    <div>
                        <Button className="legem-primary" size="lg" block onClick={this.handleShow}>
                            Register time
                        </Button>

                        {this.renderModal(authUser, !authUser?.roles[ROLES.ADMIN])}

                        {this.getTimes(authUser)}
                        {
                            times.length === 0 ?
                            <Jumbotron fluid>
                                <Container>
                                    <h1>You have no registered times</h1>
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
                                            <TableRow>
                                                <TableCell><b>Registered times</b></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* TABLE BODY IGUAL QUE GASTOS, EXCEPTO:
                                            - TOOLTIP SOLO MUESTRA FECHA (NO HAY TIPO DE GASTO)
                                            - HORAS Y MINUTOS EN LUGAR DE MONTO                                    
                                        */}

                                        <TableBody>
                                            {times.map((row) => (
                                            <TableRow key={row.uid}>
                                                <TableCell>
                                                    <OverlayTrigger overlay={
                                                        <Tooltip>
                                                            {row.timeDate?.toDate().toDateString()}
                                                        </Tooltip>
                                                    }>
                                                        <span className="d-inline-block">
                                                            {this.props.clientsNames[row.timeClient]} - {this.props.projectsNames[row.timeProject]}
                                                            <br />
                                                            {row.timeTitle}
                                                        </span>
                                                    </OverlayTrigger>
                                                </TableCell>
                                                <TableCell className="rightAlign">{`${row.timeHours}:${row.timeMinutes > 0 ? row.timeMinutes : '00'} hrs`}</TableCell>
                                                <TableCell>{`$${row.timeTotal.toFixed(2)}`}</TableCell>
                                                <TableCell>
                                                    <FontAwesomeIcon onClick={() => this.editTime(row)} icon={faEdit} className="legemblue" />
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
    getProjectsMapping,
    addTime,
    getTimes,
    updateTime,
    deleteTime
})(withAuthorization(condition)(tiemposPage));