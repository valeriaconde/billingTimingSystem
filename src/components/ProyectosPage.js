import React, { Component } from 'react';
import { Button, Modal, Form, Col, Row, Container, Jumbotron, ListGroup } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import Select from 'react-select';

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
                {authUser =>
                    <div>
                        {/* MODAL */}
                        <Button className="legem-primary" size="lg" block onClick={this.handleShow}>
                            New project
                        </Button>

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

                        {/* JUMBOTRON */}
                        <Jumbotron fluid>
                            <Container>
                                <h1>You have no active projects</h1>
                            </Container>
                        </Jumbotron>

                        {/* LE SELECT */}
                        <Select className="rightMargin leftMargin"> PA CLIENTES</Select>

                        {/* LISTA PA MOSTRA SI HAY CLIENTES */}
                        <br></br>
                        <ListGroup variant="flush" className="rightMargin leftMargin">
                            <ListGroup.Item>Proyecto 1</ListGroup.Item>
                            <ListGroup.Item>Proyecto 2</ListGroup.Item>
                            <ListGroup.Item>Proyecto 3 babu</ListGroup.Item>
                            <ListGroup.Item>Otro proyecton claro que si</ListGroup.Item>
                            {/* SI NO HAY PROYECTOS SOLO MOSTRAR: */}
                            <ListGroup.Item><b> No hay proyectos activos para /"CLIENTE SELETZIONADO" </b></ListGroup.Item>
                        </ListGroup>

                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(Proyectos);