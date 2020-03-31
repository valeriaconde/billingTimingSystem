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
import registeruser from './Register';
import ProyectosPage from './ProyectosPage';
import gastos from './GastosPage';
import tiemposPage from './TiemposPage';
import UsuariosPage from './UsuariosPage';
import passRec from './PasswordRecovery';
import passChange from './PasswordChange';
import { withAuthentication } from './Auth';

// REACT VERSION: 16.13.0

class App extends Component {
    render() {
        return (
                <BrowserRouter>
                    <Menu />
                    <Switch>
                        <Route path="/" exact component={Clientes} />

                        <Route path="/home" exact component={Clientes} />

                        <Route path="/register" exact component={registeruser} />

                        <Route path="/login" exact component={LoginPage} />

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