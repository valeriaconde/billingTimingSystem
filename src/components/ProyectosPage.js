import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { addAlert, clearAlert, getUsers, addProject, subscribeToProjectsByClient } from "../redux/actions/index";
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
    searchQuery: '',
    activeClientIdx: -1,
    selectedClientUid: null
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

    isFloat(n) {
        return n.length > 0 && !isNaN(n) && n > 0;
    }

    handleNewProject(event) {
        event.preventDefault();
        this.setState({ validated: true });
        const { selectedClientModal, selectedAppointed, projectTitle, projectFixedFee, projectFee } = this.state;
        const trimmedProjectTitle = trimString(projectTitle);

        if (projectFixedFee === 'true' && !this.isFloat(projectFee)) return;
        if (trimmedProjectTitle === '' || selectedClientModal == null || selectedAppointed == null) return;

        const payload = {
            projectTitle: trimmedProjectTitle,
            projectClient: selectedClientModal.uid,
            appointedIds: selectedAppointed.value,
            projectFixedFee: projectFixedFee === 'true',
            projectFee: Number(projectFee),
            isOpen: true
        };
        this.props.addProject(payload);
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

    handleSelectClient = (client, idx) => {
        if (this.unsubscribeProjects) this.unsubscribeProjects();
        this.setState({ activeClientIdx: idx, selectedClientUid: client.uid });
        this.unsubscribeProjects = this.props.subscribeToProjectsByClient(client.uid);
    };

    componentWillUnmount() {
        if (this.unsubscribeProjects) this.unsubscribeProjects();
    }

    handleChangeClientModal = selectedClientModal => { this.setState({ selectedClientModal }); };
    handleChangeMulti = selectedAppointed => { this.setState({ selectedAppointed }); };

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleShow() {
        this.setState({ showModal: true });
    }

    handleClose() {
        this.setState({ showModal: false });
    }

    renderModal() {
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c) => ({
                label: c.denomination || '',
                value: c.uid,
                ...c
            })).sort((a, b) => a.label?.localeCompare(b.label)) : [];

        const userSelect = this.props.users !== null ?
            this.props.users.map((u) => ({
                label: u.name || '',
                value: u.uid,
                ...u
            })).sort((a, b) => a.name?.localeCompare(b.name)) : [];

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

    render() {
        const { searchQuery, activeClientIdx, selectedClientUid } = this.state;
        const allClients = this.props.clients || [];
        const filteredClients = allClients.filter(c =>
            (c.denomination || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
        const activeClient = allClients.find(c => c.uid === selectedClientUid);

        return (
            <AuthUserContext.Consumer>
                {() =>
                    this.props.loadingClients
                        ? <BarLoader css={{ width: "100%" }} loading={this.props.loadingClients} />
                        : <div className="projects-page">
                            {this.renderModal()}
                            <div className="projects-layout">

                                {/* LEFT PANEL — client list */}
                                <div className="client-list-panel">
                                    <div className="client-list-header">
                                        <input
                                            type="text"
                                            className="client-search-input"
                                            placeholder="Search clients..."
                                            value={searchQuery}
                                            onChange={e => this.setState({ searchQuery: e.target.value })}
                                        />
                                        <Button className="btn-new-client" onClick={this.handleShow}>
                                            + New project
                                        </Button>
                                    </div>
                                    <div className="client-list-scroll">
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
                                                    <div>
                                                        <div className="client-list-name">{client.denomination}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* RIGHT PANEL — project cards */}
                                <div className="projects-panel">
                                    {activeClientIdx === -1
                                        ? <div className="projects-empty-state">
                                            <p>Select a client to view their projects</p>
                                          </div>
                                        : <>
                                            <div className="projects-panel-header">
                                                <div>
                                                    <div className="projects-panel-title">{activeClient?.denomination}</div>
                                                    <div className="projects-panel-subtitle">
                                                        {this.props.loadingProjects
                                                            ? 'Loading...'
                                                            : `${this.props.projects.length} project${this.props.projects.length !== 1 ? 's' : ''}`
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {this.props.loadingProjects
                                                ? <BarLoader css={{ width: "100%" }} loading={this.props.loadingProjects} />
                                                : this.props.projects.length === 0
                                                    ? <div className="projects-no-results">No active projects for this client.</div>
                                                    : <div className="projects-grid">
                                                        {this.props.projects.map(project => {
                                                            const attorney = this.props.users?.find(u => u.uid === project.appointedIds);
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
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                            }
                                          </>
                                    }
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
    subscribeToProjectsByClient: PropTypes.func
};

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    clearAlert,
    addAlert,
    getUsers,
    addProject,
    subscribeToProjectsByClient
})(withAuthorization(condition)(Proyectos));
