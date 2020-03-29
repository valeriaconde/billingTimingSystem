import React, { Component } from 'react';
import { Jumbotron, Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';

class UsuariosPage extends Component {
    constructor(props) {
        super(props);
        this.state = { edit: false };
    }

    render() {
        return (
            <AuthUserContext.Consumer>
            { authUser =>
                <div>
                    <Jumbotron>
                        <h1 >Oscar Conde</h1>
                        <h5 className="blueLetters"><b> Managing Partner </b></h5>
                    </Jumbotron>

                    <Container className="topMargin">
                        <Row>
                            <Col sm={4}>
                                <ListGroup as="ul" className="">
                                    <ListGroup.Item as="li" > Abogado  </ListGroup.Item>
                                    <ListGroup.Item as="li" active className="legem-primary" > Abogado 2</ListGroup.Item>
                                    <ListGroup.Item as="li"> Abogado 3</ListGroup.Item>
                                    <ListGroup.Item as="li">Abogado 4</ListGroup.Item>
                                </ListGroup>
                            </Col>

                            {/* toda esta seccion estara oculta mientras no haya un cliente seleccionado */}
                            <Col sm={8}>
                                <Form>
                                    {/* DENOMINACION */}
                                    {/* Oscar Conde y las otras cuentas administradoras deben ir siempre hasta arriba */}
                                    {
                                        this.state.edit ?
                                            <Form.Control size="lg" type="text" placeholder="Denominación" />
                                            :
                                            <h3> NOMBRE DE ABOGADO </h3>
                                    }

                                    {/* PUESTOA */}
                                    <Form.Group as={Row} controlId="formPlaintextEmail">
                                        <Form.Label column sm="4"> Puesto </Form.Label>
                                        <Col sm="5">
                                            {
                                                this.state.edit ?
                                                    <Form.Control plaintext defaultValue=" " />
                                                    :
                                                    <Form.Control plaintext readOnly defaultValue="Associate" />
                                            }
                                        </Col>
                                    </Form.Group>

                                    {/* HORA */}
                                    <Form.Group as={Row} controlId="formPlaintextEmail">
                                        <Form.Label column sm="4"> Hora </Form.Label>
                                        <Col sm="5">
                                            {
                                                this.state.edit ?
                                                    <Form.Control plaintext placeholder="USD" defaultValue=" " />
                                                    :
                                                    <Form.Control plaintext readOnly defaultValue="00" />
                                            }
                                        </Col>
                                    </Form.Group>

                                {/* FECHA DE INGRESO */}
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="4"> Año de ingreso </Form.Label>
                                    <Col sm="5">
                                        {
                                            this.state.edit ?
                                                <Form.Control plaintext defaultValue=" " />
                                                :
                                                <Form.Control plaintext readOnly defaultValue="2003" />
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
            }
            </AuthUserContext.Consumer>
        );
    }
}

// TODO: role base rule
const condition = authUser => !!authUser;
export default withAuthorization(condition)(UsuariosPage);