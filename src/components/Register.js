import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

class registeruser extends Component {
    // constructor(props) {
    //     super(props);
    // }
    render() {
        return (
            <div>
                <Form className="loginForm">
                    <Form.Text className="bigLetters"> Crear usuario </Form.Text>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="formLabels">Correo electrónico</Form.Label>
                         <Form.Control type="email" size="sm" placeholder="usuario@legem.mx" />
                         <Form.Text className="text-muted">Este correo es el que usará para ingresar al sistema.</Form.Text>
                         <Form.Control.Feedback type="invalid">Ingrese un correo válido</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="formLabels">Confirmar correo</Form.Label>
                         <Form.Control type="email" size="sm" placeholder="usuario@legem.mx" />
                         <Form.Control.Feedback type="invalid">Los correos no coinciden</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" className="formLabels" label="Este usuario es administrador"/>
                          {/* creas una alert que confirme si deadevis quiere que el usuario sea administrador antes de continuar pls 
                          alert: ¿Seguro que desea hacer este usuario administrador? - El usuario tendrá acceso a todas las funciones del sistema y podrá crear y eliminar usuarios. */}
                    </Form.Group>
                    <Button variant="primary" type="submit" className="legem-primary">Registrar</Button>
                </Form>
            </div>
        );
    }
}
export default registeruser;