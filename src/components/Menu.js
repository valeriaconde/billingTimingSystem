import React, { Component } from 'react';
import {Navbar, Nav, Image} from 'react-bootstrap';

class Menu extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <Navbar bg="light" variant="light">
                <Navbar.Brand href="#home"><Image src="/logo.png" height={"35"} /></Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Clientes</Nav.Link>
                    <Nav.Link href="#clientes">Usuarios</Nav.Link>
                    <Nav.Link href="#reportes">Proyectos</Nav.Link>
                    <Nav.Link href="#reportes">Gastos</Nav.Link>
                    <Nav.Link href="#reportes">Tiempos</Nav.Link>
                    <Nav.Link href="#reportes">Reportes</Nav.Link>
                    <Nav.Link href="#reportes">Facturas</Nav.Link>
                </Nav>
            </Navbar>
        );
    }
}
export default Menu;