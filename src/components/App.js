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
import PrivateRoute from './PrivateRoute';
import registeruser from './Register';
import ProyectosPage from './ProyectosPage';
import gastos from './GastosPage';
import tiemposPage from './TiemposPage';

// REACT VERSION: 16.13.0

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        document.title = "Legem";
    }

    render() {
        return (
            <BrowserRouter>
                <Menu />
                <Switch>

                    <PrivateRoute path="/" exact component={Clientes} />

                    <PrivateRoute path="/home" exact component={Clientes} />

                    <PrivateRoute path="/register" exact component={registeruser} />

                    <Route path="/login" exact component={LoginPage} />

                    <PrivateRoute path="/proyectos" exact component={ProyectosPage} />

                    <PrivateRoute path="/gastos" exact component={gastos} />

                    <PrivateRoute path="/tiempos" exact component={tiemposPage}/>

                    <Route component={NotFoundPage} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;