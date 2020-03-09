import React, { Component } from 'react';

class register extends Component {
    constructor(props) {
        super(props);
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
                    <Button variant="primary" type="submit" className="btn-primary" >Ingresar</Button>
                </Form>
            </div>
        );
    }
}
export default register;