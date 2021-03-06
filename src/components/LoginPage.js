import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { withFirebase } from './Firebase';
import { AlertType } from '../stores/AlertStore';
import { connect } from "react-redux";
import { addAlert, clearAlert } from "../redux/actions/index";

const mapStateToProps = state => {
    return { alerts: state.alerts };
};

const INITIAL_STATE = {
    email: '',
    password: '',
    validated: false,
    error: null
};

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { email, password } = this.state;
        this.setState({ validated: true });
        const form = event.currentTarget;
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => { // log in success
                this.props.history.push('/home');
            })
            .catch(error => {
                this.props.addAlert(AlertType.Error, error.message);
                this.setState({ error, password: '', email: '' });
            });

        event.preventDefault();
    }

    render() {
        const { email, password } = this.state;
        return (
            <div>
                <Form noValidate validated={this.state.validated} className="loginForm" onSubmit={this.handleSubmit}>
                    <Form.Text className="bigLetters"> Login </Form.Text>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="formLabels">Email</Form.Label>
                        <Form.Control name="email" type="email" size="sm" placeholder="usuario@legem.mx" value={email} onChange={this.onChange} required />
                        <Form.Control.Feedback type="invalid">Invalid email </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="formLabels">Password</Form.Label>
                        <Form.Control name="password" type="password" size="sm" value={password} onChange={this.onChange} required />
                        <Form.Control.Feedback type="invalid" >Invalid password</Form.Control.Feedback>
                        <Form.Text><a href="/password-recovery" className="text-muted" > I forgot my password</a></Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="legem-primary" >Login</Button>
                </Form>
            </div>
        );
    }
}
export default connect(mapStateToProps, { clearAlert, addAlert })(withFirebase(LoginPage));