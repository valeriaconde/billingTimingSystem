import React, { Component } from 'react';
import { toDate } from '../utils/dateUtils';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Row, Col, Button, Form, Modal, Alert } from 'react-bootstrap';
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
import { deleteTime, updateTime, subscribeToTimes, subscribeToTimesByDateRange, subscribeToTimesByAttorneyAndDateRange, addTime, getProjectsMapping, getUsers, addProject, getProjectByClient } from "../redux/actions/index";
import { connect } from "react-redux";
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
    times: state.times,
    loadingTimes: state.loadingTimes,
    clientsNames: state.clientsNames,
    projectsNames: state.projectsNames,
    loadingProjectsMapping: state.loadingProjectsMapping
});

const today = new Date();
const PAGE_SIZE = 20;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = Array.from({ length: 8 }, (_, i) => today.getFullYear() - 5 + i);

// Form state only — filter state kept separate so form resets don't clear filters
const FORM_INITIAL_STATE = {
    showModal: false,
    selectedOption: null,
    selectedClientModal: null,
    validated: false,
    selectedDate: new Date(),
    selectedProjectModal: null,
    selectedAttorneyModal: null,
    timeTitle: '',
    timeHours: 0,
    timeMinutes: 0,
    hourlyRate: null,
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

const formatDate = date =>
    date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatTime = (hours, minutes) =>
    `${hours}:${String(minutes).padStart(2, '0')} hrs`;

const selectStyle = { width: 'auto', display: 'inline-block', fontSize: 14 };

class tiemposPage extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.attorney = React.createRef();
        this.hour = React.createRef();
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    static contextType = AuthUserContext;

    componentDidMount() {
        const authUser = this.context;
        if (authUser) {
            const [startDate, endDate] = this.dateRange();
            if (authUser.roles?.[ROLES.ADMIN]) {
                this.unsubscribeTimes = this.props.subscribeToTimesByDateRange(startDate, endDate);
                if (!this.props.users) this.props.getUsers();
            } else {
                this.unsubscribeTimes = this.props.subscribeToTimesByAttorneyAndDateRange(authUser.uid, startDate, endDate);
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const authUser = this.context;
        if (!authUser) return;

        const { filterFromMonth, filterFromYear, filterToMonth, filterToYear } = this.state;
        const { filterFromMonth: pFM, filterFromYear: pFY, filterToMonth: pTM, filterToYear: pTY } = prevState;

        if (filterFromMonth !== pFM || filterFromYear !== pFY || filterToMonth !== pTM || filterToYear !== pTY) {
            if (this.unsubscribeTimes) this.unsubscribeTimes();
            const [startDate, endDate] = this.dateRange();
            if (authUser.roles?.[ROLES.ADMIN]) {
                this.unsubscribeTimes = this.props.subscribeToTimesByDateRange(startDate, endDate);
            } else {
                this.unsubscribeTimes = this.props.subscribeToTimesByAttorneyAndDateRange(authUser.uid, startDate, endDate);
            }
        }
    }

    componentWillUnmount() {
        if (this.unsubscribeTimes) this.unsubscribeTimes();
    }

    isFloat(n) {
        n = n?.toString();
        return n?.length > 0 && !isNaN(n) && n >= 0;
    }

    handleShow() {
        this.setState({ ...FORM_INITIAL_STATE, showModal: true });
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
    }

    handleAttorneyModal = selectedAttorneyModal => {
        this.setState({ selectedAttorneyModal, hourlyRate: selectedAttorneyModal?.salary ?? null });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

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

    // Returns [startDate, endDate] normalised so start <= end
    dateRange() {
        const { filterFromMonth, filterFromYear, filterToMonth, filterToYear } = this.state;
        const a = new Date(filterFromYear, filterFromMonth, 1, 0, 0, 0, 0);
        const b = new Date(filterToYear, filterToMonth + 1, 0, 23, 59, 59, 999);
        return a <= b
            ? [a, b]
            : [new Date(filterToYear, filterToMonth, 1, 0, 0, 0, 0), new Date(filterFromYear, filterFromMonth + 1, 0, 23, 59, 59, 999)];
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

        if (selectedDate > new Date() && !window.confirm('The selected date is in the future. Are you sure you want to register time for a future date?')) return;

        var att = selectedAttorneyModal?.value || this.attorney.current.props.value.value;
        var hr = hourlyRate ?? this.hour.current.value;
        const timeTotal = +hr * (+timeHours + timeMinutes / 60.0);

        const payload = {
            timeTitle: trimmedTimeTitle,
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

        if (isModalAdd) {
            this.props.addTime(payload);
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
            this.props.updateTime(selectedTimeUid, payload);
        }
    }

    editTime = time => {
        const attorney = (this.props.users || []).find(u => u.uid === time.timeAttorney);
        const selectedAttorneyModal = time.timeAttorney
            ? { value: time.timeAttorney, label: attorney?.name || time.timeAttorney, salary: attorney?.salary }
            : null;
        this.setState({
            selectedClientModal: { value: time.timeClient, label: this.props.clientsNames[time.timeClient], uid: time.timeClient },
            selectedProjectModal: { value: time.timeProject, label: this.props.projectsNames[time.timeProject], uid: time.timeProject },
            timeTitle: time.timeTitle,
            selectedDate: toDate(time.timeDate),
            timeHours: time.timeHours,
            timeMinutes: time.timeMinutes,
            hourlyRate: time.hourlyRate,
            selectedAttorneyModal,
            showModal: true,
            isModalAdd: false,
            selectedTimeUid: time.uid
        });
    }

    handleDeleteTime = () => {
        if (window.confirm('Are you sure you want to delete this time entry?')) {
            this.props.deleteTime(this.state.selectedTimeUid);
        }
        this.setState(FORM_INITIAL_STATE);
    }

    filteredTimes() {
        const { filterClient, filterUsers } = this.state;
        const [startDate, endDate] = this.dateRange();
        return (this.props.times || [])
            .filter(t => {
                const d = toDate(t.timeDate);
                if (!d) return false;
                if (d < startDate || d > endDate) return false;
                if (filterClient && t.timeClient !== filterClient.value) return false;
                if (filterUsers.length > 0 && !filterUsers.some(u => u.value === t.timeAttorney)) return false;
                return true;
            })
            .sort((a, b) => {
                const da = toDate(a.timeDate);
                const db = toDate(b.timeDate);
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
        const { timeHours, timeMinutes, selectedClientModal, selectedProjectModal, selectedDate, timeTitle, selectedAttorneyModal, isModalAdd, hourlyRate, validated, showSavedAlert } = this.state;

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

        const projectSelect = (this.props.projects || [])
            .filter(p => !p.projectFixedFee)
            .map(p => ({ label: p.projectTitle || '', value: p.uid, uid: p.uid }))
            .sort((a, b) => a.label?.localeCompare(b.label));

        const userSelect = this.props.users !== null
            ? this.props.users.map((u) => ({
                label: u.name || '',
                value: u.uid,
                ...u
            })).sort((a, b) => a.name?.localeCompare(b.name))
            : [];

        const defaultAttorney = userSelect.find(u => u.value === authUser.uid);
        const selectedAttorney = selectedAttorneyModal || defaultAttorney;
        const selectedHourlyRate = hourlyRate ?? defaultAttorney?.salary;

        return (
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isModalAdd ? 'Register time' : 'Edit time'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showSavedAlert && <Alert variant="success">Saved!</Alert>}
                    <Form>
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
                                    <Form.Control isInvalid={validated && trimString(timeTitle).length === 0} name="timeTitle" value={timeTitle} onChange={this.onChange} as="textarea" rows="2" required />
                                    <Form.Control.Feedback type="invalid">Title cannot be empty.</Form.Control.Feedback>
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
                                <Form.Label column sm="3">Time</Form.Label>
                                <Col sm="7">
                                    <Row>
                                        <Col>
                                            <Form.Control isInvalid={validated && (timeHours < 0 || timeHours > 100)} value={timeHours} name="timeHours" onChange={this.onChange} type="number" min="0" max="100" required />
                                            <Form.Control.Feedback type="invalid">Hours must be between 0 and 100.</Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Control name="timeMinutes" value={timeMinutes} onChange={this.onChange} as="select" required>
                                                <option value={0}>0</option>
                                                <option value={15}>15</option>
                                                <option value={30}>30</option>
                                                <option value={45}>45</option>
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col><Form.Label>hours</Form.Label></Col>
                                        <Col><Form.Label>minutes</Form.Label></Col>
                                    </Row>
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
                                    <Form.Control ref={this.hour} isInvalid={validated && selectedHourlyRate <= 0} value={selectedHourlyRate ?? ''} name="hourlyRate" onChange={this.onChange} type="number" min="0" required />
                                    <Form.Control.Feedback type="invalid">Hourly rate must be greater than zero.</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                        </>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {!isModalAdd &&
                        <IconButton onClick={this.handleDeleteTime} color="secondary" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    }
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleNewTime}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        const { currentPage, filterFromMonth, filterFromYear, filterToMonth, filterToYear } = this.state;
        const filtered = this.filteredTimes();
        const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
        const displayed = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

        const isSingleMonth = filterFromMonth === filterToMonth && filterFromYear === filterToYear;
        const emptyLabel = isSingleMonth
            ? `No times registered for ${MONTHS[filterFromMonth]} ${filterFromYear}.`
            : `No times found for this range.`;

        const totalHours = filtered.reduce((sum, t) => sum + (Number(t.timeHours) || 0) + (Number(t.timeMinutes) || 0) / 60, 0);
        const totalAmount = filtered.reduce((sum, t) => sum + (Number(t.timeTotal) || 0), 0);

        return (
            <AuthUserContext.Consumer>
                {authUser => {
                    const isAdmin = !!authUser?.roles?.[ROLES.ADMIN];
                    return (this.props.loadingProjectsMapping && Object.keys(this.props.projectsNames).length === 0)
                        ? <BarLoader css={{ width: "100%" }} loading={this.props.loadingProjectsMapping} />
                        : <div style={{ padding: '0 30px' }}>
                            {this.renderModal(authUser, !isAdmin)}

                            <div className="d-flex justify-content-between align-items-center topMargin" style={{ marginBottom: 20 }}>
                                <h5 className="blueLetters mb-0">{isAdmin ? 'Timing' : 'My Timing'}</h5>
                                <Button className="legem-primary" onClick={this.handleShow}>+ Register time</Button>
                            </div>

                            {this.renderFilterBar(isAdmin)}

                            {isAdmin && filtered.length > 0 && (
                                <div style={{ marginBottom: 10, fontSize: 14, color: '#555' }}>
                                    Total: <strong style={{ color: 'rgb(25, 57, 145)' }}>{totalHours.toFixed(2)} hrs</strong>
                                    &nbsp;&middot;&nbsp;
                                    <strong style={{ color: 'rgb(25, 57, 145)' }}>${totalAmount.toFixed(2)}</strong>
                                </div>
                            )}

                            {filtered.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="greyLetters" style={{ fontSize: 16 }}>{emptyLabel}</p>
                                </div>
                            ) : (
                                <>
                                    <TableContainer>
                                        <Table aria-label="times table">
                                            <TableHead>
                                                <TableRow key="theader">
                                                    <TableCell style={{ width: isAdmin ? '28%' : '38%' }}><b>Description</b></TableCell>
                                                    <TableCell style={{ width: '12%' }}><b>Date</b></TableCell>
                                                    {isAdmin && <TableCell style={{ width: '15%' }}><b>Attorney</b></TableCell>}
                                                    <TableCell style={{ width: '12%' }} className="rightAlign"><b>Time</b></TableCell>
                                                    <TableCell style={{ width: '13%' }} className="rightAlign"><b>Amount</b></TableCell>
                                                    <TableCell style={{ width: '5%' }}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {displayed.map(row => {
                                                    const attorney = (this.props.users || []).find(u => u.uid === row.timeAttorney);
                                                    return (
                                                        <TableRow key={row.uid}>
                                                            <TableCell>
                                                                <span className="greyLetters" style={{ fontSize: 12 }}>
                                                                    {this.props.clientsNames[row.timeClient]} &mdash; {this.props.projectsNames[row.timeProject]}
                                                                </span>
                                                                <br />
                                                                {row.timeTitle}
                                                            </TableCell>
                                                            <TableCell style={{ whiteSpace: 'nowrap', color: '#555' }}>
                                                                {formatDate(toDate(row.timeDate))}
                                                            </TableCell>
                                                            {isAdmin && (
                                                                <TableCell style={{ color: '#555' }}>
                                                                    {attorney?.name || '—'}
                                                                </TableCell>
                                                            )}
                                                            <TableCell className="rightAlign">
                                                                {formatTime(row.timeHours, row.timeMinutes)}
                                                            </TableCell>
                                                            <TableCell className="rightAlign">
                                                                ${row.timeTotal.toFixed(2)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <FontAwesomeIcon
                                                                    onClick={() => this.editTime(row)}
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
                                                Page {currentPage} of {pageCount} &middot; {filtered.length} entries
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

tiemposPage.propTypes = {
    clients: PropTypes.array,
    loadingClients: PropTypes.bool,
    users: PropTypes.array,
    projectsByClient: PropTypes.object,
    projects: PropTypes.array,
    loadingUsers: PropTypes.bool,
    times: PropTypes.array,
    loadingTimes: PropTypes.bool,
    clientsNames: PropTypes.object,
    projectsNames: PropTypes.object,
    loadingProjectsMapping: PropTypes.bool,
    getUsers: PropTypes.func,
    addProject: PropTypes.func,
    getProjectByClient: PropTypes.func,
    getProjectsMapping: PropTypes.func,
    addTime: PropTypes.func,
    subscribeToTimes: PropTypes.func,
    subscribeToTimesByDateRange: PropTypes.func,
    subscribeToTimesByAttorneyAndDateRange: PropTypes.func,
    updateTime: PropTypes.func,
    deleteTime: PropTypes.func
};

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    getUsers,
    addProject,
    getProjectByClient,
    getProjectsMapping,
    addTime,
    subscribeToTimes,
    subscribeToTimesByDateRange,
    subscribeToTimesByAttorneyAndDateRange,
    updateTime,
    deleteTime
})(withAuthorization(condition)(tiemposPage));
