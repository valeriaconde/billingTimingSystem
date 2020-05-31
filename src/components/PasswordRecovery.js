import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AlertType } from '../stores/AlertStore';
import { withFirebase } from './Firebase';
import { connect } from "react-redux";
import { addAlert, clearAlert } from "../redux/actions/index";

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

                this.props.addAlert(AlertType.Success, "Check your email, we've sent you a recovery link.");

                this.props.history.push('/login');
            })
            .catch(error => {
                this.setState({ error });
                
                this.props.addAlert(AlertType.Error, error.message);
            });
        
    }

    render() {
        return (
            <div>
                <Form noValidate validated={this.state.validated} className="loginForm" onSubmit={this.onSubmit}>
                    <Form.Text className="bigLetters"> Recover password </Form.Text>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="formLabels">Email</Form.Label>
                        <Form.Control name="email" onChange={this.onChange} type="email" size="sm" placeholder="usuario@legem.mx" />
                        <Form.Text className="text-muted"> You will receive an email to recover your password. </Form.Text>
                        <Form.Control.Feedback type="invalid">Invalid email</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="legem-primary">Recover</Button>
                </Form>
            </div>
        );
    }
}

export default connect(mapStateToProps, { clearAlert, addAlert })(withFirebase(Passrec));