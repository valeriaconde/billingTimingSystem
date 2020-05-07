import React, { Component } from 'react';
import { ListGroup, Container, Row, Col, Form, Button, Modal, FormControl } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import BarLoader from "react-spinners/BarLoader";
import { AlertType } from '../stores/AlertStore';
import { connect } from "react-redux";
import { addAlert, clearAlert, addClient, getClients, updateClient, deleteClient } from "../redux/actions/index";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const mapStateToProps = state => {
    return { 
        alerts: state.alerts,
        clients: state.clients,
        loadingClients: state.loadingClients
     };
};

const INITIAL_STATE = {
    denomination: '', currDenomination: '',
    address: '', currAddress: '',
    rfc: '', currRfc: '',
    contact: '', currContact: '',
    email: '', currEmail: '',
    phone: '', currPhone: '',
    website: '', currWebsite: '',
    yearSince: '', currYearSince: '',
    uid: '', currUid: '',
    iva: true, currIva: true,
    validated: false,
    edit: false,
    showModalCliente: false,
    error: null,
    activeIdx: -1
};

class Clientes extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.handleCloseCliente = this.handleCloseCliente.bind(this);
        this.handleShowCliente = this.handleShowCliente.bind(this);
        this.handleNewClient = this.handleNewClient.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onClickClient = this.onClickClient.bind(this);
        this.onChangeRadio = this.onChangeRadio.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        if(this.props.clients.length === 0){
            this.props.getClients();
        }
    }

    onDelete(event) {
        if(window.confirm('¿Seguro que desea borrar al cliente?')) {
            this.props.deleteClient(this.props.clients[this.state.activeIdx].uid);
            this.setState({ activeIdx: -1, edit: false });
        }
    }

    onSave(event) {
        const { currDenomination, currAddress, currRfc, currContact,
            currEmail, currPhone, currWebsite, currYearSince, currIva, currUid } = this.state;
        
        if(currDenomination.length === 0) {
            this.props.addAlert(AlertType.Error, "Business name cannot be empty.");
            return;
        }

        if(currRfc.length === 0) {
            this.props.addAlert(AlertType.Error, "RFC cannot be empty.");
            return;
        }

        if(currContact.length === 0) {
            this.props.addAlert(AlertType.Error, "Contact cannot be empty.");
            return;
        }

        if(currEmail.length === 0) {
            this.props.addAlert(AlertType.Error, "Email cannot be empty.");
            return;
        }

        const payload = {
            address: currAddress, contact: currContact, denomination: currDenomination,
            email: currEmail, iva: currIva, phone: currPhone, rfc: currRfc,
            website: currWebsite, yearSince: currYearSince, uid: currUid
        };
        this.props.updateClient(currUid, payload);
        
        this.setState({ edit: false });
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onChangeRadio(event) {
        this.setState({ currIva: !this.state.currIva });
    }

    onEdit() {
        this.setState({ edit: true });
    }

    handleNewClient(event) {
        event.preventDefault();
        this.setState({ validated: true });

        const { denomination, address, rfc, contact, email,
            phone, website, yearSince } = this.state;
        const iva = document.getElementById("yesIVA").checked;

        if(denomination === "" || rfc === "" || contact === "" || email === "") return;

        const payload = {
            denomination: denomination,
            address: address,
            rfc: rfc,
            contact: contact,
            email: email,
            phone: phone,
            website: website,
            yearSince: yearSince,
            iva: iva
        };
        this.props.addClient(payload);
    }

    handleOnChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleShowCliente() {
        this.setState({ showModalCliente: true });
    }

    handleCloseCliente() {
        this.setState({ showModalCliente: false });
    }

    renderModal() {
        const { denomination, address, rfc, contact, email,
                phone, website, yearSince } = this.state;
        return(
            <Modal show={this.state.showModalCliente} onHide={this.handleCloseCliente}>
                <Modal.Header closeButton>
                    <Modal.Title>New client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={this.state.validated} onSubmit={this.handleNewClient}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Name
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control name="denomination" onChange={this.handleOnChange} value={denomination} as="textarea" rows="1" required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Address
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control name="address" onChange={this.handleOnChange} value={address} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                RFC
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control name="rfc" onChange={this.handleOnChange} value={rfc} as="textarea" rows="1" required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Contact
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control name="contact" onChange={this.handleOnChange} value={contact} as="textarea" rows="1" required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Email
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control name="email" onChange={this.handleOnChange} value={email} as="textarea" rows="1" required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Phone
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control name="phone" onChange={this.handleOnChange} value={phone} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Website
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control name="website" onChange={this.handleOnChange} value={website} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Client since
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control name="yearSince" onChange={this.handleOnChange} value={yearSince} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} >
                            <Form.Label column sm="3"> IVA </Form.Label>
                            <Col sm="7">
                                <div>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="ivaRadio"
                                    id="yesIVA"
                                    defaultChecked
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="ivaRadio"
                                    id="noIVA"
                                />
                                </div>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleCloseCliente}>
                        Cancelar
                    </Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleNewClient}>
                        Guardar cliente
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    onClickClient(event) {
        const activeIdx = event.target.value;
        this.setState({ activeIdx: activeIdx, edit: false,
            currUid: this.props.clients[activeIdx].uid,
            currDenomination: this.props.clients[activeIdx].denomination,
            currAddress: this.props.clients[activeIdx].address,
            currRfc: this.props.clients[activeIdx].rfc,
            currContact: this.props.clients[activeIdx].contact,
            currEmail: this.props.clients[activeIdx].email,
            currPhone: this.props.clients[activeIdx].phone,
            currWebsite: this.props.clients[activeIdx].website,
            currYearSince: this.props.clients[activeIdx].yearSince,
            currIva: this.props.clients[activeIdx].iva
        });
    }

    renderClients() {
        return(
            <ListGroup as="ul" className="">
                {this.props.clients.map((client, i) => <ListGroup.Item onClick={this.onClickClient} value={i} active={this.state.activeIdx === i} key={`user-${i}`} as="li" >{client.denomination}</ListGroup.Item>)}
            </ListGroup>
        );
    }
    
    render() {
        const { edit, currDenomination, currAddress, currRfc, currContact,
            currEmail, currPhone, currWebsite, currYearSince, currIva } = this.state;
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    this.props.loadingClients ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                    <div>
                        <Container className="topMargin">
                            <Row>
                                <Col sm={4}>
                                    <Button variant="success" size="lg" block onClick={this.handleShowCliente}> New client </Button>
                                    <FormControl placeholder="Search"/>
                                    {this.renderModal()}
                                    {this.renderClients()}
                                </Col>

                                { this.state.activeIdx === -1 ? <div/> :
                                <Col sm={8}>
                                    <Form onSubmit={this.onSave}>
                                        {
                                            this.state.edit ?
                                                <Form.Control value={currDenomination || "DENOMINACION"} onChange={this.onChange} name="currDenomination" size="lg" type="text" placeholder="Denominación" />
                                                :
                                                <h3> { currDenomination || "DENOMINACION" } </h3>
                                        }
        
                                        {/* DOMICILIO */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> Address </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currAddress} onChange={this.onChange} name="currAddress" readOnly={!edit} plaintext />
                                            </Col>
                                        </Form.Group>
        
                                        {/* RFC */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> RFC </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currRfc} onChange={this.onChange} name="currRfc" readOnly={!edit} plaintext />
                                            </Col>
                                        </Form.Group>
        
                                        {/* CONTACTO */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> Contact </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currContact} onChange={this.onChange} name="currContact" readOnly={!edit} plaintext />
                                            </Col>
                                        </Form.Group>
        
                                        {/* CORREO */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> Email </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currEmail} onChange={this.onChange} name="currEmail" readOnly={!edit} plaintext />
                                            </Col>
                                        </Form.Group>
        
                                        {/* TELEFONO */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> Phone </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currPhone} onChange={this.onChange} name="currPhone" readOnly={!edit} plaintext />
                                            </Col>
                                        </Form.Group>
        
                                        {/* PAGINA WEB */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> Website </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currWebsite} onChange={this.onChange} name="currWebsite" readOnly={!edit} plaintext />
                                            </Col>
                                        </Form.Group>
        
                                        {/* CLIENTE DESDE */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> Client since </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currYearSince} onChange={this.onChange} name="currYearSince" readOnly={!edit}  plaintext />
                                            </Col>
                                        </Form.Group>
        
                                        {/* IVA */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> IVA </Form.Label>
                                            <Col sm="5">
                                                <div>
                                                        {['radio'].map(type => (
                                                            <div key={`inline-${type}`} className="mb-3">
                                                                <Form.Check onChange={this.onChangeRadio} checked={currIva} inline name="radioBtn" label="Yes" type={type} id={`currIva`} />
                                                                <Form.Check onChange={this.onChangeRadio} checked={!currIva} inline name="radioBtn" label="No" type={type} id={`currNoIva`} />
                                                            </div>
                                                        ))}
                                                </div>
                                            </Col>
                                        </Form.Group>
        
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="5"></Form.Label>
                                            <Col sm="5">
                                                <>
                                                {
                                                    this.state.edit ?
                                                    <div>
                                                        <IconButton onClick={this.onDelete} color="secondary" aria-label="delete">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                        <Button onClick={this.onSave}>Save</Button>
                                                    </div>
                                                    : <Button onClick={this.onEdit} variant="outline-dark">Edit</Button>
                                                }
                                                </>
                                            </Col>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                }
                            </Row>
                        </Container>
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    clearAlert,
    addAlert,
    addClient,
    getClients,
    updateClient,
    deleteClient
})(withAuthorization(condition)(Clientes));