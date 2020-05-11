import { ADD_USER, ADD_ALERT, CLEAR_ALERT, LOADING_USERS, LOADING_CLIENTS, 
    USERS_LOADED, CLIENTS_LOADED, UPDATED_USER, UPDATED_CLIENT, ADD_CLIENT,
    REMOVED_USER, REMOVED_CLIENT, LOADING_PROJECTS, ADD_PROJECT } from "../../constants/action-types";

const initialState = {
    users: [],
    alerts: [],
    clients: [],
    projects: [],
    loadingUsers: false,
    loadingClients: false,
    loadingProjects: false
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
    } else if(action.type === ADD_PROJECT) {
        return Object.assign({}, state, {
            loadingProjects: false
        });
    } else if(action.type === CLEAR_ALERT) {
        return Object.assign({}, state, {
            alerts: state.alerts.filter(a => { return JSON.stringify(a) !== JSON.stringify(action.payload) })
        });
    } else if(action.type === LOADING_PROJECTS) {
        return Object.assign({}, state, {
            loadingProjects: true
        });
    } else if(action.type === LOADING_USERS) {
        return Object.assign({}, state, {
            loadingUsers: true
        });
    } else if(action.type === LOADING_CLIENTS) {
        return Object.assign({}, state, {
            loadingClients: true
        });
    } else if(action.type === REMOVED_USER) {
        let tmp = state.users.filter(u => { return u.uid !== action.payload });
        return Object.assign({}, state, {
            loadingUsers: false,
            users: tmp.sort((a, b) => a.name.localeCompare(b.name))
        });
    } else if(action.type === REMOVED_CLIENT) {
        let tmp = state.clients.filter(c => { return c.uid !== action.payload });
        return Object.assign({}, state, {
            loadingClients: false,
            clients: tmp.sort((a, b) => a.denomination.localeCompare(b.denomination))
        });
    } else if(action.type === USERS_LOADED) {
        return Object.assign({}, state, {
            users: state.users.concat(action.payload).sort((a, b) => a.name.localeCompare(b.name)),
            loadingUsers: false
        });
    } else if(action.type === CLIENTS_LOADED) {
        return Object.assign({}, state, {
            clients: state.clients.concat(action.payload).sort((a, b) => a.denomination.localeCompare(b.denomination)),
            loadingClients: false
        });
    } else if(action.type === UPDATED_USER) {
        const email = action.payload.email;
        let tmp = state.users.filter(u => { return u.email !== email });
        tmp.push(action.payload);
        return Object.assign({}, state, {
            loadingUsers: false,
            users: tmp.sort((a, b) => a.name.localeCompare(b.name))
        });
    } else if(action.type === UPDATED_CLIENT) {
        const uid = action.payload.uid;
        let tmp = state.clients.filter(d => { return d.uid !== uid });
        tmp.push(action.payload);
        return Object.assign({}, state, {
            loadingClients: false,
            clients: tmp.sort((a, b) => a.denomination.localeCompare(b.denomination))
        });
    } else if(action.type === ADD_CLIENT) {
        return Object.assign({}, state, {
            loadingClients: false
        });
    }

    return state;
};
  
export default rootReducer;