import React, { Component } from 'react';
import { Jumbotron, Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { compose } from 'recompose';
import * as ROLES from '../constants/roles';
import { withFirebase } from './Firebase';
import { connect } from "react-redux";
import { addAlert, getUsers } from "../redux/actions/index";
import BarLoader from "react-spinners/BarLoader";

const mapStateToProps = state => {
    return { 
        users: state.users,
        loadingUsers: state.loadingUsers
    };
};

class UsuariosPage extends Component {
    constructor(props) {
        super(props);
        this.state = { edit: false, activeIdx: -1, selectedUser: null };

        this.onClickUser = this.onClickUser.bind(this);
    }

    componentDidMount() {
        if(this.props.users.length === 0){
            this.props.getUsers();
        }
    }

    onClickUser(event) {
        this.setState({ activeIdx: event.target.value, selectedUser: this.props.users[event.target.value] });
    }

    renderUsers() {
        return (
            <ListGroup as="ul" className="">
                {this.props.users.map((user, i) => <ListGroup.Item onClick={this.onClickUser} value={i} active={this.state.activeIdx === i} key={`user-${i}`} as="li" >{user.name || user.email}</ListGroup.Item>)}
            </ListGroup>
        );
    }

    render() {
        return (
            <AuthUserContext.Consumer>
            { authUser =>
                this.props.loadingUsers ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                <div>
                    <Jumbotron>
                        <h1 >{authUser.name || authUser.email}</h1>
                        <h5 className="blueLetters"><b>{authUser.job || "Puesto desconocido"}</b></h5>
                    </Jumbotron>

                    <Container className="topMargin">
                        <Row>
                            <Col sm={4}>
                                <ListGroup as="ul" className="">
                                    {this.renderUsers()}
                                </ListGroup>
                            </Col>

                            { this.state.selectedUser === null ? <div/> :
                            <Col sm={8}>
                                <Form>
                                    {/* DENOMINACION */}
                                    {/* Oscar Conde y las otras cuentas administradoras deben ir siempre hasta arriba */}
                                    {
                                        this.state.edit ?
                                            <Form.Control size="lg" type="text" placeholder="Denominación" />
                                            :
                                            <h3>{this.state.selectedUser?.name || "NOMBRE DE ABOGADO"}</h3>
                                    }

                                    {/* PUESTOA */}
                                    <Form.Group as={Row} controlId="formPlaintextEmail">
                                        <Form.Label column sm="4"> Puesto </Form.Label>
                                        <Col sm="5">
                                            {
                                                this.state.edit ?
                                                    <Form.Control plaintext defaultValue=" " />
                                                    :
                                                    <Form.Control plaintext readOnly value={this.state.selectedUser?.job} />
                                            }
                                        </Col>
                                    </Form.Group>

                                    {/* HORA */}
                                    <Form.Group as={Row} controlId="formPlaintextEmail">
                                        <Form.Label column sm="4"> Honorarios (por hora) </Form.Label>
                                        <Col sm="5">
                                            {
                                                this.state.edit ?
                                                    <Form.Control plaintext placeholder="USD" defaultValue=" " />
                                                    :
                                                    <Form.Control plaintext readOnly value={this.state.selectedUser?.salary} />
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
                                                <Form.Control plaintext readOnly value={this.state.selectedUser?.startYear} />
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
                            }
                        </Row>
                    </Container>
                </div>
            }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => 
    authUser && !!authUser.roles[ROLES.ADMIN];

export default connect(mapStateToProps, { getUsers, addAlert })(compose(
    withAuthorization(condition),
    withFirebase,
)(UsuariosPage));