import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AlertType } from '../stores/AlertStore';
import { withFirebase } from './Firebase';
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
    email: '',
    error: null,
    validated: false
};

class Passrec extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    };

    onSubmit(event) {
        this.setState({ validated: true });
        event.preventDefault();
        const { email } = this.state;

        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });

                let alert = { type: AlertType.Success, message: "Check your email, we've sent you a recovery link." };
                this.props.addAlert(alert);
                setTimeout(() => this.props.clearAlert(alert), 7000);

                this.props.history.push('/login');
            })
            .catch(error => {
                this.setState({ error });
                
                let alert = { type: AlertType.Error, message: error.message };
                this.props.addAlert(alert);
                setTimeout(() => this.props.clearAlert(alert), 7000);
            });
        
    }

    render() {
        return (
            <div>
                <Form noValidate validated={this.state.validated} className="loginForm" onSubmit={this.onSubmit}>
                    <Form.Text className="bigLetters"> Recuperar contraseña </Form.Text>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="formLabels">Correo electrónico</Form.Label>
                        <Form.Control name="email" onChange={this.onChange} type="email" size="sm" placeholder="usuario@legem.mx" />
                        <Form.Text className="text-muted"> Recibirás un correo para recuperar tu contraseña. </Form.Text>
                        <Form.Control.Feedback type="invalid">Ingrese un correo válido</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="legem-primary">Recuperar</Button>
                </Form>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(Passrec));