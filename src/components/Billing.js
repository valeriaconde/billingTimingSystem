import React, { Component } from 'react';
import Select from 'react-select';
import { Form, Row, Col, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';

class billing extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    <div>
                        <h4 className="blueLetters topMargin leftMargin"> New notice </h4>

                        {/* CHOOSE CLIENT */}
                        <Form className="leftMargin topMargin">
                            <Form.Group as={Row}>
                                <Form.Label column sm="3"> Client </Form.Label>
                                <Col sm="7">
                                    <Select />
                                </Col>
                            </Form.Group>

                            {/* CHOOSE PROJECTS */}
                            <Form.Group as={Row}>
                                <Form.Label column sm="3"> Projects: </Form.Label>
                            </Form.Group>

                            <Form.Group className="leftMargin">
                                <div key="checbox" className="mb-3">
                                    <Form.Check type="checkbox" id="checkbox" label="checkbox" />
                                </div>
                            </Form.Group>


                            {/* CHOOSE LANGUAGE OF NOTICE */}
                            <Form.Group as={Row} className="topMargin">
                                <Form.Label column sm="3"> Language of notice </Form.Label>
                                <Col sm="7">
                                    <ButtonToolbar className="justify-content-between ">
                                        <ButtonGroup toggle>
                                            <Button variant="light">EN</Button>
                                            <Button variant="light">ES</Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                </Col>
                            </Form.Group>

                            <Button className="legem-primary" type="submit"> Generate charge notice </Button>
                            <Button className="legem-primary" type="submit"> Download </Button>

                        </Form>


                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(billing);