import React, { Component } from 'react';
import { Row, Col, Accordion, Card, Container, Button, Form, Modal, Jumbotron } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';

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
            <AuthUserContext.Consumer>
                {authUser =>
                    <div>
                        <Button className="legem-primary" size="lg" block onClick={this.handleShow}>
                            Register time
                    </Button>

                        {/* MODAL */}
                        <Modal show={this.state.showModal} onHide={this.handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Time register</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3">
                                            Client
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
                                            Project
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
                                            Title
                                    </Form.Label>
                                        <Col sm="5">
                                            <Form.Control as="textarea" rows="2" />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3">
                                            Date
                                    </Form.Label>
                                        <Col sm="5">
                                            {/* DAY PICKER */}
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3">
                                            Time
                                    </Form.Label>
                                        <Col sm="5">
                                            <Container>
                                                <Row>
                                                    <Col>
                                                        <Form.Control as="textarea" rows="1" column="3" />
                                                    </Col>
                                                    <Col>
                                                        <Form.Control as="select">
                                                            <option> 0 </option>
                                                            <option> 15 </option>
                                                            <option> 30 </option>
                                                            <option> 45 </option>
                                                        </Form.Control>
                                                    </Col>
                                                </Row>
                                            </Container>
                                            <Container>
                                                <Row>
                                                    <Col>
                                                        <Form.Label> hours </Form.Label>
                                                    </Col>
                                                    <Col>
                                                        <Form.Label> minutes </Form.Label>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Col>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose}>
                                    Cancel
                            </Button>
                                <Button className="legem-primary" onClick={this.handleClose}>
                                    Save
                            </Button>
                            </Modal.Footer>
                        </Modal>

                        {/* JUMBOTRON SHOWS IF USER HAS NO REGISTERED TIMES*/}
                        <Jumbotron fluid>
                            <Container>
                                <h1>You have no registered times</h1>
                            </Container>
                        </Jumbotron>

                        {/* ELSE */}
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
                                        <Card.Text> Descripcion </Card.Text>
                                        <Card.Text> 07 de marzo de 2019 </Card.Text>
                                        <Card.Text>
                                            <Container>
                                                <Row>
                                                    <Col sm={8}></Col>
                                                    <Col sm={4}>
                                                        <Button variant="outline-dark">Edit</Button>
                                                        <Button variant="outline-danger" className="leftMargin">Delete</Button>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Card.Text>
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
                                        <Card.Text> Descripcion </Card.Text>
                                        <Card.Text> 07 de marzo de 2019 </Card.Text>
                                        <Card.Text>
                                            <Container>
                                                <Row>
                                                    <Col sm={8}></Col>
                                                    <Col sm={4}>
                                                        <Button variant="outline-dark">Edit</Button>
                                                        <Button variant="outline-danger" className="leftMargin">Delete</Button>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Card.Text>
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
export default withAuthorization(condition)(tiemposPage);