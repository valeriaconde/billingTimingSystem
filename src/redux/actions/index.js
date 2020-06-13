import { ADD_USER, ADD_ALERT, CLEAR_ALERT, USERS_LOADED, CLIENTS_LOADED, 
    LOADING_USERS, UPDATED_USER, UPDATED_CLIENT, ADD_CLIENT, LOADING_CLIENTS,
    REMOVED_CLIENT, REMOVED_USER, LOADING_PROJECTS, ADD_PROJECT, PROJECTS_LOADED, ADD_EXPENSE, LOADING_EXPENSES, EXPENSES_LOADED } from "../../constants/action-types"; 
import { CLIENTS, PROJECTS, EXPENSES } from '../../constants/collections';
import axios from 'axios';
import { AlertType } from '../../stores/AlertStore';
import firebase from "../../components/firestone";

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
        const db = firebase.firestore();
        db.collection(CLIENTS)
            .add(payload)
            .then(docRef => {
                docRef.get()
                    .then(doc => {
                        if (doc.exists) {
                            const client = { ...doc.data(), uid: doc.id };
                            dispatch({ type: ADD_CLIENT, payload: client });
                            // window.location.reload();
                            const alert = { type: AlertType.Success, message: "Client successfully registered."};
                            dispatch({ type: ADD_ALERT, payload: alert });
                            setTimeout(() => dispatch({ type: CLEAR_ALERT, payload: alert }), 7000);
                        }
                    });
            })
            .catch(function(error) {
                const alert = { type: AlertType.Error, message: error };
                dispatch({ type: ADD_ALERT, payload: alert });
            });
    }
}

export function addProject(payload) {
    return function(dispatch) {
        firebase.firestore().collection(PROJECTS).add(payload)
            .then(() => {
                dispatch({ type: ADD_PROJECT, payload: {} });
                const alert = { type: AlertType.Success, message: "Project successfully created." };
                dispatch({ type: ADD_ALERT, payload: alert });
                setTimeout(() => dispatch({ type: CLEAR_ALERT, payload: alert }), 7000);
            })
            .catch(function(error) {
                const alert = { type: AlertType.Error, message: error };
                dispatch({ type: ADD_ALERT, payload: alert });
            });
    }
}

export function addExpense(payload) {
    return function(dispatch) {
        dispatch({ type: LOADING_EXPENSES, payload: {} });
        const db = firebase.firestore();
        db.collection(EXPENSES).add(payload)
            .then(docRef => {
                docRef.get()
                    .then(doc => {
                        if(doc.exists) {
                            const expense = { ...doc.data(), uid: doc.id };
                            dispatch({ type: ADD_EXPENSE, payload: expense });
                            const alert = { type: AlertType.Success, message: "Expense successfully created." };
                            dispatch({ type: ADD_ALERT, payload: alert });
                            setTimeout(() => dispatch({ type: CLEAR_ALERT, payload: alert }), 7000);
                        }
                    });
            })
            .catch(error => {
                const alert = { type: AlertType.Error, message: error };
                dispatch({ type: ADD_ALERT, payload: alert });
            });
    }
}

