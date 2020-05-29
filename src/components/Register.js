import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { withFirebase } from './Firebase';
import { AuthUserContext, withAuthorization } from './Auth';
import * as ROLES from '../constants/roles';
import { AlertType } from '../stores/AlertStore';
import { compose } from 'recompose';
import { connect } from "react-redux";
import { addAlert, clearAlert } from "../redux/actions/index";

const mapStateToProps = state => {
    return { alerts: state.alerts };
};

const INITIAL_STATE = {
    email: '',
    email2: '',
    isAdmin: false,
    validated: false,
    error: null
};

class Registeruser extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ validated: true });
        const { email, email2, isAdmin } = this.state;
        const form = event.currentTarget;

        if(email !== email2) {
            this.props.addAlert(AlertType.Error, 'Emails do not match');
            return;
        }

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        const roles = {};
        if(isAdmin) {
            if(window.confirm('¿Seguro que desea hacer este usuario administrador? - El usuario tendrá acceso a todas las funciones del sistema y podrá crear y eliminar usuarios.')) roles[ROLES.ADMIN] = ROLES.ADMIN;
            else return;
        }

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, email, roles);


        this.props.addAlert(AlertType.Success, `${email} successfully registered`);

        this.setState(INITIAL_STATE);
    }

    onChange(event) {
        this.setState({ [event.target.name]: (event.target.type === "checkbox" ? event.target.checked : event.target.value) });
    }

    render() {
        const {
            email,
            email2,
            isAdmin,
            error
        } = this.state;

        return (
            <AuthUserContext.Consumer>
            { authUser =>
                <div>
                    <Form noValidate validated={this.state.validated} className="loginForm" onSubmit={this.handleSubmit}>
                        <Form.Text className="bigLetters"> New user </Form.Text>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="formLabels">Email</Form.Label>
                            <Form.Control onChange={this.onChange} name="email" value={email} type="email" size="sm" placeholder="user@legem.mx" />
                            <Form.Text className="text-muted">This is the email they will use to login to the system.</Form.Text>
                            <Form.Control.Feedback type="invalid">Invalid email</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="formLabels">Confirm email</Form.Label>
                            <Form.Control onChange={this.onChange} name="email2" value={email2} type="email" size="sm" placeholder="user@legem.mx" />
                            <Form.Control.Feedback type="invalid">Emails do not match.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check onChange={this.onChange} name="isAdmin" checked={isAdmin} type="checkbox" className="formLabels" label="Make this user admin"/>
                            {/* creas una alert que confirme si deadevis quiere que el usuario sea administrador antes de continuar pls 
                            alert: ¿Seguro que desea hacer este usuario administrador? - El usuario tendrá acceso a todas las funciones del sistema y podrá crear y eliminar usuarios. */}
                        </Form.Group>
                        <Button variant="primary" type="submit" className="legem-primary">Create</Button>

                        {error && <p>{error.message}</p>}
                    </Form>
                </div>
            }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => 
    authUser && !!authUser.roles[ROLES.ADMIN];

export default connect(mapStateToProps, { clearAlert, addAlert })(compose(
    withAuthorization(condition),
    withFirebase,
)(Registeruser));