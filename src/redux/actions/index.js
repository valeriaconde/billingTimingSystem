import { ADD_USER, ADD_ALERT, CLEAR_ALERT, USERS_LOADED, LOADING_USERS, UPDATED_USER, ADD_CLIENT } from "../../constants/action-types"; 
import axios from 'axios';
import { AlertType } from '../../stores/AlertStore';

export function addUser(payload) {
    return { type: ADD_USER, payload };
};

export function addAlert(type, message) {
    const payload = { type: type, message: message };
    return function(dispatch) {
        dispatch({ type: ADD_ALERT, payload });
        setTimeout(() => dispatch({ type: CLEAR_ALERT, payload }), 7000);
    }
}

export function clearAlert(payload) {
    return { type: CLEAR_ALERT, payload };
}

export function addClient(payload) {
    return function(dispatch) {
        const url = `${process.env.REACT_APP_DATABASE_URL}/clients.json`;
        return axios.post(url, payload)
            .then(response => {
                dispatch({ type: ADD_CLIENT, payload: response.data });

                const alert = { type: AlertType.Success, message: "Client successfully registered."};
                dispatch({ type: ADD_ALERT, payload: alert });
                setTimeout(() => dispatch({ type: CLEAR_ALERT, payload: alert }), 7000);
            })
            .catch(error => {
                const alert = { type: AlertType.Error, message: error.message };
                dispatch({ type: ADD_ALERT, payload: alert });
            });
    }
}

export function updateUser(uid, payload) {
    return function(dispatch) {
        const url = `${process.env.REACT_APP_DATABASE_URL}/users/${uid}.json`;
        dispatch({ type: LOADING_USERS, payload: {} });
        return axios.put(url, payload)
            .then(response => {
                dispatch({ type: UPDATED_USER, payload: response.data });

                const alert = { type: AlertType.Success, message: "User successfully updated."};
                dispatch({ type: ADD_ALERT, payload: alert });
                setTimeout(() => dispatch({ type: CLEAR_ALERT, payload: alert }), 7000);
            })
            .catch(error => {
                const alert = { type: AlertType.Error, message: error.message };
                dispatch({ type: ADD_ALERT, payload: alert });
            });
    };
}

export function getUsers() {
    return function(dispatch) {
        const url = `${process.env.REACT_APP_DATABASE_URL}/users.json`;
        dispatch({ type: LOADING_USERS, payload: {} });
        return axios.get(url)
            .then(response => {
                const usersList = Object.keys(response.data).map(key => ({
                    ...response.data[key],
                    uid: key,
                }));
                dispatch({ type: USERS_LOADED, payload: usersList.sort((a, b) => a.name.localeCompare(b.name)) });
            })
            .catch(error => {
                const alert = { type: AlertType.Error, message: error.message };
                dispatch({ type: ADD_ALERT, payload: alert });
            });
    };
}