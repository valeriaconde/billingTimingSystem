import React, { Component } from 'react';
import { Row, Col, OverlayTrigger, Tooltip, Container, Button, Form, Modal, Jumbotron } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

class tiemposPage extends Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false };

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    renderModal() {
        return (
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

                        {/* SOLO PROYECTOS DEL CLIENTE ELEGIDO EN LA OPCION ANTERIOR */}
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
        )
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

                        <Jumbotron fluid>
                            <Container>
                                <h1>You have no registered times</h1>
                            </Container>
                        </Jumbotron>

                        <div className="tableMargins topMargin">
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <colgroup>
                                        <col width="80%" />
                                        <col width="10%" />
                                        <col width="5%" />
                                        <col width="5%" />
                                    </colgroup>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Registered times</b></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>

                                    {/* TABLE BODY IGUAL QUE GASTOS, EXCEPTO:
                                        - TOOLTIP SOLO MUESTRA FECHA (NO HAY TIPO DE GASTO)
                                        - HORAS Y MINUTOS EN LUGAR DE MONTO                                    
                                    */}

                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <OverlayTrigger overlay={
                                                    <Tooltip>
                                                        <br />
                                                    </Tooltip>
                                                }>
                                                    <span className="d-inline-block">
                                                        <br />
                                                    </span>
                                                </OverlayTrigger>
                                            </TableCell>
                                            <TableCell className="rightAlign">

                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>
                                                <FontAwesomeIcon icon={faEdit} className="legemblue" />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(tiemposPage);