export function updateClient(uid, payload) {
    return function(dispatch) {
        dispatch({ type: LOADING_CLIENTS, payload: {} });
        const docRef = firebase.firestore().collection(CLIENTS).doc(uid);
        docRef.update(payload)
            .then(() => {
                docRef.get().then(snapshot => {
                    dispatch({ type: UPDATED_CLIENT, payload: snapshot.data() });
                    const alert = { type: AlertType.Success, message: "Client successfully updated." };
                    dispatch({ type: ADD_ALERT, payload: alert });
                    setTimeout(() => dispatch({ type: CLEAR_ALERT, payload: alert }), 7000);
                });
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

export function getProjectByClient(clientUid) {
    return function(dispatch) {
        dispatch({ type: LOADING_PROJECTS, payload: {} });
        firebase.firestore().collection(PROJECTS).where("projectClient", "==", clientUid)
            .get()
            .then(querySnapshot => {
                let projectsList = [];
                querySnapshot.forEach(doc => {
                    projectsList.push({ ...doc.data(), uid: doc.id });
                });
                dispatch({ type: PROJECTS_LOADED, payload: projectsList.sort((a, b) => a.projectTitle.localeCompare(b.projectTitle)) });
            })
            .catch(error => {
                const alert = { type: AlertType.Error, message: error };
                dispatch({ type: ADD_ALERT, payload: alert });
            });
    }
}

export function getClients() {
    return async function(dispatch) {
        dispatch({ type: LOADING_CLIENTS, payload: {} });
        await firebase.firestore().collection(CLIENTS)
            .get()
            .then(snapshot => {
                const clientsList = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    uid: doc.id
                }));
                dispatch({ type: CLIENTS_LOADED, payload: clientsList.sort((a, b) => a.denomination.localeCompare(b.denomination)) });
            })
            .catch(error => {
                const alert = { type: AlertType.Error, message: error };
                dispatch({ type: ADD_ALERT, payload: alert });
            });
    }
}

export function getUsers() {
    return function(dispatch) {
        const url = `${process.env.REACT_APP_DATABASE_URL}/users.json`;
        dispatch({ type: LOADING_USERS, payload: {} });
        return axios.get(url)
            .then(response => {
                const usersList = Object.keys(response.data).map(key => ({
                    ...response.data[key],
                    uid: key
                }));
                dispatch({ type: USERS_LOADED, payload: usersList.sort((a, b) => a.name.localeCompare(b.name)) });
            })
            .catch(error => {
                const alert = { type: AlertType.Error, message: error.message };
                dispatch({ type: ADD_ALERT, payload: alert });
            });
    };
}

export function getExpenses(uid, byAttorney) {
    return function(dispatch) {
        const url = `${process.env.REACT_APP_DATABASE_URL}/expenses.json?orderBy="${byAttorney ? "expenseAttorney" : "expenseProject"}"&startAt="${uid}"`;
        dispatch({ type: LOADING_EXPENSES, payload: {} });
        return axios.get(url)
            .then(response => {
                const expensesList = Object.keys(response.data).map(key => ({
                    ...response.data[key],
                    uid: key
                }));
                dispatch({ type: EXPENSES_LOADED, payload: expensesList });
            })
            .catch(error => {
                const alert = { type: AlertType.Error, message: error.message };
                dispatch({ type: ADD_ALERT, payload: alert });
            });
    };
}

export function deleteClient(uid) {
    return function(dispatch) {
        dispatch({ type: LOADING_CLIENTS, payload: {} });
        firebase.firestore().collection(CLIENTS).doc(uid).delete().then(() => {
            dispatch({ type: REMOVED_CLIENT, payload: uid });
            const alert = { type: AlertType.Success, message: "Client successfully deleted."};
            dispatch({ type: ADD_ALERT, payload: alert });
            setTimeout(() => dispatch({ type: CLEAR_ALERT, payload: alert }), 7000);
        }).catch(error => {
            const alert = { type: AlertType.Error, message: error.message };
            dispatch({ type: ADD_ALERT, payload: alert });
        });
    }
}

export function deleteUser(uid) {
    return function(dispatch) {
        const url = `${process.env.REACT_APP_DATABASE_URL}/users/${uid}.json`;
        dispatch({ type: LOADING_USERS, payload: {} });
        return axios.delete(url)
            .then(response => {
                dispatch({ type: REMOVED_USER, payload: uid });

                const alert = { type: AlertType.Success, message: "User successfully deleted."};
                dispatch({ type: ADD_ALERT, payload: alert });
                setTimeout(() => dispatch({ type: CLEAR_ALERT, payload: alert }), 7000);
            })
            .catch(error => {
                const alert = { type: AlertType.Error, message: error.message };
                dispatch({ type: ADD_ALERT, payload: alert });
            });
    }
}