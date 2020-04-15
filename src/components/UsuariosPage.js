import React, { Component } from 'react';
import { Jumbotron, Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { compose } from 'recompose';
import * as ROLES from '../constants/roles';
import { withFirebase } from './Firebase';
import { connect } from "react-redux";
import { addAlert, getUsers, clearAlert, updateUser } from "../redux/actions/index";
import BarLoader from "react-spinners/BarLoader";
import { AlertType } from '../stores/AlertStore';

const mapStateToProps = state => {
    return { 
        users: state.users,
        loadingUsers: state.loadingUsers
    };
};

const INITIAL_STATE = {
    edit: false,
    activeIdx: -1,
    job: '',
    salary: '',
    startYear: '',
    name: ''
};

class UsuariosPage extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.onClickUser = this.onClickUser.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        if(this.props.users.length === 0){
            this.props.getUsers();
        }
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onEdit() {
        this.setState({ edit: true });
    }

    onSave(event) {
        const { startYear, job, salary, name, uid, activeIdx } = this.state;
        if(isNaN(startYear) || startYear.length === 0) {
            let alert = { type: AlertType.Error, message: "Start year must be a number" };
            this.props.addAlert(alert);
            setTimeout(() => this.props.clearAlert(alert), 7000);
            return;
        }

        if(isNaN(salary) || salary.length === 0) {
            let alert = { type: AlertType.Error, message: "Salary must be a number" };
            this.props.addAlert(alert);
            setTimeout(() => this.props.clearAlert(alert), 7000);
            return;
        }

        if(job.length === 0) {
            let alert = { type: AlertType.Error, message: "Role cannot be empty" };
            this.props.addAlert(alert);
            setTimeout(() => this.props.clearAlert(alert), 7000);
            return;
        }

        const payload = {
            name: name,
            job: job,
            salary: salary,
            startYear: startYear,
            email: this.props.users[activeIdx].email,
            roles: this.props.users[activeIdx].roles
        };
        this.props.updateUser(uid, payload);

        this.setState({ edit: false });
    }

    onClickUser(event) {
        const activeIdx = event.target.value;
        this.setState({ activeIdx: activeIdx, edit: false, 
            uid: this.props.users[activeIdx].uid,
            job: this.props.users[activeIdx].job,
            startYear: this.props.users[activeIdx].startYear, 
            salary: this.props.users[activeIdx].salary,
            name: this.props.users[activeIdx].name || this.props.users[activeIdx].email });
    }

    renderUsers() {
        return (
            <ListGroup as="ul" className="">
                {this.props.users.map((user, i) => <ListGroup.Item onClick={this.onClickUser} value={i} active={this.state.activeIdx === i} key={`user-${i}`} as="li" >{user.name || user.email}</ListGroup.Item>)}
            </ListGroup>
        );
    }

    render() {
        const { startYear, job, salary, name } = this.state;
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

                            { this.state.activeIdx === -1 ? <div/> :
                            <Col sm={8}>
                                <Form onSubmit={this.onSave}>
                                    {/* DENOMINACION */}
                                    {
                                        this.state.edit ?
                                            <Form.Control onChange={this.onChange} name="name" size="lg" type="text" value={name || "NOMBRE DE ABOGADO"} />
                                            :
                                            <h3>{name || "NOMBRE DE ABOGADO"}</h3>
                                    }

                                    {/* PUESTOA */}
                                    <Form.Group as={Row} controlId="formPlaintextEmail">
                                        <Form.Label column sm="4"> Puesto </Form.Label>
                                        <Col sm="5">
                                            <Form.Control onChange={this.onChange} name="job" plaintext readOnly={!this.state.edit} value={job} />
                                        </Col>
                                    </Form.Group>

                                    {/* HORA */}
                                    <Form.Group as={Row} controlId="formPlaintextEmail">
                                        <Form.Label column sm="4"> Honorarios (por hora) </Form.Label>
                                        <Col sm="5">
                                            <Form.Control onChange={this.onChange} name="salary" plaintext readOnly={!this.state.edit} value={salary} />
                                        </Col>
                                    </Form.Group>

                                    {/* FECHA DE INGRESO */}
                                    <Form.Group as={Row} controlId="formPlaintextEmail">
                                        <Form.Label column sm="4"> Año de ingreso </Form.Label>
                                        <Col sm="5">
                                            <Form.Control onChange={this.onChange} name="startYear" plaintext readOnly={!this.state.edit} value={startYear} />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="formPlaintextEmail">
                                        <Form.Label column sm="5"></Form.Label>
                                        <Col sm="5">
                                            <>
                                            {
                                                this.state.edit ? <Button onClick={this.onSave}>Guardar</Button>
                                                : <Button onClick={this.onEdit} variant="outline-dark">Editar</Button>
                                            }
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

export default connect(mapStateToProps, { getUsers, addAlert, clearAlert, updateUser })(compose(
    withAuthorization(condition),
    withFirebase,
)(UsuariosPage));