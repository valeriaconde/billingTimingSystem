import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import LoggedUser from '../stores/LoggedUser';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};

        this.changeEmail = this.changeEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    changeEmail(event) {
        if(event && event.target.value != null) {
            this.setState({email: event.target.value});
        }
    }

    changePassword(event) {
        if(event && event.target.value != null) {
            this.setState({password: event.target.value});
        }
    }

    handleSubmit(event) {
        // aqui se llama funcion para login
        var loginSuccess = true;
        if(loginSuccess) {
            LoggedUser.setEmail(this.state.email);
        }
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <Form className="loginForm" onSubmit={this.handleSubmit}>
                    <Form.Text className="bigLetters"> Iniciar Sesión </Form.Text>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="formLabels">Correo electrónico</Form.Label>
                        <Form.Control type="email" size="sm" placeholder="usuario@legem.mx" value={this.state.email} onChange={this.changeEmail} />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="formLabels">Contraseña</Form.Label>
                        <Form.Control type="password" size="sm" value={this.state.password} onChange={this.changePassword}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="btn-primary" >Ingresar</Button>
                </Form>
            </div>
        );
    }
}
export default LoginPage;