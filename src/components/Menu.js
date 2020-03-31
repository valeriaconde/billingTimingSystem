import React, { Component } from 'react';
import { Navbar, Nav, Image, NavDropdown } from 'react-bootstrap';
import SignOutButton from './SignOutButton';
import { AuthUserContext } from './Auth';

class Menu extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <Navbar bg="light" variant="light">
                        <Navbar.Brand href="/home"><Image src="/logo.png" height={"35"} /></Navbar.Brand>
                        <Nav className="mr-auto">
                            <Nav.Link href="/home">Clientes</Nav.Link>
                            <Nav.Link href="/proyectos">Proyectos</Nav.Link>
                            <Nav.Link href="/gastos">Gastos</Nav.Link>
                            <Nav.Link href="/tiempos">Tiempos</Nav.Link>
                            <Nav.Link href="/reportes">Reportes</Nav.Link>
                            <Nav.Link href="/facturas">Facturas</Nav.Link>
                        </Nav>
                        <Nav className="justify-content-end">
                            {
                                authUser ?
                                <NavDropdown title={authUser.email} drop="left">
                                    <NavDropdown.Item href="/usuarios">Usuarios</NavDropdown.Item>
                                    <NavDropdown.Item href="/register">Registrar usuarios</NavDropdown.Item>
                                    <NavDropdown.Item href="/password-change"> Cambiar contraseña </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <SignOutButton />
                                </NavDropdown>
                                :
                                <Nav.Link href="/login">Iniciar Sesión</Nav.Link>
                            }
                        </Nav>
                    </Navbar>
                }
            </AuthUserContext.Consumer>
        );
    }
}
export default Menu;