import React, { Component } from 'react';
import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import Select from 'react-select';
import { addAlert, clearAlert, getClients, getUsers } from "../redux/actions/index";
import { AlertType } from '../stores/AlertStore';
import { connect } from "react-redux";
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import BarLoader from "react-spinners/BarLoader";
import TableBody from '@material-ui/core/TableBody';

const mapStateToProps = state => {
    return { 
        alerts: state.alerts,
        clients: state.clients,
        loadingClients: state.loadingClients,
        users: state.users,
        loadingUsers: state.loadingUsers
     };
};

const INITIAL_STATE = {
    showModal: false,
    selectedOption: null,
    selectedClientModal: null,
    selectedAppointed: null,
    projectTitle: '',
    projectFixedFee: 'false',
    projectFee: 0
};

class Proyectos extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        if(this.props.clients.length === 0) {
            this.props.getClients();
        }

        if(this.props.users.length === 0){
            this.props.getUsers();
        }
    }

    handleChangeMain = selectedOption => { this.setState( { selectedOption } ); };
    
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
                label: c.denomination,
                value: c.uid,
                ...c
            })).sort((a, b) => a.label.localeCompare(b.label)) : [];

        const userSelect = this.props.users !== null ?
            this.props.users.map((u, i) => ({
                label: u.name,
                value: u.uid,
                ...u
            })).sort((a, b) => a.name.localeCompare(b.name)) : [];

        const { selectedClientModal, selectedAppointed, projectTitle, projectFixedFee, projectFee } = this.state;

        return(
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Client</Form.Label>
                            <Col sm="7">
                                <Select value={selectedClientModal} placeholder="Select client..." options={clientSelect} onChange={this.handleChangeClientModal} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Title</Form.Label>
                            <Col sm="7">
                                <Form.Control name="projectTitle" value={projectTitle} onChange={this.onChange} as="textarea" rows="2" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Appointed</Form.Label>
                            <Col sm="7">
                                {/* USERS */}
                                <Select value={selectedAppointed} placeholder="Select appointed..." onChange={this.handleChangeMulti} options={userSelect} isMulti />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Billed by </Form.Label>
                            <Col sm="7">
                                <Form.Control name="projectFixedFee" onChange={this.onChange} as="select">
                                    <option value={false}>The hour</option>
                                    <option value={true}>Fixed fee</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} hidden={projectFixedFee === 'false'}>
                            <Form.Label column sm="3"> Fee </Form.Label>
                            <Col sm="7">
                                <Form.Control name="projectFee" value={projectFee} onChange={this.onChange}/>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                    <Button className="legem-primary" onClick={this.handleClose}> Save </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c, i) => ({
                label: c.denomination,
                value: c.denomination,
                ...c
            })).sort((a, b) => a.label.localeCompare(b.label)) : [];

        const { selectedOption } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    this.props.loadingClients ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                    <div>
                        {/* MODAL */}
                        <Button className="legem-primary" size="lg" block onClick={this.handleShow}>
                            New project
                        </Button>

                        {this.renderModal()}

                        {/* LE SELECT */}
                        <Select placeholder="Select client..." options={clientSelect} value={selectedOption} onChange={this.handleChangeMain} className="rightMargin leftMargin topMargin"> PA CLIENTES</Select>

                        {/* LISTA PA MOSTRA SI HAY CLIENTES */}
                        <br />

                        <div className="tableMargins">
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow hover>
                                            <TableCell>Proyecto 1 </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow hover>
                                            <TableCell> Proyecto 2</TableCell>
                                        </TableRow>
                                        <TableRow hover>
                                            <TableCell> Proyecto 3</TableCell>
                                        </TableRow>
                                        <TableRow hover>
                                            <TableCell> Proyecto 4 </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><b> No hay proyectos activos para "CLIENTE SELETZIONADO" </b></TableCell>
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
    getUsers
})(withAuthorization(condition)(Proyectos));