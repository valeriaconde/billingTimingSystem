import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';

class detailedProject extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    <div>
                        <h1 className="blueLetters topMargin leftMargin">Proyecto X ejemplo contrato de trabajo o si </h1>
                        
                        

                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(detailedProject);