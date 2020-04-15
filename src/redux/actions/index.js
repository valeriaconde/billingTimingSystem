import { ADD_USER, ADD_ALERT, CLEAR_ALERT } from "../../constants/action-types"; 

export function addUser(payload) {
    return { type: ADD_USER, payload };
};

export function addAlert(payload) {
    return { type: ADD_ALERT, payload };
}

export function clearAlert(payload) {
    return { type: CLEAR_ALERT, payload };
}