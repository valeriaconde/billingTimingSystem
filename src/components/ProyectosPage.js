import React, { Component } from 'react';
import { Accordion, Card, Button, Modal, Form, Col, Row, Container } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';

class Proyectos extends Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false };

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    handleShow() {
        this.setState({ showModal: true });
    }

    handleClose() {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <AuthUserContext.Consumer>
            { authUser =>
                <div>
                    {/* MODAL */}
                    <Button className="legem-primary" size="lg" block onClick={this.handleShow}>
                        Nuevo proyecto
                    </Button>

                    <Modal show={this.state.showModal} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Nuevo proyecto</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">
                                        Cliente
                                    </Form.Label>
                                    <Col sm="5">
                                        <Form.Control as="select">
                                            <option> Cliente 1 </option>
                                            <option> Cliente 2 </option>
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">
                                        Título
                                    </Form.Label>
                                    <Col sm="5">
                                        <Form.Control as="textarea" rows="1" />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">
                                        Descripción
                                    </Form.Label>
                                    <Col sm="5">
                                        <Form.Control as="textarea" rows="3" />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">
                                        Responsables
                                    </Form.Label>
                                    <Col sm="5">
                                        <Form.Group controlId="formBasicCheckbox">
                                            <Form.Check type="checkbox" label="Abogado 1" />
                                            <Form.Check type="checkbox" label="Abogado 2" />
                                            <Form.Check type="checkbox" label="Abogado 3" />
                                            <Form.Check type="checkbox" label="Abogado 4" />
                                        </Form.Group>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">
                                        Facturación
                                    </Form.Label>
                                    <Col sm="5">
                                        <Form.Control as="select">
                                            <option>Por hora</option>
                                            <option>Costo fijo</option>
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">
                                        Anticipo
                                    </Form.Label>
                                    <Col sm="5">
                                        <Form.Control as="textarea" rows="1" placeholder="$" />
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Cancelar
                            </Button>
                            <Button className="legem-primary" onClick={this.handleClose}>
                                Guardar proyecto
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* ASUNTOS ACTIVOS */}
                    <h4 className="topMargin leftMargin greenLetters"> Activos </h4>

                    <Accordion className="topMargin leftMargin" defaultActiveKey="0">
                        <h5> Cliente, S.A. de C.V.</h5>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0"><b> Contrato de trabajo </b></Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Card.Text>
                                        Descripcion del proyecto, etc, etc. Valeria es la mejor y esta es una prueba para ver que se pueda guardar texto largo en la descripcion. Aesop lived very ages ago...
                                    </Card.Text>
                                    <Card.Text> Facturado por hora. </Card.Text>
                                    <Card.Text> Anticipo: $20,000.00 MXN </Card.Text>
                                    <Card.Text> Responsables: Oscar, Lesly, Fabiola </Card.Text>
                                    <Container>
                                        <Row>
                                            <Col></Col>
                                            <Col md="auto">
                                                <>
                                                    <Button variant="outline-success">Marcar como completado</Button>
                                                    {/* alertar, de verdad quieres completar y cerrar este proyecto?  */}
                                                </>
                                            </Col>
                                            <Col lg="2">
                                                <>
                                                    <Button variant="outline-dark">Editar</Button>
                                                </>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1"><b>IMMEX </b></Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <Card.Text>
                                        Descripcion del proyecto, etc, etc. Valeria es la mejor y esta es una prueba para ver que se pueda guardar texto largo en la descripcion. Aesop lived very ages ago...
                                    </Card.Text>
                                    <Card.Text> Facturado por hora. </Card.Text>
                                    <Card.Text> Anticipo: $20,000.00 MXN </Card.Text>
                                    <Card.Text> Responsables: Oscar, Lesly, Fabiola </Card.Text>
                                    <Container>
                                        <Row>
                                            <Col></Col>
                                            <Col md="auto">
                                                <>
                                                    <Button variant="outline-success">Marcar como completado</Button>
                                                    {/* alertar, de verdad quieres completar y cerrar este proyecto?  */}
                                                </>
                                            </Col>
                                            <Col lg="2">
                                                <>
                                                    <Button variant="outline-dark">Editar</Button>
                                                </>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>

                    <Accordion className="topMargin leftMargin" defaultActiveKey="0">
                        <h5> Cliente, S.A. de C.V.</h5>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0"><b> Demanda mercantil </b></Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Card.Text>
                                        Descripcion del proyecto, etc, etc. Valeria es la mejor y esta es una prueba para ver que se pueda guardar texto largo en la descripcion. Aesop lived very ages ago...
                                    </Card.Text>
                                    <Card.Text> Facturado por hora. </Card.Text>
                                    <Card.Text> Anticipo: $20,000.00 MXN </Card.Text>
                                    <Card.Text> Responsables: Oscar, Lesly, Fabiola </Card.Text>
                                    <Container>
                                        <Row>
                                            <Col></Col>
                                            <Col md="auto">
                                                <>
                                                    <Button variant="outline-success">Marcar como completado</Button>
                                                    {/* alertar, de verdad quieres completar y cerrar este proyecto?  */}
                                                </>
                                            </Col>
                                            <Col lg="2">
                                                <>
                                                    <Button variant="outline-dark">Editar</Button>
                                                </>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1"><b> Contrato colectivo </b></Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <Card.Text>
                                        Descripcion del proyecto, etc, etc. Valeria es la mejor y esta es una prueba para ver que se pueda guardar texto largo en la descripcion. Aesop lived very ages ago...
                                    </Card.Text>
                                    <Card.Text> Facturado por hora. </Card.Text>
                                    <Card.Text> Anticipo: $20,000.00 MXN </Card.Text>
                                    <Card.Text> Responsables: Oscar, Lesly, Fabiola </Card.Text>
                                    <Container>
                                        <Row>
                                            <Col></Col>
                                            <Col md="auto">
                                                <>
                                                    <Button variant="outline-success">Marcar como completado</Button>
                                                    {/* alertar, de verdad quieres completar y cerrar este proyecto?  */}
                                                </>
                                            </Col>
                                            <Col lg="2">
                                                <>
                                                    <Button variant="outline-dark">Editar</Button>
                                                </>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>

                    {/* ASUNTOS CERRADOS */}

                    <h4 className="topMargin leftMargin redLetters"> Cerrados </h4>
                    <Accordion className="topMargin leftMargin" defaultActiveKey="0">
                        <h5> Cliente, S.A. de C.V.</h5>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0"><b> Contrato de trabajo </b></Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Card.Text>
                                        Descripcion del proyecto, etc, etc. Valeria es la mejor y esta es una prueba para ver que se pueda guardar texto largo en la descripcion. Aesop lived very ages ago...
                                    </Card.Text>
                                    <Card.Text> Facturado por hora. </Card.Text>
                                    <Card.Text> Anticipo: $20,000.00 MXN </Card.Text>
                                    <Card.Text> Responsables: Oscar, Lesly, Fabiola </Card.Text>
                                    <Container>
                                        <Row>
                                            <Col></Col>
                                            <Col md="auto">
                                                <>
                                                    <Button variant="outline-success">Marcar como completado</Button>
                                                    {/* alertar, de verdad quieres completar y cerrar este proyecto?  */}
                                                </>
                                            </Col>
                                            <Col lg="2">
                                                <>
                                                    <Button variant="outline-dark">Editar</Button>
                                                </>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1"><b>IMMEX </b></Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <Card.Text>
                                        Descripcion del proyecto, etc, etc. Valeria es la mejor y esta es una prueba para ver que se pueda guardar texto largo en la descripcion. Aesop lived very ages ago...
                                    </Card.Text>
                                    <Card.Text> Facturado por hora. </Card.Text>
                                    <Card.Text> Anticipo: $20,000.00 MXN </Card.Text>
                                    <Card.Text> Responsables: Oscar, Lesly, Fabiola </Card.Text>
                                    <Container>
                                        <Row>
                                            <Col></Col>
                                            <Col md="auto">
                                                <>
                                                    <Button variant="outline-success">Marcar como completado</Button>
                                                    {/* alertar, de verdad quieres completar y cerrar este proyecto?  */}
                                                </>
                                            </Col>
                                            <Col lg="2">
                                                <>
                                                    <Button variant="outline-dark">Editar</Button>
                                                </>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>

                    <Accordion className="topMargin leftMargin" defaultActiveKey="0">
                        <h5> Cliente, S.A. de C.V.</h5>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0"><b> Demanda mercantil </b></Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Card.Text>
                                        Descripcion del proyecto, etc, etc. Valeria es la mejor y esta es una prueba para ver que se pueda guardar texto largo en la descripcion. Aesop lived very ages ago...
                                    </Card.Text>
                                    <Card.Text> Facturado por hora. </Card.Text>
                                    <Card.Text> Anticipo: $20,000.00 MXN </Card.Text>
                                    <Card.Text> Responsables: Oscar, Lesly, Fabiola </Card.Text>
                                    <Container>
                                        <Row>
                                            <Col></Col>
                                            <Col md="auto">
                                                <>
                                                    <Button variant="outline-success">Marcar como completado</Button>
                                                    {/* alertar, de verdad quieres completar y cerrar este proyecto?  */}
                                                </>
                                            </Col>
                                            <Col lg="2">
                                                <>
                                                    <Button variant="outline-dark">Editar</Button>
                                                </>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1"><b> Contrato colectivo </b></Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <Card.Text>
                                        Descripcion del proyecto, etc, etc. Valeria es la mejor y esta es una prueba para ver que se pueda guardar texto largo en la descripcion. Aesop lived very ages ago...
                                    </Card.Text>
                                    <Card.Text> Facturado por hora. </Card.Text>
                                    <Card.Text> Anticipo: $20,000.00 MXN </Card.Text>
                                    <Card.Text> Responsables: Oscar, Lesly, Fabiola </Card.Text>
                                    <Container>
                                        <Row>
                                            <Col></Col>
                                            <Col md="auto">
                                                <>
                                                    <Button variant="outline-success">Marcar como completado</Button>
                                                    {/* alertar, de verdad quieres completar y cerrar este proyecto?  */}
                                                </>
                                            </Col>
                                            <Col lg="2">
                                                <>
                                                    <Button variant="outline-dark">Editar</Button>
                                                </>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(Proyectos);