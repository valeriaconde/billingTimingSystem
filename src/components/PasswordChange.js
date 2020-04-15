import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { AlertType } from '../stores/AlertStore';
import { connect } from "react-redux";
import { addAlert, clearAlert } from "../redux/actions/index";

const mapStateToProps = state => {
    return { alerts: state.alerts };
};

function mapDispatchToProps(dispatch) {
    return {
        clearAlert: alert => dispatch(clearAlert(alert)),
        addAlert: alert => dispatch(addAlert(alert))
    };
}

const INITIAL_STATE = {
    password: '',
    password2: '',
    validated: false,
    error: null
};

class PassChange extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit = event => {
        event.preventDefault();
        this.setState({ validated: true });
        const { password, password2 } = this.state;

        if(password !== password2) {
            let alert = { type: AlertType.Error, message: "Passwords don't match" };
            this.props.addAlert(alert);
            setTimeout(() => this.props.clearAlert(alert), 7000);

            event.stopPropagation();
            return;
        }

        const form = event.currentTarget;
        if (!form.checkValidity()) {
            event.stopPropagation();
            return;
        }

        this.props.firebase
            .doPasswordUpdate(password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });

                let alert = { type: AlertType.Success, message: "Password changed successfully" };
                this.props.addAlert(alert);
                setTimeout(() => this.props.clearAlert(alert), 7000);

                this.props.history.push('/home');
            })
            .catch(error => {
                let alert = { type: AlertType.Error, message: error.message };
                this.props.addAlert(alert);
                setTimeout(() => this.props.clearAlert(alert), 7000);

                this.setState({ error });
            });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    <div>
                        <Form noValidate validated={this.state.validated} className="loginForm" onSubmit={this.onSubmit}>
                            <Form.Text className="bigLetters"> Actualizar contraseña </Form.Text>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label className="formLabels">Nueva contraseña</Form.Label>
                                <Form.Control onChange={this.onChange} value={this.state.password} name="password" type="password" size="sm" required />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label className="formLabels">Confirmar contraseña</Form.Label>
                                <Form.Control onChange={this.onChange} value={this.state.password2} name="password2" type="password" size="sm" required />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="legem-primary"> Actualizar </Button>
                        </Form>
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default connect(mapStateToProps, mapDispatchToProps)(withAuthorization(condition)(PassChange));