import React, { Component } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

const INITIAL_STATE = {
    showModal: false,
};

class detailedProject extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    handleShow() {
        this.setState({ showModal: true });
    }

    handleClose() {
        this.setState({ showModal: false });
    }

    renderModal() {
        return (
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add down payment</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Date</Form.Label>
                            <Col sm="5">
                                {/* DAY PICKER */}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Amount</Form.Label>
                            <Col sm="5">
                                <Form.Control as="textarea" rows="1" />
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
        );
    }

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    <div>
                        <h3 className="blueLetters topMargin leftMargin"> Titulo del proyecto </h3>
                        <h6 className="bigLeftMargin"> For Cloos Robotic Mexico, S.A. de C.V. </h6>

                        <Container className="bigTopMargin">
                            <Row>
                                <Col className="bigLeftMargin">
                                    <Card style={{ width: '18rem' }} >
                                        <Card.Body>
                                            <Card.Title>Attorney</Card.Title>
                                            <Card.Text> Lesly Martinez </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    <Card style={{ width: '18rem' }} className="topMargin">
                                        <Card.Body>
                                            <Card.Title> Billed by fixed fee</Card.Title>
                                            <Card.Text> $4000 </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="leftMargin">
                                    <Card style={{ width: '18rem' }} >
                                        <Card.Body>
                                            <Card.Title>Down payments</Card.Title>
                                            <TableContainer>
                                                <Table aria-label="simple table">
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell> 16/02/20 </TableCell>
                                                            <TableCell className="centerText"> 4000 </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell> 03/03/20 </TableCell>
                                                            <TableCell className="centerText"> 600 </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Card.Body>
                                        <Card.Body className="rightAlign">
                                            <Button variant="outline-success" onClick={this.handleShow} >Add</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>

                        {this.renderModal()}

                        {/* EXPENSES TABLE */}
                        <div className="tableMargins ">
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
                                            <TableCell><b>Registered expenses</b></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell> VCN - Vuelo NYC </TableCell>
                                            <TableCell className="rightAlign"> 8000</TableCell>
                                            <TableCell className="centerText">
                                                <FontAwesomeIcon icon={faTrash} color="red" />
                                            </TableCell>
                                            <TableCell> 
                                                <FontAwesomeIcon icon={faCheckCircle} color="green"/>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell> OCM - Pago de peritos</TableCell>
                                            <TableCell className="rightAlign" >6000 </TableCell>
                                            <TableCell className="centerText">
                                                <FontAwesomeIcon icon={faCheckCircle} color="green"/>
                                            </TableCell>
                                            <TableCell> 
                                                <FontAwesomeIcon icon={faTrash} color="red" />

                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>INICIALES - NOMBRE DEL GASTO  </TableCell>
                                            <TableCell className="rightAlign">MONTO</TableCell>
                                            <TableCell> D </TableCell>
                                            <TableCell>B</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell> Total expenses  </TableCell>
                                            <TableCell className="rightAlign">14,900</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        {/* TIME TABLE */}
                        <div className="tableMargins topMargin bottomMargin">
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
                                            <TableCell><b>Registered time</b></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell> VCN - Revision de contrato</TableCell>
                                            <TableCell className="rightAlign"> 15m</TableCell>
                                            <TableCell> D  </TableCell>
                                            <TableCell> B </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell> OCM - Negociacion JCA  ksjnd akhsd ksd ksjd kdf kdj fkj dkjf skj fkjs kfjs kd skd</TableCell>
                                            <TableCell className="rightAlign" >2h 30m </TableCell>
                                            <TableCell> D </TableCell>
                                            <TableCell> B </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>LLM - Viaje </TableCell>
                                            <TableCell className="rightAlign">3h</TableCell>
                                            <TableCell> D </TableCell>
                                            <TableCell> B </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Total time </TableCell>
                                            <TableCell className="rightAlign">5h 45m</TableCell>
                                            <TableCell> </TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <div className="rightAlign rightMargin bottomMargin">
                            <Button variant="outline-danger">Archive project</Button>{' '}
                        </div>



                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(detailedProject);