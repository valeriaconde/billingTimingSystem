import React, { Component } from 'react';
import { Navbar, Nav, Image, NavDropdown } from 'react-bootstrap';
import LoggedUser from '../stores/LoggedUser';

class Menu extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        const isLoggedIn = LoggedUser.isLoggedIn();
        return (
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
                        isLoggedIn ?
                        <NavDropdown title={LoggedUser.getEmail()} drop="left">
                            <NavDropdown.Item href="/perfil">Perfil</NavDropdown.Item>
                            <NavDropdown.Item href="/usuarios">Usuarios</NavDropdown.Item>
                            <NavDropdown.Item href="/register">Registrar usuarios</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/login" onClick={LoggedUser.logOutUser}>Cerrar Sesión</NavDropdown.Item>
                        </NavDropdown>
                        :
                        <Nav.Link href="/login">Iniciar Sesión</Nav.Link>
                    }
                </Nav>
            </Navbar>
        );
    }
}
export default Menu;