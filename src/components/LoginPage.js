import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import LoggedUser from '../stores/LoggedUser';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '', validated: false };

        this.changeEmail = this.changeEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    // If last user was cached, fill the form
    componentDidMount() {
        this.setState({ email: LoggedUser.getEmail() || '' });
    }

    changeEmail(event) {
        if (event && event.target.value != null) {
            this.setState({ email: event.target.value });
        }
    }

    changePassword(event) {
        if (event && event.target.value != null) {
            this.setState({ password: event.target.value });
        }
    }

    handleSubmit(event) {
        this.setState({validated: true});
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        // TODO: This will be handled by database later
        var loginSuccess = true;
        if (loginSuccess) {
            LoggedUser.setEmail(this.state.email);
            this.props.history.push(this.state.from || '/home');
            window.location.reload();
        }
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <Form noValidate validated={this.state.validated} className="loginForm" onSubmit={this.handleSubmit}>
                    <Form.Text className="bigLetters"> Iniciar Sesión </Form.Text>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="formLabels">Correo electrónico</Form.Label>
                        <Form.Control type="email" size="sm" placeholder="usuario@legem.mx" value={this.state.email} onChange={this.changeEmail} required />
                        <Form.Control.Feedback type="invalid">Ingrese un email válido</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="formLabels">Contraseña</Form.Label>
                        <Form.Control type="password" size="sm" value={this.state.password} onChange={this.changePassword} required />
                        <Form.Control.Feedback type="invalid">Ingrese su contraseña</Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="legem-primary" >Ingresar</Button>
                </Form>
            </div>
        );
    }
}
export default LoginPage;