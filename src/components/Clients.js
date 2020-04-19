import React, { Component } from 'react';
import { ListGroup, Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { AlertType } from '../stores/AlertStore';
import { connect } from "react-redux";
import { addAlert, clearAlert, addClient } from "../redux/actions/index";

const mapStateToProps = state => {
    return { alerts: state.alerts };
};

const INITIAL_STATE = {
    denomination: '',
    address: '',
    rfc: '',
    contact: '',
    email: '',
    phone: '',
    website: '',
    yearSince: '',
    iva: true,
    validated: false,
    edit: false,
    showModalCliente: false,
    error: null
};

class Clientes extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.handleCloseCliente = this.handleCloseCliente.bind(this);
        this.handleShowCliente = this.handleShowCliente.bind(this);
        this.handleNewClient = this.handleNewClient.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
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

    handleShowCliente(e) {
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
                    <Modal.Title>Nuevo cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={this.state.validated} onSubmit={this.handleNewClient}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Denominación
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control name="denomination" onChange={this.handleOnChange} value={denomination} as="textarea" rows="1" required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Domicilio
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control name="address" onChange={this.handleOnChange} value={address} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                RFC
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control name="rfc" onChange={this.handleOnChange} value={rfc} as="textarea" rows="1" required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Contacto
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control name="contact" onChange={this.handleOnChange} value={contact} as="textarea" rows="1" required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Correo
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control name="email" onChange={this.handleOnChange} value={email} as="textarea" rows="1" required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Teléfono
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control name="phone" onChange={this.handleOnChange} value={phone} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Website
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control name="website" onChange={this.handleOnChange} value={website} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Cliente desde
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control name="yearSince" onChange={this.handleOnChange} value={yearSince} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} >
                            <Form.Label column sm="3"> IVA </Form.Label>
                            <Col sm="5">
                                <div>
                                <Form.Check
                                    type="radio"
                                    label="SI"
                                    name="ivaRadio"
                                    id="yesIVA"
                                    defaultChecked
                                />
                                <Form.Check
                                    type="radio"
                                    label="NO"
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
    
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        <Container className="topMargin">
                            <Row>
                                <Col sm={4}>
                                    <Button variant="success" size="lg" block onClick={this.handleShowCliente}> Nuevo Cliente </Button>

                                    {this.renderModal()}

                                    <ListGroup as="ul" className="">
                                        <ListGroup.Item as="li" > Cliente 1  </ListGroup.Item>
                                        <ListGroup.Item as="li" active className="legem-primary" >Cliente 2</ListGroup.Item>
                                        <ListGroup.Item as="li"> Cliente 3</ListGroup.Item>
                                        <ListGroup.Item as="li">Cliente 4</ListGroup.Item>
                                    </ListGroup>
                                </Col>
        
                                {/* toda esta seccion estara oculta mientras no haya un cliente seleccionado */}
                                <Col sm={8}>
                                    <Form>
                                        {/* DENOMINACION */}
                                        {/* excepto aqui, el placeholder debe ser DENOMINACION */}
                                        {
                                            this.state.edit ?
                                                <Form.Control size="lg" type="text" placeholder="Denominación" />
                                                :
                                                <h3> DENOMINACION </h3>
                                        }
        
                                        {/* DOMICILIO */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> Domicilio </Form.Label>
                                            <Col sm="5">
                                                {
                                                    this.state.edit ?
                                                        <Form.Control plaintext defaultValue=" " />
                                                        :
                                                        <Form.Control plaintext readOnly defaultValue="Domicilio" />
                                                }
                                            </Col>
                                        </Form.Group>
        
                                        {/* RFC */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> RFC </Form.Label>
                                            <Col sm="5">
                                                {
                                                    this.state.edit ?
                                                        <Form.Control plaintext defaultValue=" " />
                                                        :
                                                        <Form.Control plaintext readOnly defaultValue="RFC" />
                                                }
                                            </Col>
                                        </Form.Group>
        
                                        {/* CONTACTO */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> Contacto </Form.Label>
                                            <Col sm="5">
                                                {
                                                    this.state.edit ?
                                                        <Form.Control plaintext defaultValue=" " />
                                                        :
                                                        <Form.Control plaintext readOnly defaultValue="Contacto" />
                                                }
                                            </Col>
                                        </Form.Group>
        
                                        {/* CORREO */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> Correo </Form.Label>
                                            <Col sm="5">
                                                {
                                                    this.state.edit ?
                                                        <Form.Control plaintext defaultValue=" " />
                                                        :
                                                        <Form.Control plaintext readOnly defaultValue="Correo" />
                                                }
                                            </Col>
                                        </Form.Group>
        
                                        {/* TELEFONO */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> Teléfono </Form.Label>
                                            <Col sm="5">
                                                {
                                                    this.state.edit ?
                                                        <Form.Control plaintext defaultValue=" " />
                                                        :
                                                        <Form.Control plaintext readOnly defaultValue="Telefono" />
                                                }
                                            </Col>
                                        </Form.Group>
        
                                        {/* PAGINA WEB */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> Website </Form.Label>
                                            <Col sm="5">
                                                {
                                                    this.state.edit ?
                                                        <Form.Control plaintext defaultValue=" " />
                                                        :
                                                        <Form.Control plaintext readOnly defaultValue="Website" />
                                                }
                                            </Col>
                                        </Form.Group>
        
                                        {/* CLIENTE DESDE */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> Cliente desde </Form.Label>
                                            <Col sm="5">
                                                {
                                                    this.state.edit ?
                                                        <Form.Control plaintext defaultValue=" " />
                                                        :
                                                        <Form.Control plaintext readOnly defaultValue="2003" />
                                                }
                                            </Col>
                                        </Form.Group>
        
                                        {/* IVA */}
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4"> IVA </Form.Label>
                                            <Col sm="5">
                                                {/* creo que este codigo puede reducirse, nada mas que togglee los botones y togglee el estado a disabled... */}
                                                {
                                                    this.state.edit ?
                                                    <div>
                                                            {['radio'].map(type => (
                                                                <div key={`inline-${type}`} className="mb-3">
                                                                    <Form.Check inline label="SI" type={type} id={`inline-${type}-1`} />
                                                                    <Form.Check inline label="NO" type={type} id={`inline-${type}-1`} />
                                                                </div>
                                                            ))}
                                                    </div>
                                                        :
                                                    <div>
                                                            {['radio'].map(type => (
                                                                <div key={`inline-${type}`} className="mb-3">
                                                                    <Form.Check inline disabled label="SI" type={type} id={`inline-${type}-3`} />
                                                                    <Form.Check inline disabled label="NO" type={type} id={`inline-${type}-3`} />
                                                                </div>
                                                            ))}
                                                    </div>
                                                }
                                            </Col>
                                        </Form.Group>
        
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="5"></Form.Label>
                                            <Col sm="5">
                                                <>
                                                    <Button variant="outline-dark">Editar</Button>
                                                </>
                                            </Col>
                                        </Form.Group>
                                    </Form>
                                </Col>
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
    addClient
})(withAuthorization(condition)(Clientes));