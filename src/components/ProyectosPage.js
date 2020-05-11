import React, { Component } from 'react';
import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import Select from 'react-select';
import { addAlert, clearAlert, getClients } from "../redux/actions/index";
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
        loadingClients: state.loadingClients
     };
};

const INITIAL_STATE = {
    showModal: false,
    selectedOption: null
};

class Proyectos extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
    }

    componentDidMount() {
        if(this.props.clients.length === 0) {
            this.props.getClients();
        }
    }

    handleChangeSelect = selectedOption => {
        this.setState(
          { selectedOption },
          () => console.log(`Option selected:`, this.state.selectedOption)
        );
    };

    handleShow() {
        this.setState({ showModal: true });
    }

    handleClose() {
        this.setState({ showModal: false });
    }

    renderModal(){
        return(
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Client</Form.Label>
                            <Col sm="5">
                                <Form.Control as="select">
                                    <option> Cliente 1 </option>
                                    <option> Cliente 2 </option>
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Title</Form.Label>
                            <Col sm="5">
                                <Form.Control as="textarea" rows="3" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Appointed</Form.Label>
                            <Col sm="5">
                                {/* USERS */}
                                <Select isMulti>

                                </Select>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Billed by </Form.Label>
                            <Col sm="5">
                                <Form.Control as="select">
                                    <option>The hour</option>
                                    <option>Fixed fee</option>
                                </Form.Control>
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
                        <Select options={clientSelect} value={selectedOption} onChange={this.handleChangeSelect} className="rightMargin leftMargin topMargin"> PA CLIENTES</Select>

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
    getClients
})(withAuthorization(condition)(Proyectos));