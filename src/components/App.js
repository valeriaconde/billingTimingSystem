import React, { Component } from 'react';
import '../styles/App.css';
import Menu from './Menu';
import {
    BrowserRouter,
    Switch,
    Route,
} from "react-router-dom";
import Clientes from './Clients';
import NotFoundPage from './NotFoundPage';
import LoginPage from './LoginPage';
import Registeruser from './Register';
import ProyectosPage from './ProyectosPage';
import gastos from './GastosPage';
import tiemposPage from './TiemposPage';
import UsuariosPage from './UsuariosPage';
import Passrec from './PasswordRecovery';
import PassChange from './PasswordChange';
import detailedProject from './DetailedProject';
import Billing from './Billing';
import { withAuthentication } from './Auth';
import { AlertType } from '../stores/AlertStore';
import { Alert } from 'react-bootstrap';
import { connect } from "react-redux";
import { clearAlert, getClientsMapping, getUsers, getProjectsMapping } from "../redux/actions/index";

// REACT VERSION: 16.13.0

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const isStale = ts => !ts || Date.now() - ts > CACHE_TTL;

const mapStateToProps = state => {
    return {
        alerts: state.alerts,
        clients: state.clients,
        users: state.users,
        projectsNames: state.projectsNames,
        lastFetchedClients: state.lastFetchedClients,
        lastFetchedUsers: state.lastFetchedUsers,
        lastFetchedProjectsNames: state.lastFetchedProjectsNames,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        clearAlert: alert => dispatch(clearAlert(alert)),
        getClients: () => dispatch(getClientsMapping()),
        getUsers: () => dispatch(getUsers()),
        getProjectsMapping: () => dispatch(getProjectsMapping())
    };
}

class App extends Component {
    componentDidUpdate(prevProps) {
        if (!prevProps.authUser && this.props.authUser) {
            if (isStale(this.props.lastFetchedClients)) {
                this.props.getClients();
            }
            if (isStale(this.props.lastFetchedUsers)) {
                this.props.getUsers();
            }
            if (isStale(this.props.lastFetchedProjectsNames)) {
                this.props.getProjectsMapping();
            }
        }
    }

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
            <div>
            {this.props.alerts.map((alert, i) => <Alert key={`alert-${i}`} style={{ width: "100%" }} onClose={() => this.props.clearAlert(alert)} variant={this.getAlertColor(alert.type)} dismissible>{alert.message}</Alert>)}
            </div>
        );
    }

    render() {
        return (
                <BrowserRouter>
                    <Menu />
                    {
                        <div style={{ marginBottom: "20px", width: "100%" }}>
                            {this.renderAlerts()}
                        </div>
                    }
                    <Switch>
                        <Route path="/" exact component={Clientes} />

                        <Route path="/home" exact component={Clientes} />

                        <Route path="/users/register" exact component={Registeruser} />

                        <Route path="/login" exact component={LoginPage} />

                        <Route path="/projects" exact component={ProyectosPage} />

                        <Route path="/billing" exact component={Billing} />

                        <Route path="/expenses" exact component={gastos} />

                        <Route path="/timing" exact component={tiemposPage}/>

                        <Route path="/users" exact component={UsuariosPage} />

                        <Route path="/password-recovery" exact component={Passrec} />

                        <Route path="/password/update" exact component={PassChange} />

                        <Route path="/projects/:clientId/:projectId" component={detailedProject} />

                        <Route component={NotFoundPage} />
                    </Switch>
                </BrowserRouter>
        );
    }
}

import PropTypes from 'prop-types';

App.propTypes = {
    authUser: PropTypes.object,
    alerts: PropTypes.array,
    clients: PropTypes.array,
    users: PropTypes.array,
    projectsNames: PropTypes.object,
    lastFetchedClients: PropTypes.number,
    lastFetchedUsers: PropTypes.number,
    lastFetchedProjectsNames: PropTypes.number,
    clearAlert: PropTypes.func,
    getClients: PropTypes.func,
    getUsers: PropTypes.func,
    getProjectsMapping: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(withAuthentication(App));