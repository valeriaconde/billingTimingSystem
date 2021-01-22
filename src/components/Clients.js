import React, { Component } from 'react';
import { ListGroup, Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import BarLoader from "react-spinners/BarLoader";
import { AlertType } from '../stores/AlertStore';
import { connect } from "react-redux";
import { addAlert, clearAlert, addClient, getClients, updateClient, deleteClient } from "../redux/actions/index";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from 'react-select';

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
    address2: '', currAddress2: '',
    city: '', currCity: '',
    state: '', currState: '',
    zipCode: '', currZipCode: '',
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
        if(window.confirm('Are you sure you want to delete this client?')) {
            this.props.deleteClient(this.props.clients[this.state.activeIdx].uid);
            this.setState({ activeIdx: -1, edit: false });
        }
    }

    onSave(event) {
        const { currDenomination, currAddress, currAddress2, currCity, currState, currZipCode,
             currRfc, currContact, currEmail, currPhone, currWebsite, currYearSince, currIva, currUid } = this.state;
        
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
            address: currAddress, address2: currAddress2, city: currCity, state: currState,
            zipCode: currZipCode, contact: currContact, denomination: currDenomination,
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

        const { denomination, address, address2, city, state, zipCode,
             rfc, contact, email, phone, website, yearSince } = this.state;
        const iva = document.getElementById("yesIVA").checked;

        if(denomination === "" || rfc === "" || contact === "" || email === "") return;

        const payload = {
            denomination: denomination,
            address: address,
            address2: address2,
            city: city,
            state: state,
            zipCode: zipCode,
            rfc: rfc,
            contact: contact,
            email: email,
            phone: phone,
            website: website,
            yearSince: yearSince,
            iva: iva
        };
        this.props.addClient(payload);

        this.setState({ ...INITIAL_STATE });
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
        const { denomination, address, address2, rfc, contact, email,
                phone, website, yearSince, city, state, zipCode } = this.state;
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
                                <Form.Control placeholder="Street Address" name="address" onChange={this.handleOnChange} value={address} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Address 2
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control placeholder="Street Address Line 2" name="address2" onChange={this.handleOnChange} value={address2} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Col sm="10">
                                <Container>
                                    <Row>
                                        <Col>
                                            <Form.Control name="city" onChange={this.handleOnChange} value={city} as="textarea" rows="1" />
                                        </Col>
                                        <Col>
                                            <Form.Control name="state" onChange={this.handleOnChange} value={state} as="textarea" rows="1" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col><Form.Label>City</Form.Label></Col>
                                        <Col><Form.Label>State</Form.Label></Col>
                                    </Row>
                                </Container>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Zip Code
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control name="zipCode" onChange={this.handleOnChange} value={zipCode} as="textarea" rows="1" />
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
                        Cancel
                    </Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleNewClient}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    handleChangeClientModal = selectedClientModal => {
        this.setState( { selectedClientModal,
            activeIdx: selectedClientModal.idx,
            edit: false,
            currUid: selectedClientModal.uid,
            currDenomination: selectedClientModal.denomination,
            currAddress: selectedClientModal.address,
            currAddress2: selectedClientModal.address2,
            currCity: selectedClientModal.city,
            currState: selectedClientModal.state,
            currZipCode: selectedClientModal.zipCode,
            currRfc: selectedClientModal.rfc,
            currContact: selectedClientModal.contact,
            currEmail: selectedClientModal.email,
            currPhone: selectedClientModal.phone,
            currWebsite: selectedClientModal.website,
            currYearSince: selectedClientModal.yearSince,
            currIva: selectedClientModal.iva
        }); 
    };

    renderClients() {
        return(
            <ListGroup as="ul" className="">
                {this.props.clients.map((client, i) => <ListGroup.Item onClick={this.onClickClient} value={i} active={this.state.activeIdx === i} key={`user-${i}`} as="li" >{client.denomination}</ListGroup.Item>)}
            </ListGroup>
        );
    }
    
    render() {
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c, i) => ({
                label: c.denomination,
                value: c.uid,
                idx: i,
                ...c
            })).sort((a, b) => a.label?.localeCompare(b.label)) : [];

        const { edit, currDenomination, currAddress, currAddress2, currRfc, currContact, selectedClientModal,
            currEmail, currPhone, currWebsite, currYearSince, currIva, currCity, currState, currZipCode } = this.state;
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    this.props.loadingClients ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                    <div>
                        {this.renderModal()}
                        <Container className="topMargin">
                            <Row>
                                <Col sm={10}>
                                    <Button variant="success" size="lg" block onClick={this.handleShowCliente}> New client </Button>
                                    <Select required value={selectedClientModal} placeholder="Select client..." options={clientSelect} onChange={this.handleChangeClientModal} />
                                </Col>
                            </Row>
                            <Row><br/></Row>
                            <Row>
                                { this.state.activeIdx === -1 ? <div/> :
                                <Col sm={10}>
                                    <Form onSubmit={this.onSave}>
                                        {
                                            this.state.edit ?
                                                <Form.Control value={currDenomination || "DENOMINATION"} onChange={this.onChange} name="currDenomination" size="lg" type="text" placeholder="DENOMINATION" />
                                                :
                                                <h3> { currDenomination || "DENOMINATION" } </h3>
                                        }
        
                                        {/* DOMICILIO */}
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4"> Address </Form.Label>
                                            <Col sm="6">
                                                <Form.Control value={currAddress} onChange={this.onChange} name="currAddress" readOnly={!edit} />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4"> Address 2 </Form.Label>
                                            <Col sm="6">
                                                <Form.Control value={currAddress2} onChange={this.onChange} name="currAddress2" readOnly={!edit} />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row}>
                                            <Col sm="10">
                                                <Container>
                                                    <Row>
                                                        <Col>
                                                            <Form.Control name="currCity" onChange={this.onChange} value={currCity} readOnly={!edit} />
                                                        </Col>
                                                        <Col>
                                                            <Form.Control name="currState" onChange={this.onChange} value={currState} readOnly={!edit} />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col><Form.Label>City</Form.Label></Col>
                                                        <Col><Form.Label>State</Form.Label></Col>
                                                    </Row>
                                                </Container>
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4"> ZIP Code </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currZipCode} onChange={this.onChange} name="currZipCode" readOnly={!edit} />
                                            </Col>
                                        </Form.Group>
        
                                        {/* RFC */}
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4"> RFC </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currRfc} onChange={this.onChange} name="currRfc" readOnly={!edit} />
                                            </Col>
                                        </Form.Group>
        
                                        {/* CONTACTO */}
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4"> Contact </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currContact} onChange={this.onChange} name="currContact" readOnly={!edit} />
                                            </Col>
                                        </Form.Group>
        
                                        {/* CORREO */}
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4"> Email </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currEmail} onChange={this.onChange} name="currEmail" readOnly={!edit} />
                                            </Col>
                                        </Form.Group>
        
                                        {/* TELEFONO */}
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4"> Phone </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currPhone} onChange={this.onChange} name="currPhone" readOnly={!edit} />
                                            </Col>
                                        </Form.Group>
        
                                        {/* PAGINA WEB */}
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4"> Website </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currWebsite} onChange={this.onChange} name="currWebsite" readOnly={!edit} />
                                            </Col>
                                        </Form.Group>
        
                                        {/* CLIENTE DESDE */}
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4"> Client since </Form.Label>
                                            <Col sm="5">
                                                <Form.Control value={currYearSince} onChange={this.onChange} name="currYearSince" readOnly={!edit} />
                                            </Col>
                                        </Form.Group>
        
                                        {/* IVA */}
                                        <Form.Group as={Row}>
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
        
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4"></Form.Label>
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