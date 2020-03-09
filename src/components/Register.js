import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

class registeruser extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Form className="loginForm">
                    <Form.Text className="bigLetters"> Crear usuario </Form.Text>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="formLabels">Correo electrónico</Form.Label>
                         <Form.Control type="email" size="sm" placeholder="usuario@legem.mx" />
                         <Form.Text className="text-muted">Este correo es el que usará para ingresar al sistema.</Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="formLabels">Contraseña</Form.Label>
                        <Form.Control type="password" size="sm" />
                        <Form.Text className="text-muted">Esta contraseña es temporal y deberá cambiarse dentro de 24 horas.</Form.Text>
                        /* es mame lo de las 24 hrs no sabia que ponerle, no pasa nada si no la cambian en ese tiempo xd */
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Este usuario es administrador"/>
                        
                        /*  creas una alert que confirme si deadevis quiere que el usuario sea administrador antes de continuar pls */
                        /* alert: ¿Seguro que desea hacer este usuario administrador? - El usuario tendrá acceso a todas las funciones del sistema y podrá crear y eliminar usuarios. */
                    </Form.Group>
                       </Form.Group>
                    <Button variant="primary" type="submit" className="btn-primary">Registrar</Button>
                </Form>
            </div>
        );
    }
}
export default registeruser;