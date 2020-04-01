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
import passRec from './PasswordRecovery';
import passChange from './PasswordChange';
import { withAuthentication } from './Auth';
import { AlertType } from '../stores/AlertStore';
import { Alert } from 'react-bootstrap';
// REACT VERSION: 16.13.0

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { alerts: [] };
    }

    addAlert = (type, message) => {
        const { alerts } = this.state;

        const alert = {type: type, message: message};
        alerts.push(alert);
        setTimeout(() => this.clear(alert), 15000);

        this.setState({ alerts: alerts });
    }

    clear = (alert) => {
        const { alerts } = this.state;

        const index = alerts.indexOf(alert);
        if (index > -1) {
            alerts.splice(index, 1);
        }
        
        this.setState({ alerts: alerts });
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
            {this.state.alerts.map((alert, i) => <Alert key={`alert-${i}`} style={{ width: "100%" }} onClose={() => this.clear(alert)} variant={this.getAlertColor(alert.type)} dismissible>{AlertType[alert.type].toUpperCase()}: {alert.message}</Alert>)}
            </div>
        );
    }

    render() {
        return (
                <BrowserRouter>
                    <Menu />
                    { this.state.alerts.length > 0 &&
                        <div style={{ marginBottom: "20px", width: "100%" }}>
                            {this.renderAlerts()}
                        </div>
                    }
                    <Switch>
                        <Route path="/" exact component={Clientes} />

                        <Route path="/home" exact component={Clientes} />

                        <Route path="/register" exact render={(props) => <Registeruser {...props} addAlert={this.addAlert} />} />

                        <Route path="/login" exact render={(props) => <LoginPage {...props} addAlert={this.addAlert} />} />

                        <Route path="/proyectos" exact component={ProyectosPage} />

                        <Route path="/gastos" exact component={gastos} />

                        <Route path="/tiempos" exact component={tiemposPage}/>

                        <Route path="/usuarios" exact component={UsuariosPage} />

                        <Route path="/password-recovery" exact component={passRec} />

                        <Route path="/password-change" exact component={passChange} />

                        <Route component={NotFoundPage} />
                    </Switch>
                </BrowserRouter>
        );
    }
}

export default withAuthentication(App);