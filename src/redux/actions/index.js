import { ADD_USER, ADD_ALERT, CLEAR_ALERT, DATA_LOADED, LOADING_USERS, UPDATED_USER } from "../../constants/action-types"; 
import axios from 'axios';

export function addUser(payload) {
    return { type: ADD_USER, payload };
};

export function addAlert(payload) {
    return { type: ADD_ALERT, payload };
}

export function clearAlert(payload) {
    return { type: CLEAR_ALERT, payload };
}

export function updateUser(uid, payload) {
    console.log("payload", payload);
    return function(dispatch) {
        const url = `${process.env.REACT_APP_DATABASE_URL}/users/${uid}.json`;
        dispatch({ type: LOADING_USERS, payload: {} });
        return axios.put(url, payload)
            .then(response => {
                dispatch({ type: UPDATED_USER, payload: response.data });
                window.location.reload();
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
                dispatch({ type: DATA_LOADED, payload: usersList.sort((a, b) => a.email.localeCompare(b.email)) });
            });
    };
}