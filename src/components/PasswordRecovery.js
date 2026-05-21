import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import { AlertType } from '../stores/AlertStore';
import { withFirebase } from './Firebase';
import { connect } from "react-redux";
import { addAlert, clearAlert } from "../redux/actions/index";
import { trimString } from '../utils/inputUtils';

const mapStateToProps = state => {
    return { alerts: state.alerts };
};

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
        this.setState({ [event.target.name]: trimString(event.target.value) });
    }

    onSubmit(event) {
        this.setState({ validated: true });
        event.preventDefault();
        const { email } = this.state;
        const trimmedEmail = trimString(email);
        const form = event.currentTarget;

        if (trimmedEmail.length === 0 || !form.checkValidity()) {
            event.stopPropagation();
            return;
        }

        this.props.firebase
            .doPasswordReset(trimmedEmail)
            .then(() => {
                this.setState({ ...INITIAL_STATE });

                this.props.addAlert(AlertType.Success, "Check your email, we've sent you a recovery link.");

                this.props.history.push('/login');
            })
            .catch(error => {
                this.setState({ error });
                
                this.props.addAlert(AlertType.Error, error.message);
            });
        
    }

    render() {
        const { email } = this.state;

        return (
            <div>
                <Form noValidate className="loginForm" onSubmit={this.onSubmit}>
                    <Form.Text className="bigLetters"> Recover password </Form.Text>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="formLabels">Email</Form.Label>
                        <Form.Control isInvalid={this.state.validated && trimString(email).length === 0} name="email" value={email} onChange={this.onChange} type="email" size="sm" placeholder="usuario@legem.mx" required />
                        <Form.Text className="text-muted"> You will receive an email to recover your password. </Form.Text>
                        <Form.Control.Feedback type="invalid">Email cannot be empty.</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="legem-primary">Recover</Button>
                </Form>
            </div>
        );
    }
}

Passrec.propTypes = {
    firebase: PropTypes.object,
    history: PropTypes.object,
    addAlert: PropTypes.func
};

export default connect(mapStateToProps, { clearAlert, addAlert })(withFirebase(Passrec));
