import { ADD_USER, ADD_ALERT, CLEAR_ALERT, LOADING_USERS, LOADING_CLIENTS, 
        DATA_LOADED, UPDATED_USER, ADD_CLIENT } from "../../constants/action-types";

const initialState = {
    users: [],
    alerts: [],
    clients: [],
    loadingUsers: false,
    loadingClients: false
};
  
function rootReducer(state = initialState, action) {
    if(action.type === ADD_USER) {
        return Object.assign({}, state, {
            users: state.users.concat(action.payload)
        });
    } else if(action.type === ADD_ALERT) {
        return Object.assign({}, state, {
            alerts: state.alerts.concat(action.payload)
        });
    } else if(action.type === CLEAR_ALERT) {
        return Object.assign({}, state, {
            alerts: state.alerts.filter(a => { return JSON.stringify(a) !== JSON.stringify(action.payload) })
        });
    } else if(action.type === LOADING_USERS) {
        return Object.assign({}, state, {
            loadingUsers: true
        });
    } else if(action.type === LOADING_CLIENTS) {
        return Object.assign({}, state, {
            loadingClients: true
        });
    } else if(action.type === DATA_LOADED) {
        return Object.assign({}, state, {
            users: state.users.concat(action.payload),
            loadingUsers: false
        });
    } else if(action.type === UPDATED_USER) {
        return Object.assign({}, state, {
            loadingUsers: false
        });
    } else if(action.type === ADD_CLIENT) {
        return Object.assign({}, state, {
            clients: state.users.concat(action.payload),
            loadingClients: false
        });
    }

    return state;
};
  
export default rootReducer;