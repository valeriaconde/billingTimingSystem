import React, { Component } from 'react';
import { observer } from "mobx-react"
import { Navbar, Nav, Image, NavDropdown, Alert } from 'react-bootstrap';
import SignOutButton from './SignOutButton';
import { AuthUserContext } from './Auth';
import AlertStore, { AlertType } from '../stores/AlertStore';

@observer
class Menu extends Component {
    // constructor(props) {
    //     super(props);
    // }

    getAlertColor(type) {
        switch (type) {
            case AlertType.Error: return "danger";
            case AlertType.Info: return "info";
            case AlertType.Success: return "success";
            case AlertType.Warning: return "warning";

            default: return "primary";
        }
    }

    renderAlerts() {
        return (
            <>
            {AlertStore.alerts.map((alert, i) => <Alert key={`alert-${i}`} style={{ width: "100%" }} toggle={() => AlertStore.clear(alert)} color={this.getAlertColor(alert.type)}>{AlertType[alert.type].toUpperCase()}: {alert.message}</Alert>)}
            </>
        );
    }

    render() {
        return (
            <AuthUserContext.Consumer>
                {
                    authUser =>
                    <div>
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
                                    <NavDropdown.Divider />
                                    <SignOutButton />
                                </NavDropdown>
                                :
                                <Nav.Link href="/login">Iniciar Sesión</Nav.Link>
                            }
                        </Nav>
                    </Navbar>
                    { AlertStore.hasAlert &&
                        <div style={{ marginBottom: "20px", width: "100%" }}>
                            {this.renderAlerts()}
                        </div>
                    }
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

export default Menu;