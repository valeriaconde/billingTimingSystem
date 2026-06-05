import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { addAlert, clearAlert, getUsers, addProject, subscribeToProjectsByClient, subscribeToAllOpenProjects, subscribeToAllProjects, subscribeToClientProjectsAll } from "../redux/actions/index";
import { connect } from "react-redux";
import BarLoader from "react-spinners/BarLoader";
import { trimString } from '../utils/inputUtils';
import '../styles/Clients.css';
import '../styles/Projects.css';

const mapStateToProps = state => {
    return {
        alerts: state.alerts,
        clients: state.clients,
        loadingClients: state.loadingClients,
        users: state.users,
        projects: state.projects,
        loadingUsers: state.loadingUsers,
        loadingProjects: state.loadingProjects
    };
};

const INITIAL_STATE = {
    showModal: false,
    selectedAppointed: null,
    selectedClientModal: null,
    projectTitle: '',
    projectFixedFee: 'false',
    projectFee: 0,
    validated: false,
    clientSearch: '',
    projectSearch: '',
    activeClientIdx: null,
    selectedClientUid: null,
    filterStatus: 'all',
    filterAttorney: [],
    filterBilling: []
};

class Proyectos extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleNewProject = this.handleNewProject.bind(this);
    }

    componentDidMount() {
        this.tryPreselectClient(this.props.clients);
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.clients?.length && this.props.clients?.length && this.state.activeClientIdx === null) {
            this.tryPreselectClient(this.props.clients);
        }
    }

    tryPreselectClient(clients) {
        const clientUid = this.props.location?.state?.clientUid;
        if (!clientUid || !clients?.length) return;
        const idx = clients.findIndex(c => c.uid === clientUid);
        if (idx !== -1) this.handleSelectClient(clients[idx], idx);
    }

    componentWillUnmount() {
        if (this.unsubscribeProjects) this.unsubscribeProjects();
    }

    isFloat(n) {
        return n.length > 0 && !isNaN(n) && n > 0;
    }

    getSubscription(clientIdx, clientUid, status) {
        const needsAll = status !== 'open';
        if (clientIdx === -1) {
            return needsAll
                ? this.props.subscribeToAllProjects()
                : this.props.subscribeToAllOpenProjects();
        } else {
            return needsAll
                ? this.props.subscribeToClientProjectsAll(clientUid)
                : this.props.subscribeToProjectsByClient(clientUid);
        }
    }

    handleSelectAll = () => {
        if (this.unsubscribeProjects) this.unsubscribeProjects();
        const { filterStatus } = this.state;
        this.setState({ activeClientIdx: -1, selectedClientUid: null, projectSearch: '' });
        this.unsubscribeProjects = this.getSubscription(-1, null, filterStatus);
    };

    handleSelectClient = (client, idx) => {
        if (this.unsubscribeProjects) this.unsubscribeProjects();
        const { filterStatus } = this.state;
        this.setState({ activeClientIdx: idx, selectedClientUid: client.uid, projectSearch: '' });
        this.unsubscribeProjects = this.getSubscription(idx, client.uid, filterStatus);
    };

    handleStatusFilter = (status) => {
        if (status === this.state.filterStatus) return;
        if (this.unsubscribeProjects) this.unsubscribeProjects();
        const { activeClientIdx, selectedClientUid } = this.state;
        this.setState({ filterStatus: status });
        this.unsubscribeProjects = this.getSubscription(activeClientIdx, selectedClientUid, status);
    };

    toggleBillingFilter = (value) => {
        const { filterBilling } = this.state;
        const newFilter = filterBilling.includes(value)
            ? filterBilling.filter(v => v !== value)
            : [...filterBilling, value];
        this.setState({ filterBilling: newFilter });
    };

    handleNewProject(event) {
        event.preventDefault();
        this.setState({ validated: true });
        const { selectedClientModal, selectedAppointed, projectTitle, projectFixedFee, projectFee } = this.state;
        const trimmedProjectTitle = trimString(projectTitle);

        if (projectFixedFee === 'true' && !this.isFloat(projectFee)) return;
        if (trimmedProjectTitle === '' || selectedClientModal == null || selectedAppointed == null) return;

        this.props.addProject({
            projectTitle: trimmedProjectTitle,
            projectClient: selectedClientModal.uid,
            appointedIds: selectedAppointed.value,
            projectFixedFee: projectFixedFee === 'true',
            projectFee: Number(projectFee),
            isOpen: true
        });
        this.setState({
            showModal: false,
            selectedAppointed: null,
            selectedClientModal: null,
            projectTitle: '',
            projectFixedFee: 'false',
            projectFee: 0,
            validated: false
        });
    }

    handleChangeClientModal = selectedClientModal => { this.setState({ selectedClientModal }); };
    handleChangeMulti = selectedAppointed => { this.setState({ selectedAppointed }); };
    onChange(event) { this.setState({ [event.target.name]: event.target.value }); }
    handleShow() { this.setState({ showModal: true }); }
    handleClose() { this.setState({ showModal: false }); }

    renderModal() {
        const clientSelect = (this.props.clients || []).map((c) => ({
            label: c.denomination || '',
            value: c.uid,
            ...c
        })).sort((a, b) => a.label?.localeCompare(b.label));

        const userSelect = (this.props.users || []).map((u) => ({
            label: u.name || '',
            value: u.uid,
            ...u
        })).sort((a, b) => a.name?.localeCompare(b.name));

        const { showModal, selectedClientModal, selectedAppointed, projectTitle, projectFixedFee, projectFee, validated } = this.state;

        return (
            <Modal show={showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleNewProject}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Client</Form.Label>
                            <Col sm="7">
                                <Select value={selectedClientModal} placeholder="Select client..." options={clientSelect} onChange={this.handleChangeClientModal} />
                                {validated && selectedClientModal == null ? <Form.Text className="text-danger">Client is required.</Form.Text> : null}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Title</Form.Label>
                            <Col sm="7">
                                <Form.Control isInvalid={validated && trimString(projectTitle).length === 0} name="projectTitle" value={projectTitle} onChange={this.onChange} as="textarea" rows="2" required />
                                <Form.Control.Feedback type="invalid">Title cannot be empty.</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Attorney</Form.Label>
                            <Col sm="7">
                                <Select value={selectedAppointed} placeholder="Select appointed..." onChange={this.handleChangeMulti} options={userSelect} />
                                {validated && selectedAppointed == null ? <Form.Text className="text-danger">Attorney is required.</Form.Text> : null}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Billed by</Form.Label>
                            <Col sm="7">
                                <Form.Control name="projectFixedFee" onChange={this.onChange} as="select" required>
                                    <option value={false}>The hour</option>
                                    <option value={true}>Fixed fee</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} hidden={projectFixedFee === 'false'}>
                            <Form.Label column sm="3">Fee</Form.Label>
                            <Col sm="7">
                                <Form.Control isInvalid={validated && !this.isFloat(projectFee)} name="projectFee" value={projectFee} onChange={this.onChange} required />
                                <Form.Control.Feedback type="invalid">Fee must be greater than zero.</Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleNewProject}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    renderFilters() {
        const { filterStatus, filterAttorney, filterBilling } = this.state;

        const userOptions = (this.props.users || []).map(u => ({ value: u.uid, label: u.name }));
        const selectedAttorneys = userOptions.filter(u => filterAttorney.includes(u.value));

        return (
            <div className="projects-filters">
                <div className="projects-filter-group">
                    <div className="projects-filter-label">Status</div>
                    <div className="projects-filter-pills">
                        {[
                            { value: 'all', label: 'All' },
                            { value: 'open', label: 'Open' },
                            { value: 'concluded', label: 'Concluded' }
                        ].map(s => (
                            <span
                                key={s.value}
                                className={`projects-filter-pill${filterStatus === s.value ? ' active' : ''}`}
                                onClick={() => this.handleStatusFilter(s.value)}
                            >
                                {s.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="projects-filter-group">
                    <div className="projects-filter-label">Billing type</div>
                    <div className="projects-filter-pills">
                        {[
                            { value: 'hourly', label: 'By the hour' },
                            { value: 'fixed', label: 'Fixed fee' }
                        ].map(b => (
                            <span
                                key={b.value}
                                className={`projects-filter-pill${filterBilling.includes(b.value) ? ' active' : ''}`}
                                onClick={() => this.toggleBillingFilter(b.value)}
                            >
                                {b.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="projects-filter-group projects-filter-group--select">
                    <div className="projects-filter-label">Lead</div>
                    <Select
                        isMulti
                        placeholder="All attorneys"
                        options={userOptions}
                        value={selectedAttorneys}
                        onChange={sel => this.setState({ filterAttorney: (sel || []).map(s => s.value) })}
                        className="projects-filter-select"
                        classNamePrefix="pf-select"
                    />
                </div>

            </div>
        );
    }

    render() {
        const { clientSearch, projectSearch, activeClientIdx, selectedClientUid,
                filterStatus, filterAttorney, filterBilling } = this.state;

        const allClients = this.props.clients || [];
        const filteredClients = allClients.filter(c =>
            (c.denomination || '').toLowerCase().includes(clientSearch.toLowerCase())
        );
        const activeClient = allClients.find(c => c.uid === selectedClientUid);
        const nothingSelected = activeClientIdx === null;

        let filteredProjects = this.props.projects || [];

        if (filterStatus === 'open') filteredProjects = filteredProjects.filter(p => p.isOpen);
        else if (filterStatus === 'concluded') filteredProjects = filteredProjects.filter(p => !p.isOpen);
        else filteredProjects = [...filteredProjects].sort((a, b) => (b.isOpen ? 1 : 0) - (a.isOpen ? 1 : 0));

        if (filterBilling.length > 0) {
            filteredProjects = filteredProjects.filter(p =>
                (filterBilling.includes('fixed') && p.projectFixedFee) ||
                (filterBilling.includes('hourly') && !p.projectFixedFee)
            );
        }

        if (filterAttorney.length > 0) {
            filteredProjects = filteredProjects.filter(p => filterAttorney.includes(p.appointedIds));
        }

        if (projectSearch) {
            filteredProjects = filteredProjects.filter(p =>
                (p.projectTitle || '').toLowerCase().includes(projectSearch.toLowerCase())
            );
        }

        return (
            <AuthUserContext.Consumer>
                {() =>
                    this.props.loadingClients
                        ? <BarLoader css={{ width: "100%" }} loading={this.props.loadingClients} />
                        : <div className="projects-page">
                            {this.renderModal()}
                            <div className="projects-layout">

                                {/* LEFT PANEL */}
                                <div className="client-list-panel">
                                    <div className="client-list-header">
                                        <input
                                            type="text"
                                            className="client-search-input"
                                            placeholder="Search clients..."
                                            value={clientSearch}
                                            onChange={e => this.setState({ clientSearch: e.target.value })}
                                        />
                                        <Button className="btn-new-client" onClick={this.handleShow}>
                                            + New project
                                        </Button>
                                    </div>
                                    <div className="client-list-scroll">
                                        <div
                                            className={`client-list-item projects-all-item${activeClientIdx === -1 ? ' active' : ''}`}
                                            onClick={this.handleSelectAll}
                                        >
                                            <div className="client-list-avatar projects-all-avatar">✦</div>
                                            <div className="client-list-name">All projects</div>
                                        </div>
                                        {filteredClients.map(client => {
                                            const originalIdx = allClients.findIndex(c => c.uid === client.uid);
                                            return (
                                                <div
                                                    key={client.uid}
                                                    className={`client-list-item${activeClientIdx === originalIdx ? ' active' : ''}`}
                                                    onClick={() => this.handleSelectClient(client, originalIdx)}
                                                >
                                                    <div className="client-list-avatar">
                                                        {(client.denomination || '?')[0].toUpperCase()}
                                                    </div>
                                                    <div className="client-list-name">{client.denomination}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* RIGHT PANEL */}
                                <div className="projects-panel">
                                    {nothingSelected ? (
                                        <div className="projects-no-results" style={{ marginTop: '4rem' }}>
                                            Select a client or &ldquo;All projects&rdquo; to view projects.
                                        </div>
                                    ) : (<>
                                    <div className="projects-panel-header">
                                        <div>
                                            <div className="projects-panel-title">
                                                {activeClientIdx === -1 ? 'All projects' : activeClient?.denomination}
                                            </div>
                                            <div className="projects-panel-subtitle">
                                                {this.props.loadingProjects
                                                    ? 'Loading...'
                                                    : `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        className="projects-search-input"
                                        placeholder="Search projects..."
                                        value={projectSearch}
                                        onChange={e => this.setState({ projectSearch: e.target.value })}
                                    />

                                    {this.renderFilters()}

                                    {this.props.loadingProjects
                                        ? <BarLoader css={{ width: "100%" }} loading={this.props.loadingProjects} />
                                        : filteredProjects.length === 0
                                            ? <div className="projects-no-results">No projects match the current filters.</div>
                                            : <div className="projects-grid">
                                                {filteredProjects.map(project => {
                                                    const attorney = this.props.users?.find(u => u.uid === project.appointedIds);
                                                    const client = activeClientIdx === -1
                                                        ? allClients.find(c => c.uid === project.projectClient)
                                                        : null;
                                                    return (
                                                        <Link
                                                            key={project.uid}
                                                            to={`/projects/${project.projectClient}/${project.uid}`}
                                                            className="project-card"
                                                        >
                                                            <div className="project-card-title">{project.projectTitle}</div>
                                                            <div className="project-card-meta">
                                                                <span className={`project-badge ${project.isOpen ? 'open' : 'closed'}`}>
                                                                    {project.isOpen ? 'Open' : 'Concluded'}
                                                                </span>
                                                                <span className={`project-badge ${project.projectFixedFee ? 'fixed-fee' : 'hourly'}`}>
                                                                    {project.projectFixedFee
                                                                        ? `Fixed fee${project.projectFee ? ` · $${project.projectFee}` : ''}`
                                                                        : 'By the hour'}
                                                                </span>
                                                            </div>
                                                            {attorney && (
                                                                <div className="project-card-attorney">{attorney.name}</div>
                                                            )}
                                                            {client && (
                                                                <div className="project-card-client">{client.denomination}</div>
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                              </div>
                                    }
                                    </>)}
                                </div>

                            </div>
                        </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

Proyectos.propTypes = {
    alerts: PropTypes.array,
    clients: PropTypes.array,
    loadingClients: PropTypes.bool,
    users: PropTypes.array,
    projects: PropTypes.array,
    loadingUsers: PropTypes.bool,
    loadingProjects: PropTypes.bool,
    addAlert: PropTypes.func,
    clearAlert: PropTypes.func,
    getUsers: PropTypes.func,
    addProject: PropTypes.func,
    subscribeToProjectsByClient: PropTypes.func,
    subscribeToAllOpenProjects: PropTypes.func,
    subscribeToAllProjects: PropTypes.func,
    subscribeToClientProjectsAll: PropTypes.func,
    location: PropTypes.object
};

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    clearAlert,
    addAlert,
    getUsers,
    addProject,
    subscribeToProjectsByClient,
    subscribeToAllOpenProjects,
    subscribeToAllProjects,
    subscribeToClientProjectsAll
})(withAuthorization(condition)(Proyectos));
