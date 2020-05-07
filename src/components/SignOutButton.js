import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { withFirebase } from '../components/Firebase';

const SignOutButton = ({ firebase }) => (
    <NavDropdown.Item href="/login" onClick={firebase.doSignOut}>Log out</NavDropdown.Item>
);

export default withFirebase(SignOutButton);