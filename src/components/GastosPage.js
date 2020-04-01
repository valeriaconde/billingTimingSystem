import React, { Component } from 'react';
import { Button, Modal, Form, Row, Col, Accordion, Card, Container } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';

class gastos extends Component {
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
                        Registrar gasto
                    </Button>

                    <Modal show={this.state.showModal} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Nuevo gasto</Modal.Title>
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
                                        Concepto
                                    </Form.Label>
                                    <Col sm="5">
                                        <Form.Control as="textarea" rows="2" />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">
                                        Monto
                                    </Form.Label>
                                    <Col sm="5">
                                        <Form.Control as="textarea" rows="1" />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">
                                        Moneda
                                    </Form.Label>
                                    <Col sm="5">
                                        <Form.Control as="select">
                                            <option> MXN </option>
                                            <option> USD </option>
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
                                        Tipo de gasto
                                    </Form.Label>
                                    <Col sm="5">
                                        <Form.Control as="select">
                                            <option> Honorarios de terceros </option>
                                            <option> Gastos de traslado </option>
                                            <option> Pagos (Derechos, multas, etc.) </option>
                                            <option> Otro </option>
                                        </Form.Control>
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

                    {/* PENDIENTE PONER COLORES A LOS TIPOS DE GASTO */}

                    {/* ASUNTOS ACTIVOS */}
                    <h4 className="topMargin leftMargin greenLetters"> Activos </h4>

                    <Accordion className="topMargin leftMargin rightMargin" defaultActiveKey="0">
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0" ><b>
                                <Container>
                                    <Row>
                                        <Col sm={8}>
                                            CLIENTE - Vuelo MTY - CDMX (concepto)
                                        </Col>
                                        <Col sm={4}>
                                            $8,000.00 MXN (monto)
                                        </Col>
                                    </Row>
                                </Container>
                            </b></Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Card.Text>
                                        $8,000.00 MXN (monto)
                                    </Card.Text>
                                    <Card.Text> 07 de marzo de 2019 </Card.Text>
                                    <Card.Text> Gastos de traslado (tipo de gasto)</Card.Text>
                                    <Card.Text> Usuario: Oscar Conde </Card.Text>
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
                                            CLIENTE - Vuelo CDMX - MTY (concepto)
                                        </Col>
                                        <Col sm={4}>
                                            $600.00 USD
                                        </Col>
                                    </Row>
                                </Container>
                            </b></Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <Card.Text>
                                        $8,000.00 MXN (monto)
                                    </Card.Text>
                                    <Card.Text> 07 de marzo de 2019 </Card.Text>
                                    <Card.Text> Gastos de traslado (tipo de gasto)</Card.Text>
                                    <Card.Text> Usuario: Oscar Conde </Card.Text>
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
                                            CLIENTE - Vuelo MTY - CDMX (concepto)
                                        </Col>
                                        <Col sm={4}>
                                            $8,000.00 MXN (monto)
                                        </Col>
                                    </Row>
                                </Container>
                            </b></Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Card.Text>
                                        $8,000.00 MXN (monto)
                                    </Card.Text>
                                    <Card.Text> 07 de marzo de 2019 </Card.Text>
                                    <Card.Text> Gastos de traslado (tipo de gasto)</Card.Text>
                                    <Card.Text> Usuario: Oscar Conde </Card.Text>
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
                                            CLIENTE - CONCEPTO
                                        </Col>
                                        <Col sm={4}>
                                            $600.00 USD
                                        </Col>
                                    </Row>
                                </Container>
                            </b></Accordion.Toggle>
                            <Accordion.Collapse eventKey="1">
                                <Card.Body>
                                    <Card.Text>
                                        $8,000.00 MXN (monto)
                                    </Card.Text>
                                    <Card.Text> 07 de marzo de 2019 </Card.Text>
                                    <Card.Text> Gastos de traslado (tipo de gasto)</Card.Text>
                                    <Card.Text> Usuario: Oscar Conde </Card.Text>
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
export default withAuthorization(condition)(gastos);