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
                            <Nav.Link href="/home">Clients</Nav.Link>
                            <Nav.Link href="/expenses">Expenses</Nav.Link>
                            <Nav.Link href="/timing">Timing</Nav.Link>
                            <Nav.Link href="/projects" hidden={!authUser?.roles[ROLES.ADMIN]}>Projects</Nav.Link>
                            <Nav.Link href="/reports" hidden={!authUser?.roles[ROLES.ADMIN]}>Reports</Nav.Link>
                        </Nav>
                        <Nav className="justify-content-end">
                            {
                                authUser ?
                                <NavDropdown title={authUser.email} drop="left">
                                    <NavDropdown.Item href="/users" hidden={!authUser.roles[ROLES.ADMIN]}>Users</NavDropdown.Item>
                                    <NavDropdown.Item href="/users/register" hidden={!authUser.roles[ROLES.ADMIN]}>New user</NavDropdown.Item>
                                    <NavDropdown.Item href="/password/update"> Change password </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <SignOutButton />
                                </NavDropdown>
                                :
                                <Nav.Link href="/login">Log in</Nav.Link>
                            }
                        </Nav>
                    </Navbar>
                }
            </AuthUserContext.Consumer>
        );
    }
}

export default Menu;