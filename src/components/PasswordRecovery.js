import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';

class passRec extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    <div>

                        <Form className="loginForm">
                            <Form.Text className="bigLetters"> Recuperar contraseña </Form.Text>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label className="formLabels">Correo electrónico</Form.Label>
                                <Form.Control type="email" size="sm" placeholder="usuario@legem.mx" />
                                <Form.Text className="text-muted"> Recibirás un correo para recuperar tu contraseña. </Form.Text>
                                <Form.Control.Feedback type="invalid">Ingrese un correo válido</Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="legem-primary">Recuperar</Button>
                        </Form>
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

export default passRec;