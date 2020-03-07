import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';

class LoginPage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Form className="loginForm">
                    <Form.Text className="bigLetters"> Legem Attorneys at Law </Form.Text>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control type="email"/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password"/>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="btn-primary">Ingresar</Button>
                </Form>
            </div>
        );
    }
}
export default LoginPage;