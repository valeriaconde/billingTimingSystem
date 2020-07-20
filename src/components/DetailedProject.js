import React, { Component } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import BarLoader from "react-spinners/BarLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { getProjectById, getProjectsMapping, getClients, getUsers, getTimes, getExpenses } from "../redux/actions/index";
import { connect } from "react-redux";
import { expenseClasses } from "../constants/enums";

const mapStateToProps = state => {
    return {
        loadingProjects: state.loadingProjects,
        project: state.project,
        users: state.users,
        loadingUsers: state.loadingUsers,
        clients: state.clients,
        clientsNames: state.clientsNames,
        expenses: state.expenses,
        loadingExpenses: state.loadingExpenses,
        times: state.times,
        loadingTimes: state.loadingTimes,
        projectsNames: state.projectsNames,
        loadingProjectsMapping: state.loadingProjectsMapping
     };
};

const INITIAL_STATE = {
    showModal: false,
};

class detailedProject extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE, clientId: this.props.match.params.clientId, projectId: this.props.match.params.projectId  };
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    componentDidMount() {
        this.props.getProjectById(this.props.match.params.projectId);

        if (this.props.clients.length === 0) {
            this.props.getClients();
        }

        if (this.props.users.length === 0) {
            this.props.getUsers();
        }

        if (Object.keys(this.props.projectsNames).length === 0) {
            this.props.getProjectsMapping();
        }

        let self = this;
        if(!self.props.loadedTimesOnce) {
            self.props.getTimes(this.props.match.params.projectId, false);
        }

        if(!self.props.loadedExpenseOnce) {
            self.props.getExpenses(this.props.match.params.projectId, false);
        }
    }

    handleShow() {
        this.setState({ showModal: true });
    }

    handleClose() {
        this.setState({ showModal: false });
    }

    renderModal() {
        return (
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add down payment</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Date</Form.Label>
                            <Col sm="5">
                                {/* DAY PICKER */}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3">Amount</Form.Label>
                            <Col sm="5">
                                <Form.Control as="textarea" rows="1" />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cancel
                            </Button>
                    <Button className="legem-primary" onClick={this.handleClose}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        const expenses = this.props.expenses !== null ?
            this.props.expenses.map((e, i) => ({
                ...e
            })) : [];

        const times = this.props.times !== null ?
            this.props.times.map(t => ({
                ...t
            })) : [];

        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    this.props.loadingProjects || this.props.loadingExpenses || this.props.loadingTimes || this.props.loadingUsers ? 
                    <BarLoader css={{width: "100%"}} loading={this.props.loadingProjects}></BarLoader> :
                    <div>
                        <h3 className="blueLetters topMargin leftMargin"> {this.props.project?.projectTitle} </h3>
                        <h6 className="bigLeftMargin"> For {this.props.clientsNames[this.state.clientId]} </h6>

                        <Container className="bigTopMargin">
                            <Row>
                                <Col className="bigLeftMargin">
                                    <Card style={{ width: '18rem' }} >
                                        <Card.Body>
                                            <Card.Title>Attorney</Card.Title>
                                            <Card.Text> { this.props.users.find(u => u.uid === this.props.project?.appointedIds)?.name || "None" } </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    <Card style={{ width: '18rem' }} className="topMargin">
                                        <Card.Body>
                                            <Card.Title> Billed by { this.props.project?.projectFixedFee ? "fixed fee" : "by the hour" } </Card.Title>
                                            <Card.Text> { this.props.project?.projectFixedFee ? `$${this.props.project?.projectFee}` : null } </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="leftMargin">
                                    <Card style={{ width: '18rem' }} >
                                        <Card.Body>
                                            <Card.Title>Down payments</Card.Title>
                                            <TableContainer>
                                                <Table aria-label="simple table">
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell> 16/02/20 </TableCell>
                                                            <TableCell className="centerText"> 4000 </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell> 03/03/20 </TableCell>
                                                            <TableCell className="centerText"> 600 </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Card.Body>
                                        <Card.Body className="rightAlign">
                                            <Button variant="outline-success" onClick={this.handleShow} >Add</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>

                        {this.renderModal()}

                        {/* EXPENSES TABLE */}
                        <div className="tableMargins ">
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <colgroup>
                                        <col width="80%" />
                                        <col width="10%" />
                                        <col width="5%" />
                                        <col width="5%" />
                                    </colgroup>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Registered expenses</b></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {expenses.map((row) => (
                                            <TableRow key={row.uid}>
                                                <TableCell>
                                                    <OverlayTrigger overlay={
                                                        <Tooltip>
                                                            {row.expenseDate?.toDate().toDateString()}
                                                            <br/>
                                                            {expenseClasses.find(obj => {
                                                                return obj.value === row.expenseClass;
                                                            })?.label  }
                                                        </Tooltip>}>
                                                        <span className="d-inline-block">
                                                            {`${this.props.users.find(u => u.uid === row.expenseAttorney)?.name} - ${row.expenseTitle}`}
                                                        </span>
                                                    </OverlayTrigger>
                                                </TableCell>
                                                    <TableCell className="rightAlign"> ${row.expenseTotal} </TableCell>
                                                <TableCell>
                                                    <OverlayTrigger overlay={<Tooltip id="tooltip">Billed</Tooltip>}>
                                                        <span className="d-inline-block">
                                                            {row.isBilled ? <FontAwesomeIcon icon={faCheckCircle} color="green" /> : null}
                                                        </span>
                                                    </OverlayTrigger>
                                                </TableCell>
                                                <TableCell>
                                                    <FontAwesomeIcon onClick={() => this.editExpense(row)} icon={faEdit} className="legemblue" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        }
                                        <TableRow>
                                            <TableCell> Total expenses  </TableCell>
                                            <TableCell className="rightAlign">14,900</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        {/* TIME TABLE */}
                        <div className="tableMargins topMargin bottomMargin">
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <colgroup>
                                        <col width="80%" />
                                        <col width="10%" />
                                        <col width="5%" />
                                        <col width="5%" />
                                    </colgroup>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Registered time</b></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {times.map((row) => (
                                        <TableRow key={row.uid}>
                                            <TableCell>
                                                <OverlayTrigger overlay={
                                                    <Tooltip>
                                                        {row.timeDate?.toDate().toDateString()}
                                                    </Tooltip>
                                                }>
                                                    <span className="d-inline-block">
                                                        {`${this.props.users.find(u => u.uid === row.timeAttorney)?.name} - ${row.timeTitle}`}
                                                    </span>
                                                </OverlayTrigger>
                                            </TableCell>
                                            <TableCell className="rightAlign">{`${row.timeHours}:${row.timeMinutes} hrs`}</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>
                                                <FontAwesomeIcon onClick={() => this.editTime(row)} icon={faEdit} className="legemblue" />
                                            </TableCell>
                                        </TableRow>
                                        ))
                                        }
                                        <TableRow>
                                            <TableCell>Total time </TableCell>
                                            <TableCell className="rightAlign">5h 45m</TableCell>
                                            <TableCell> </TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className="rightAlign biggerRightMargin bottomMargin">
                            <Button variant="outline-danger">Archive project</Button>{' '}
                        </div>
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    getProjectById,
    getClients,
    getProjectsMapping,
    getUsers,
    getTimes,
    getExpenses
})(withAuthorization(condition)(detailedProject));