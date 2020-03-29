import React, { Component } from 'react';
import {  } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';

class template extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <AuthUserContext.Consumer>
            {authUser =>
                <div>

                </div>
            }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(template);