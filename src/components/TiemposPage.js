import React, { Component } from 'react';
import { Row, Col, Accordion, Card, Container, Button, Form, Modal, } from 'react-bootstrap';

class tiemposPage extends Component {
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
            <div>

                <Button className="legem-primary" size="lg" block onClick={this.handleShow}>
                    Registrar tiempos
                </Button>

                {/* MODAL */}
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registrar tiempos</Modal.Title>
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

                            {/* ESTOS SON SOLO PROYECTOS DEL CLIENTE ELEGIDO EN LA OPCION ANTERIOR */}
                            <Form.Group as={Row}>
                                <Form.Label column sm="3">
                                    Proyecto
                                </Form.Label>
                                <Col sm="5">
                                    <Form.Control as="select">
                                        <option> Proyecto 1 </option>
                                        <option> Proyecto 2 </option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column sm="3">
                                    Fecha
                                </Form.Label>
                                <Col sm="5">
                                    {/* DAY PICKER */}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column sm="3">
                                    Tiempo
                                </Form.Label>
                                <Col sm="5">
                                    <Form.Control as="textarea" rows="1" column="3" />
                                    <Form.Label> horas</Form.Label>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column sm="3">
                                </Form.Label>
                                <Col sm="5">
                                    <Form.Control as="select">
                                        <option> 0 </option>
                                        <option> 15 </option>
                                        <option> 30 </option>
                                        <option> 45 </option>
                                    </Form.Control>
                                    <Form.Label> minutos</Form.Label>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancelar
                        </Button>
                        <Button className="legem-primary" onClick={this.handleClose}>
                            Registrar tiempo
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* EN ORDEN ALFABETICO DE CLIENTES */}
                {/* ASUNTOS ACTIVOS */}
                <h4 className="topMargin leftMargin greenLetters"> Activos </h4>

                <Accordion className="topMargin leftMargin rightMargin" defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0" ><b>
                            <Container>
                                <Row>
                                    <Col sm={8}>
                                        CLIENTE - PROYECTO
                                    </Col>
                                    <Col sm={4}>
                                        1h 15m
                                    </Col>
                                </Row>
                            </Container>
                        </b></Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Card.Text> Descripcion, blablabla </Card.Text>
                                <Card.Text> Oscar Conde (usuario) </Card.Text>
                                <Card.Text> 07 de marzo de 2019 </Card.Text>
                                <Card.Text> 1h 15min </Card.Text>
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
                        <Accordion.Toggle as={Card.Header} eventKey="1"><b>
                            <Container>
                                <Row>
                                    <Col sm={8}>
                                        CLIENTE - PROYECTO
                                    </Col>
                                    <Col sm={4}>
                                        15m 
                                    </Col>
                                </Row>
                            </Container>
                        </b></Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <Card.Text> Descripcion, blablabla </Card.Text>
                                <Card.Text> Oscar Conde (usuario) </Card.Text>
                                <Card.Text> 07 de marzo de 2019 </Card.Text>
                                <Card.Text> 1h 15min </Card.Text>
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
                <Accordion className="topMargin leftMargin rightMargin" defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0"><b>
                            <Container>
                                <Row>
                                    <Col sm={8}>
                                        CLIENTE - PROYECTO
                                    </Col>
                                    <Col sm={4}>
                                        45m
                                    </Col>
                                </Row>
                            </Container>
                        </b></Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Card.Text> Descripcion, blablabla </Card.Text>
                                <Card.Text> Oscar Conde (usuario) </Card.Text>
                                <Card.Text> 07 de marzo de 2019 </Card.Text>
                                <Card.Text> 1h 15min </Card.Text>
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
                        <Accordion.Toggle as={Card.Header} eventKey="1"><b>
                            <Container>
                                <Row>
                                    <Col sm={8}>
                                        CLIENTE - PROYECTO
                                    </Col>
                                    <Col sm={4}>
                                        2h 30m
                                    </Col>
                                </Row>
                            </Container>
                        </b></Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <Card.Text> Descripcion, blablabla </Card.Text>
                                <Card.Text> Oscar Conde (usuario) </Card.Text>
                                <Card.Text> 07 de marzo de 2019 </Card.Text>
                                <Card.Text> 1h 15min </Card.Text>
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
        );
    }
}
export default tiemposPage;