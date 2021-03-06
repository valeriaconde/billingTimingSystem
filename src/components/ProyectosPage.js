import React, { Component } from 'react';
import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { addAlert, clearAlert, getClients, getUsers, addProject, getProjectByClient } from "../redux/actions/index";
import { connect } from "react-redux";
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import BarLoader from "react-spinners/BarLoader";
import TableBody from '@material-ui/core/TableBody';

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
    projectTitle: '',
    projectFixedFee: 'false',
    projectFee: 0,
    validated: false
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
        if(this.props.clients.length === 0) {
            this.props.getClients();
        }

        if(this.props.users.length === 0){
            this.props.getUsers();
        }
    }

    isFloat(n) {
        return n.length > 0 && !isNaN(n) && n > 0;
    }

    handleNewProject(event) {
        event.preventDefault();
        this.setState({ validated: true });
        const { selectedClientModal, selectedAppointed, projectTitle, projectFixedFee, projectFee } = this.state;

        if(projectFixedFee === 'true' && !this.isFloat(projectFee)) return;

        if(projectTitle === '' || selectedClientModal == null || selectedAppointed == null) return;

        const payload = {
            projectTitle: projectTitle,
            projectClient: selectedClientModal.uid,
            appointedIds: selectedAppointed.value,
            projectFixedFee: projectFixedFee === 'true',
            projectFee: Number(projectFee),
            isOpen: true
        };
        this.props.addProject(payload);
        this.props.getProjectByClient(selectedClientModal.value);
        this.setState({ ...INITIAL_STATE, selectedOption: selectedClientModal });
    }

    handleChangeMain = selectedOption => { 
        this.setState( { selectedOption } );
        this.props.getProjectByClient(selectedOption.value);
    };
    
    handleChangeClientModal = selectedClientModal => { this.setState( { selectedClientModal } ); };
    
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

    renderModal(){
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c, i) => ({
                label: c.denomination || '',
                value: c.uid,
                ...c
            })).sort((a, b) => a.label?.localeCompare(b.label)) : [];

        const userSelect = this.props.users !== null ?
            this.props.users.map((u, i) => ({
                label: u.name || '',
                value: u.uid,
                ...u
            })).sort((a, b) => a.name?.localeCompare(b.name)) : [];

        const { showModal, selectedClientModal, selectedAppointed, projectTitle, projectFixedFee, projectFee } = this.state;

        return(
            <Modal show={showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleNewProject}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Client</Form.Label>
                            <Col sm="7">
                                <Select required value={selectedClientModal} placeholder="Select client..." options={clientSelect} onChange={this.handleChangeClientModal} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Title</Form.Label>
                            <Col sm="7">
                                <Form.Control isInvalid={projectTitle.length === 0} name="projectTitle" value={projectTitle} onChange={this.onChange} as="textarea" rows="2" required/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Attorney</Form.Label>
                            <Col sm="7">
                                {/* USERS */}
                                <Select value={selectedAppointed} placeholder="Select appointed..." onChange={this.handleChangeMulti} options={userSelect} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Billed by </Form.Label>
                            <Col sm="7">
                                <Form.Control name="projectFixedFee" onChange={this.onChange} as="select" required>
                                    <option value={false}>The hour</option>
                                    <option value={true}>Fixed fee</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} hidden={projectFixedFee === 'false'}>
                            <Form.Label column sm="3"> Fee </Form.Label>
                            <Col sm="7">
                                <Form.Control isInvalid={!this.isFloat(projectFee)} name="projectFee" value={projectFee} onChange={this.onChange} required />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleNewProject}> Save </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c, i) => ({
                label: c.denomination || '',
                value: c.uid,
                ...c
            })).sort((a, b) => a.label?.localeCompare(b.label)) : [];

        const { selectedOption } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    this.props.loadingClients ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                    <div>
                        {/* MODAL */}
                        {this.renderModal()}
                        <Button className="legem-primary" size="lg" block onClick={this.handleShow}>
                            New project
                        </Button>

                        {/* LE SELECT */}
                        <Select placeholder="Select client..." options={clientSelect} value={selectedOption} onChange={this.handleChangeMain} className="rightMargin leftMargin topMargin" />

                        {/* LISTA PA MOSTRA SI HAY CLIENTES */}
                        <br />

                        {
                            this.props.loadingProjects ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                            <div className="tableMargins">
                                <TableContainer>
                                    <Table aria-label="simple table">
                                        {
                                            this.props.projects.length === 0 && selectedOption != null ? 
                                            <TableBody>
                                                <b>
                                                    There are no active projects for this client.
                                                </b>
                                            </TableBody>
                                            :
                                            <TableBody>
                                                {this.props.projects.map((row) => (
                                                    <TableRow hover key={row.projectTitle} >
                                                        <TableCell component="th" scope="row">
                                                            <Link to={`/projects/${row.projectClient}/${row.uid}`}>{row.projectTitle}</Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                                }
                                            </TableBody>
                                        }
                                        
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
    clearAlert,
    addAlert,
    getClients,
    getUsers,
    addProject,
    getProjectByClient
})(withAuthorization(condition)(Proyectos));