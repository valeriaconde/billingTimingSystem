import React, { Component } from 'react';
import { Navbar, Nav, Image, NavDropdown } from 'react-bootstrap';
import SignOutButton from './SignOutButton';
import { AuthUserContext } from './Auth';
import * as ROLES from '../constants/roles';

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
                            <Nav.Link href="/gastos">Gastos</Nav.Link>
                            <Nav.Link href="/tiempos">Tiempos</Nav.Link>
                            <Nav.Link href="/proyectos" hidden={!authUser?.roles[ROLES.ADMIN]}>Proyectos</Nav.Link>
                            <Nav.Link href="/reportes" hidden={!authUser?.roles[ROLES.ADMIN]}>Reportes</Nav.Link>
                            <Nav.Link href="/facturas" hidden={!authUser?.roles[ROLES.ADMIN]}>Facturas</Nav.Link>
                        </Nav>
                        <Nav className="justify-content-end">
                            {
                                authUser ?
                                <NavDropdown title={authUser.email} drop="left">
                                    <NavDropdown.Item href="/usuarios" hidden={!authUser.roles[ROLES.ADMIN]}>Usuarios</NavDropdown.Item>
                                    <NavDropdown.Item href="/register" hidden={!authUser.roles[ROLES.ADMIN]}>Registrar usuarios</NavDropdown.Item>
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