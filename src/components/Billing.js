import React, { Component } from 'react';
import Select from 'react-select';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { connect } from 'react-redux';
import { getProjectByClient,addTime, addExpense, deletePayment, updateTime, deleteTime,
    updateExpense, deleteExpense, getProjectById, getProjectsMapping, getClients,
    getUsers, getTimes, getExpenses, addDownPayment, getPayments, getReportData
} from "../redux/actions/index";
import FileSaver from "file-saver";
import Docxtemplater from 'docxtemplater';
import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
import BarLoader from "react-spinners/BarLoader";

const mapStateToProps = state => {
    return {
        loadingProjects: state.loadingProjects,
        projects: state.projects,
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
        loadingProjectsMapping: state.loadingProjectsMapping,
        loadedPaymentsOnce: state.loadedPaymentsOnce,
        payments: state.payments,
        reportReady: state.reportReady,
        loadingReport: state.loadingReport
     };
};

const INITIAL_STATE = {
    data: null,
    showModal: false,
    showExpenseModal: false,
    showTimeModal: false,
    selectedDate: new Date(),
    paymentTotal: 0,
    timeMinutes: 15,
    selectedOption: null,
    selectedClient: null,
    validated: false,
    selectedProjects: [],
    selectedExpenseModal: null,
    expenseTitle: '',
    expenseTotal: 0,
    timeTitle: '',
    timeHours: 0,
    hourlyRate: 0,
    isModalAdd: true
};

class billing extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.attorney = React.createRef();
        this.hour = React.createRef();
    }

    componentDidMount() {
        if (this.props.clients.length === 0) {
            this.props.getClients();
        }

        if (this.props.users.length === 0) {
            this.props.getUsers();
        }

        if (Object.keys(this.props.projectsNames).length === 0) {
            this.props.getProjectsMapping();
        }
    }

    loadFile = (url, callback) => {
        JSZipUtils.getBinaryContent(url, callback);
    }

    generateData = (event) => {
        event.preventDefault();
        
        var projects = this.state.selectedProjects.map(p => { return p.value });
        this.props.getReportData(projects);
    }

    generateDoc = (event) => {
        event.preventDefault();
        /* Date */
        const today = new Date();
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });
        const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(today);

        /* Expenses */
        let totalExpenses = 0;
        this.props.expenses.map(e => totalExpenses += Number(e.expenseTotal));

        var amount = 0;
        var projects = [];
        for(let project of this.state.selectedProjects) {
            var totalProjectTaxable = Number(project.projectFee) || 0;

            let times = this.props.times.filter(t => t.timeProject === project.uid);
            times.map(t => totalProjectTaxable += Number(t.timeTotal));
            amount += totalProjectTaxable;

            projects.push({
                name: project.projectTitle,
                billingType: (project.projectFixedFee ? "Fixed Fee" : "Hourly Billing"),
                totalP: totalProjectTaxable
            });
        }

        /* IVA */
        let tax = 0;
        if(this.state.selectedClient.iva) {
            console.log("si hay tax papu");
            tax = amount * 0.16;
        }

        const total = amount + tax;
        const grandTotal = total + totalExpenses;

        const data = {
            invoice: 123,
            date: `${day}/${month}/${year}`,
            contact: this.state.selectedClient.contact,
            denomination: this.state.selectedClient.denomination,
            address1: this.state.selectedClient.address,
            address2: this.state.selectedClient.address2,
            city: this.state.selectedClient.city,
            state: this.state.selectedClient.state,
            zipCode: this.state.selectedClient.zipCode,
            projects: projects,
            amount: amount.toFixed(2),
            tax: tax.toFixed(2),
            expenses: totalExpenses.toFixed(2),
            total: total.toFixed(2),
            grandTotal: grandTotal.toFixed(2)
        };

        console.log(data);

        this.loadFile("/template.docx", (error, content) => {
            if(error) throw error;

            var zip = new JSZip(content);
            var doc = new Docxtemplater().loadZip(zip);

            doc.setData(data);
            try {
                doc.render();
            } catch(error) {
                var e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties,
                };
                console.log(JSON.stringify({error: e}));
                throw error;
            }

            var blob = doc.getZip().generate({
                                                type: "blob",
                                                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            });
            console.log("blob");
            console.log(blob);
            FileSaver.saveAs(blob, "output.docx");
        });
    }

    handleChangeClient = selectedClient => {
        this.setState({ selectedClient });
        this.props.getProjectByClient(selectedClient.value);
    }

    handleChangeProject = option => {
        this.setState(state => {
            return {
                selectedProjects: option
            };
        });
    }

    render() {
        const clientSelect = this.props.clients !== null ?
            this.props.clients.map((c, i) => ({
                label: c.denomination,
                value: c.uid,
                idx: i,
                ...c
            })).sort((a, b) => a.label.localeCompare(b.label)) : [];

        const projectSelect = this.props.projects !== null ?
            this.props.projects.map((p) => ({
                label: p.projectTitle,
                value: p.uid,
                ...p
            })).sort((a, b) => a.label.localeCompare(b.label)) : [];

        const { selectedClient, selectedProjects } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    this.props.loadingClients ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                    <div>
                        <h4 className="blueLetters topMargin leftMargin"> New notice </h4>

                        {/* CHOOSE CLIENT */}
                        <Form className="leftMargin topMargin">
                            <Form.Group as={Row}>
                                <Form.Label column sm="3"> Client </Form.Label>
                                <Col sm="6">
                                    <Select value={selectedClient} placeholder="Select client..." options={clientSelect} onChange={this.handleChangeClient} />
                                </Col>
                            </Form.Group>

                            {
                                selectedClient === null ? null :
                                this.props.loadingProjects ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                                <div>
                                    {/* CHOOSE PROJECTS */}
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3"> Projects: </Form.Label>
                                        <Col sm="6">
                                            <Select isMulti={true} isClearable={true} placeholder="Select projects to bill..." options={projectSelect} value={selectedProjects} onChange={this.handleChangeProject} />
                                        </Col>
                                    </Form.Group>

                                    {
                                        this.props.loadingReport ? <BarLoader css={{width: "100%"}} loading={this.props.loadingUsers}></BarLoader> :
                                        <div>
                                            <Button className="legem-primary" type="submit" onClick={this.generateData} hidden={selectedProjects == null || selectedProjects.length === 0 || this.props.reportReady}> Generate charge notice </Button>
                                            <Button className="legem-primary" type="submit" onClick={this.generateDoc} hidden={!this.props.reportReady}> Download </Button>
                                        </div>
                                    }
                                </div>
                            }
                        </Form>
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
    getExpenses,
    addDownPayment,
    getPayments,
    updateExpense,
    deleteExpense,
    updateTime,
    deleteTime,
    deletePayment,
    addTime,
    addExpense,
    getProjectByClient,
    getReportData
})(withAuthorization(condition)(billing));