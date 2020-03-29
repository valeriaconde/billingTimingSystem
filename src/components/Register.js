import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { withFirebase } from './Firebase';
import { AuthUserContext, withAuthorization } from './Auth';

const INITIAL_STATE = {
    email: '',
    email2: '',
    isAdmin: false,
    validated: false,
    error: null
};

class registeruser extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        this.setState({validated: true});
        const form = event.currentTarget;
        if (!form.checkValidity() || this.state.email !== this.state.email2) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.props.firebase
            .doCreateUserWithEmailAndPassword(this.state.email, this.state.email)
            .then(authUser => {
                    this.setState({ ...INITIAL_STATE });
                })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    }

    onChange(event) {
        this.setState({ [event.target.name]: (event.target.type === "checkbox" ? event.target.checked : event.target.value) });
    }

    render() {
        const {
            email,
            email2,
            isAdmin,
            error
        } = this.state;

        return (
            <AuthUserContext.Consumer>
            { authUser =>
                <div>
                    <Form noValidate validated={this.state.validated} className="loginForm" onSubmit={this.handleSubmit}>
                        <Form.Text className="bigLetters"> Crear usuario </Form.Text>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="formLabels">Correo electrónico</Form.Label>
                            <Form.Control onChange={this.onChange} name="email" value={email} type="email" size="sm" placeholder="usuario@legem.mx" />
                            <Form.Text className="text-muted">Este correo es el que usará para ingresar al sistema.</Form.Text>
                            <Form.Control.Feedback type="invalid">Ingrese un correo válido</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="formLabels">Confirmar correo</Form.Label>
                            <Form.Control onChange={this.onChange} name="email2" value={email2} type="email" size="sm" placeholder="usuario@legem.mx" />
                            <Form.Control.Feedback type="invalid">Los correos no coinciden</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check onChange={this.onChange} name="isAdmin" checked={isAdmin} type="checkbox" className="formLabels" label="Este usuario es administrador"/>
                            {/* creas una alert que confirme si deadevis quiere que el usuario sea administrador antes de continuar pls 
                            alert: ¿Seguro que desea hacer este usuario administrador? - El usuario tendrá acceso a todas las funciones del sistema y podrá crear y eliminar usuarios. */}
                        </Form.Group>
                        <Button variant="primary" type="submit" className="legem-primary">Registrar</Button>

                        {error && <p>{error.message}</p>}
                    </Form>
                </div>
            }
            </AuthUserContext.Consumer>
        );
    }
}

// TODO: role base rule
const condition = authUser => !!authUser;
export default withAuthorization(condition)(withFirebase(registeruser));