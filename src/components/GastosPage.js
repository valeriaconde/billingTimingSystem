import React, { Component } from 'react';
import Select from 'react-select';
import { Button, Modal, Form, Row, Col, Accordion, Card, Container, Jumbotron } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { addAlert, clearAlert, getClients, getUsers, addProject, getProjectByClient, addExpense } from "../redux/actions/index";
import BarLoader from "react-spinners/BarLoader";
import { connect } from "react-redux";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { expenseClasses } from "../constants/enums";

const mapStateToProps = state => {
    return { 
        alerts: state.alerts,
        clients: state.clients,
        loadingClients: state.loadingClients,
        users: state.users,
        projects: state.projects,
        loadingUsers: state.loadingUsers,
        loadingProjects: state.loadingProjects
     };
};

const INITIAL_STATE = {
    showModal: false,
    selectedOption: null,
    selectedClientModal: null,
    validated: false,
    selectedDate: new Date(),
    selectedProjectModal: null,
    selectedExpenseModal: null,
    expenseTitle: '',
    expenseTotal: 0
};

class gastos extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    componentDidMount() {
        if(this.props.clients.length === 0) {
            this.props.getClients();
        }
    }

    isFloat(n) {
        return n.length > 0 && !isNaN(n) && n > 0;
    }

    handleShow() {
        this.setState({ showModal: true });
    }

    handleClose() {
        this.setState({ showModal: false });
    }

    handleChangeClient = selectedClientModal => {
        this.setState( { selectedClientModal, selectedProjectModal: null } );
        this.props.getProjectByClient(selectedClientModal.value);
    }

    handleChangeProject = selectedProjectModal => {
        this.setState( { selectedProjectModal } );
    }

    handleDateChange = selectedDate => {
        this.setState( { selectedDate } );
    };

    handleChangeExpense = selectedExpenseModal => {
        this.setState( { selectedExpenseModal });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleNewExpense = event => {
        event.preventDefault();

        const form = event.currentTarget;
            if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        const { selectedClientModal, selectedProjectModal, selectedDate, expenseTitle, expenseTotal, selectedExpenseModal } = this.state;

        if(!this.isFloat(expenseTotal)) return;
        if(expenseTitle === '' || selectedClientModal == null || selectedProjectModal == null || selectedExpenseModal == null) return;
        console.log(selectedDate);
        const payload = {
            expenseTitle: expenseTitle,
            expenseTotal: Number(expenseTotal),
            expenseDate: selectedDate,
            expenseClient: selectedClientModal.uid,
            expenseProject: selectedProjectModal.uid,
            expenseClass: selectedExpenseModal.value
        };

        this.props.addExpense(selectedClientModal.uid, selectedProjectModal.uid, payload);
    }

    renderModal() {
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c, i) => ({
                label: c.denomination,
                value: c.uid,
                ...c
            })).sort((a, b) => a.label.localeCompare(b.label)) : [];

        const projectSelect = this.props.projects !== null ?
            this.props.projects.map((p, i) => ({
                label: p.projectTitle,
                value: p.uid,
                ...p
            })).sort((a, b) => a.label.localeCompare(b.label)) : [];

        const { selectedClientModal, selectedProjectModal, selectedDate, expenseTitle, expenseTotal, selectedExpenseModal } = this.state;
        return(
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleNewExpense}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">
                                Client
                        </Form.Label>
                            <Col sm="7">
                                <Select placeholder="Select client..." options={clientSelect} value={selectedClientModal} onChange={this.handleChangeClient} />
                            </Col>
                        </Form.Group>

                        {
                            selectedClientModal == null ? null :
                            (this.props.loadingProjects ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                            <>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">
                                        Project
                                </Form.Label>
                                    <Col sm="7">
                                        <Select placeholder="Select project..." options={projectSelect} value={selectedProjectModal} onChange={this.handleChangeProject}  />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">Title</Form.Label>
                                    <Col sm="7">
                                        <Form.Control isInvalid={expenseTitle.length === 0} name="expenseTitle" value={expenseTitle} onChange={this.onChange} as="textarea" rows="2" required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">Amount</Form.Label>
                                    <Col sm="7">
                                        <Form.Control isInvalid={!this.isFloat(expenseTotal)} name="expenseTotal" value={expenseTotal} onChange={this.onChange} required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">Date</Form.Label>
                                    <Col sm="7">
                                        {/* DAY PICKER */}
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format="dd/MM/yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                label="Enter date dd/mm/yyyy"
                                                value={selectedDate}
                                                onChange={this.handleDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">Class</Form.Label>
                                    <Col sm="7">
                                        <Select placeholder="Select class..." options={expenseClasses} value={selectedExpenseModal} onChange={this.handleChangeExpense}  />
                                    </Col>
                                </Form.Group>
                            </>)
                        }

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cancel
                </Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleNewExpense} >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    <div>
                        {/* MODAL */}
                        <Button className="legem-primary" size="lg" block onClick={this.handleShow}>
                            New expense
                        </Button>

                        {this.renderModal()}

                        {/* EXPENSES */}
                        {/* JUMBOTRON SHOWS IF USER HAS NO REGISTERED EXPENSES*/}
                        <Jumbotron fluid>
                            <Container>
                                <h1>You have no registered expenses</h1>
                            </Container>
                        </Jumbotron>

                        <Accordion className="topMargin leftMargin rightMargin" defaultActiveKey="0">
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="0" ><b>
                                    <Container>
                                        <Row>
                                            <Col sm={8}> Anchor Bay Packaging de Mexico, S. de R.L. de C.V. - Proyecto X </Col>
                                            <Col sm={4}> $400.00 </Col>
                                        </Row>
                                    </Container>
                                </b></Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <Card.Text> Fine payment </Card.Text>
                                        <Card.Text> 07 de marzo de 2019 </Card.Text>
                                        <Card.Text> Gastos de traslado (tipo de gasto)</Card.Text>
                                        <Card.Text>
                                            <Container>
                                                <Row>
                                                    <Col sm={8}></Col>
                                                    <Col sm={4}>
                                                        <Button variant="outline-dark">Edit</Button>
                                                        <Button variant="outline-danger" className="leftMargin">Delete</Button>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Card.Text>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="1" ><b>
                                    <Container>
                                        <Row>
                                            <Col sm={8}> CLIENTE - PROYECTO </Col>
                                            <Col sm={4}> MONTO </Col>
                                        </Row>
                                    </Container>
                                </b></Accordion.Toggle>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <Card.Text> CONCEPTO</Card.Text>
                                        <Card.Text> FECHA </Card.Text>
                                        <Card.Text> TIPO DE GASTO </Card.Text>
                                        <Card.Text>
                                            <Container>
                                                <Row>
                                                    <Col sm={8}></Col>
                                                    <Col sm={4}>
                                                        <Button variant="outline-dark">Edit</Button>
                                                        <Button variant="outline-danger" className="leftMargin">Delete</Button>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Card.Text>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    clearAlert,
    addAlert,
    getClients,
    getUsers,
    addProject,
    getProjectByClient,
    addExpense
})(withAuthorization(condition)(gastos));