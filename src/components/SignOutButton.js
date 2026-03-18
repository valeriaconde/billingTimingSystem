import React from 'react';
import PropTypes from 'prop-types';
import { NavDropdown } from 'react-bootstrap';
import { withFirebase } from '../components/Firebase';

const SignOutButton = ({ firebase }) => (
    <NavDropdown.Item href="/login" onClick={firebase.doSignOut}>Log out</NavDropdown.Item>
);

SignOutButton.propTypes = {
    firebase: PropTypes.object
};

export default withFirebase(SignOutButton);