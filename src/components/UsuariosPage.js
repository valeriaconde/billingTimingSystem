import React, { Component } from 'react';
import { Jumbotron, Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { compose } from 'recompose';
import * as ROLES from '../constants/roles';
import { withFirebase } from './Firebase';
import { connect } from "react-redux";
import { addAlert, getUsers, clearAlert, updateUser, deleteUser } from "../redux/actions/index";
import BarLoader from "react-spinners/BarLoader";
import { AlertType } from '../stores/AlertStore';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

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
    name: '',
    initials: ''
};

class UsuariosPage extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.onClickUser = this.onClickUser.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
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

    onDelete(event) {
        if(window.confirm('¿Seguro que desea borrar al usuario?')) {
            this.props.deleteUser(this.props.users[this.state.activeIdx].uid);
            this.setState({ activeIdx: -1, edit: false });
        }
    }

    onSave(event) {
        const { startYear, job, salary, name, uid, activeIdx, initials } = this.state;
        if(isNaN(startYear) || startYear.length === 0) {
            this.props.addAlert(AlertType.Error, "Start year must be a number.");
            return;
        }

        if(isNaN(salary) || salary.length === 0) {
            this.props.addAlert(AlertType.Error, "Salary must be a number.");
            return;
        }

        if(job.length === 0) {
            this.props.addAlert(AlertType.Error, "Role cannot be empty.");
            return;
        }

        const payload = {
            name: name,
            job: job,
            salary: salary,
            startYear: startYear,
            email: this.props.users[activeIdx].email,
            roles: this.props.users[activeIdx].roles,
            initials: initials
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
            name: this.props.users[activeIdx].name || this.props.users[activeIdx].email,
            initials: this.props.users[activeIdx].initials || "AAA"
        });
    }

    renderUsers() {
        return (
            <ListGroup as="ul" className="">
                {this.props.users.map((user, i) => <ListGroup.Item onClick={this.onClickUser} value={i} active={this.state.activeIdx === i} key={`user-${i}`} as="li" >{user.name || user.email}</ListGroup.Item>)}
            </ListGroup>
        );
    }

    render() {
        const { startYear, job, salary, name, initials } = this.state;
        return (
            <AuthUserContext.Consumer>
            { authUser =>
                this.props.loadingUsers ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                <div>
                    <Jumbotron>
                        <h1 >{authUser.name || authUser.email}</h1>
                        <h5 className="blueLetters"><b>{authUser.job || "Unknown position"}</b></h5>
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
                                            <h3>{name || "Name"}</h3>
                                    }

                                    {/* PUESTO */}
                                    <Form.Group as={Row} controlId="formPlaintext">
                                        <Form.Label column sm="4"> Position </Form.Label>
                                        <Col sm="5">
                                            <Form.Control onChange={this.onChange} name="job" plaintext readOnly={!this.state.edit} value={job} />
                                        </Col>
                                    </Form.Group>

                                    {/* HORA */}
                                    <Form.Group as={Row} controlId="formPlaintext">
                                        <Form.Label column sm="4"> Hourly fee </Form.Label>
                                        <Col sm="5">
                                            <Form.Control onChange={this.onChange} name="salary" plaintext readOnly={!this.state.edit} value={salary} />
                                        </Col>
                                    </Form.Group>

                                    {/* FECHA DE INGRESO */}
                                    <Form.Group as={Row} controlId="formPlaintext">
                                        <Form.Label column sm="4"> Start year </Form.Label>
                                        <Col sm="5">
                                            <Form.Control onChange={this.onChange} name="startYear" plaintext readOnly={!this.state.edit} value={startYear} />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="formPlaintext">
                                        <Form.Label column sm="4"> Initials </Form.Label>
                                        <Col sm="5">
                                            <Form.Control onChange={this.onChange} name="initials" plaintext readOnly={!this.state.edit} value={initials} />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} controlId="formPlaintext">
                                        <Form.Label column sm="5"></Form.Label>
                                        <Col sm="5">
                                            <>
                                            {
                                                this.state.edit ? 
                                                <div>
                                                    <IconButton onClick={this.onDelete} color="secondary" aria-label="delete">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <Button onClick={this.onSave}>Save</Button>
                                                </div>
                                                : <Button onClick={this.onEdit} variant="outline-dark">Edit</Button>
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

export default connect(mapStateToProps, { 
    getUsers, 
    addAlert, 
    clearAlert, 
    updateUser,
    deleteUser
 })(compose(
    withAuthorization(condition),
    withFirebase,
)(UsuariosPage));