import { ADD_USER, ADD_ALERT, CLEAR_ALERT, LOADING_USERS, DATA_LOADED, UPDATED_USER } from "../../constants/action-types";

const initialState = {
    users: [],
    alerts: [],
    loadingUsers: false
};
  
function rootReducer(state = initialState, action) {
    if(action.type === ADD_USER) {
        return Object.assign({}, state, {
            users: state.users.concat(action.payload)
        });
    }
    else if(action.type === ADD_ALERT) {
        return Object.assign({}, state, {
            alerts: state.alerts.concat(action.payload)
        });
    }
    else if(action.type === CLEAR_ALERT) {
        return Object.assign({}, state, {
            alerts: state.alerts.filter(a => { return JSON.stringify(a) !== JSON.stringify(action.payload) })
        });
    }
    else if(action.type === LOADING_USERS) {
        return Object.assign({}, state, {
            loadingUsers: true
        });
    }
    else if(action.type === DATA_LOADED) {
        return Object.assign({}, state, {
            users: state.users.concat(action.payload),
            loadingUsers: false
        });
    }
    else if(action.type === UPDATED_USER) {
        return Object.assign({}, state, {
            loadingUsers: false
        });
    }

    return state;
};
  
export default rootReducer;