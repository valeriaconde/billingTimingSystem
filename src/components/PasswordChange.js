import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';

const INITIAL_STATE = {
    email: ''
};

class passChange extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    <div>
                        <Form className="loginForm">
                            <Form.Text className="bigLetters"> Cambiar contraseña </Form.Text>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label className="formLabels">Contraseña actual</Form.Label>
                                <Form.Control type="password" size="sm" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label className="formLabels">Nueva contraseña</Form.Label>
                                <Form.Control type="password" size="sm" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label className="formLabels">Confirmar contraseña</Form.Label>
                                <Form.Control type="password" size="sm" />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="legem-primary"> Cambiar </Button>
                        </Form>
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(passChange);