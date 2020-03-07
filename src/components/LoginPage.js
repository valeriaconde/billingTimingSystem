import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';

class LoginPage extends Component {
    // constructor(props) {
    //     super(props);
    // }
    render() {
        return (
            <div>
                <Form className="loginForm">
                    <Form.Text className="bigLetters"> Iniciar Sesión </Form.Text>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="formLabels">Correo electrónico</Form.Label>
                        <Form.Control type="email" size="sm" placeholder="usuario@legem.mx"/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="formLabels">Contraseña</Form.Label>
                        <Form.Control type="password" size="sm"/>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="btn-primary" >Ingresar</Button>
                </Form>
            </div>
        );
    }
}
export default LoginPage;