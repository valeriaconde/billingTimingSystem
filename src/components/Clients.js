import React, { Component } from 'react';
import { ListGroup, Container, Row, Col, Form } from 'react-bootstrap';

class Clientes extends Component {
    constructor(props) {
        super(props);
        this.state = { 'edit': false };
    }
    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col sm={4}>
                            <ListGroup as="ul" className="">
                                <ListGroup.Item as="li" active className="legem-primary"> Cliente 1 </ListGroup.Item>
                                <ListGroup.Item as="li" >Cliente 2</ListGroup.Item>
                                <ListGroup.Item as="li"> Cliente 3</ListGroup.Item>
                                <ListGroup.Item as="li">Cliente 4</ListGroup.Item>
                            </ListGroup>
                        </Col>

                        {/* toda esta seccion estara oculta mientras no haya un cliente seleccionado */}
                        {/* el placeholder de toda la seecion debe ser vacio o el texto que ya exista en el label */}
                        <Col sm={8}>
                            <Form>
                                {/* DENOMINACION */}
                                {/* excepto aqui, el placeholder debe ser DENOMINACION */}
                                {
                                    this.state.edit ?
                                        <Form.Control type="text" placeholder="Denominación" /> 
                                        :
                                        <h3> DENOMINACION </h3>
                                }

                                {/* DOMICILIO */}
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="4"> Domicilio </Form.Label>
                                    <Col sm="5">
                                        {
                                            this.state.edit ?
                                                <Form.Control type="text" placeholder="Domicilio" />
                                                :
                                                <Form.Control plaintext readOnly defaultValue=" " />
                                        }
                                    </Col>
                                </Form.Group>

                                {/* RFC */}
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="4"> RFC </Form.Label>
                                    <Col sm="5">
                                        {
                                            this.state.edit ?
                                                <Form.Control type="text" placeholder="Password" />
                                                :
                                                <Form.Control plaintext readOnly defaultValue=" " />
                                        }
                                    </Col>
                                </Form.Group>

                                {/* CONTACTO */}
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="4"> Contacto </Form.Label>
                                    <Col sm="5">
                                        {
                                            this.state.edit ?
                                                <Form.Control type="text" placeholder="Password" />
                                                :
                                                <Form.Control plaintext readOnly defaultValue=" " />
                                        }
                                    </Col>
                                </Form.Group>

                                {/* CORREO */}
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="4"> Correo </Form.Label>
                                    <Col sm="5">
                                        {
                                            this.state.edit ?
                                                <Form.Control type="text" placeholder="Password" />
                                                :
                                                <Form.Control plaintext readOnly defaultValue=" " />
                                        }
                                    </Col>
                                </Form.Group>

                                {/* TELEFONO */}
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="4"> Teléfono </Form.Label>
                                    <Col sm="5">
                                        {
                                            this.state.edit ?
                                                <Form.Control type="text" placeholder="Password" />
                                                :
                                                <Form.Control plaintext readOnly defaultValue=" " />
                                        }
                                    </Col>
                                </Form.Group>

                                {/* PAGINA WEB */}
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="4"> Website </Form.Label>
                                    <Col sm="5">
                                        {
                                            this.state.edit ?
                                                <Form.Control type="text" placeholder="Password" />
                                                :
                                                <Form.Control plaintext readOnly defaultValue=" " />
                                        }
                                    </Col>
                                </Form.Group>

                                {/* CLIENTE DESDE */}
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="4"> Cliente desde </Form.Label>
                                    <Col sm="5">
                                        {
                                            this.state.edit ?
                                                <Form.Control type="text" placeholder="Password" />
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
                                                <Form>
                                                    {['radio'].map(type => (
                                                        <div key={`inline-${type}`} className="mb-3">
                                                            <Form.Check inline label="SI" type={type} id={`inline-${type}-1`} />
                                                            <Form.Check inline label="NO" type={type} id={`inline-${type}-1`} />
                                                        </div>
                                                    ))}
                                                </Form>
                                                :
                                                <Form>
                                                    {['radio'].map(type => (
                                                        <div key={`inline-${type}`} className="mb-3">
                                                            <Form.Check inline disabled label="SI" type={type} id={`inline-${type}-3`} />
                                                            <Form.Check inline disabled label="NO" type={type} id={`inline-${type}-3`} />
                                                        </div>
                                                    ))}
                                                </Form>
                                        }
                                    </Col>
                                </Form.Group>
                            </Form>


                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default Clientes;