import React, { Component } from 'react';
import { Button, Modal, Form, Row, Col, Accordion, Card, Container, Jumbotron } from 'react-bootstrap';
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
                {authUser =>
                    <div>
                        {/* MODAL */}
                        <Button className="legem-primary" size="lg" block onClick={this.handleShow}>
                            New expense
                    </Button>

                        <Modal show={this.state.showModal} onHide={this.handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>New expense</Modal.Title>
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
                                        <Form.Label column sm="3">Title</Form.Label>
                                        <Col sm="5">
                                            <Form.Control as="textarea" rows="2" />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3">Amount</Form.Label>
                                        <Col sm="5">
                                            <Form.Control as="textarea" rows="1" />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3">Date</Form.Label>
                                        <Col sm="5">
                                            {/* DAY PICKER */}
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3">Class</Form.Label>
                                        <Col sm="5">
                                            <Form.Control as="select">
                                                <option> Third party fee </option>
                                                <option> Transportation expense </option>
                                                <option> Governmental administrative fee (Rights, fines, etc.) </option>
                                                <option> Other </option>
                                            </Form.Control>
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

                        {/* EXPENSES */}
                        {/* JUMBOTRON SHOWS IF USER HAS NO REGISTERED EXPENSES*/}
                        <Jumbotron fluid>
                            <Container>
                                <h1>You have no registered expenses</h1>
                            </Container>
                        </Jumbotron>

                        <Accordion className="topMargin leftMargin rightMargin" defaultActiveKey="0">
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="0" ><b>
                                    <Container>
                                        <Row>
                                            <Col sm={8}>VCN - Anchor Bay Packaging de Mexico, S. de R.L. de C.V. - Fine payment </Col>
                                            <Col sm={4}> $400.00 </Col>
                                        </Row>
                                    </Container>
                                </b></Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <Card.Text> 07 de marzo de 2019 </Card.Text>
                                        <Card.Text> Gastos de traslado (tipo de gasto)</Card.Text>
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
                            <Accordion.Toggle as={Card.Header} eventKey="1" ><b>
                                    <Container>
                                        <Row>
                                            <Col sm={8}> CLIENTES - CONCEPTO </Col>
                                            <Col sm={4}> MONTO </Col>
                                        </Row>
                                    </Container>
                                </b></Accordion.Toggle>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <Card.Text> FECHA </Card.Text>
                                        <Card.Text> TIPO DE GASTO </Card.Text>
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
export default withAuthorization(condition)(gastos);