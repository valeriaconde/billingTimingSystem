import { ADD_USER, ADD_ALERT, CLEAR_ALERT, LOADING_USERS, LOADING_CLIENTS, 
    USERS_LOADED, CLIENTS_LOADED, UPDATED_USER, UPDATED_CLIENT, ADD_CLIENT,
    REMOVED_USER, REMOVED_CLIENT, LOADING_PROJECTS, ADD_PROJECT, PROJECTS_LOADED, LOADING_EXPENSES, ADD_EXPENSE, EXPENSES_LOADED, LOADING_PROJECTS_MAPPING, PROJECTS_MAPPING_LOADED, UPDATED_EXPENSE, REMOVED_EXPENSE, LOADING_TIMES, ADD_TIME, TIMES_LOADED, REMOVED_TIME, UPDATED_TIME, PROJECT_LOADED, LOADING_PAYMENT, ADD_PAYMENT, PAYMENTS_LOADED } from "../../constants/action-types";

const initialState = {
    users: [],
    alerts: [],
    clients: [],
    clientsNames: {},
    projectsNames: {},
    projects: [],
    project: {},
    expenses: [],
    times: [],
    payments: [],
    loadingTimes: false,
    loadingUsers: false,
    loadingClients: false,
    loadingProjects: false,
    loadingExpenses: false,
    loadedExpenseOnce: false,
    loadedTimesOnce: false,
    loadingPayments: false,
    loadedPaymentsOnce: false,
    loadingProjectsMapping: false
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
    } else if(action.type === ADD_EXPENSE) {
        return Object.assign({}, state, {
            loadingExpenses: false,
            expenses: state.expenses.concat([action.payload]).sort((a, b) => b.expenseDate - a.expenseDate)
        });
    } else if(action.type === ADD_TIME) {
        return Object.assign({}, state, {
            loadingTimes: false,
            times: state.times.concat([action.payload]).sort((a, b) => b.timeDate - a.timeDate)
        });
    } else if(action.type === ADD_PAYMENT) {
        return Object.assign({}, state, {
            loadingPayments: false,
            payments: state.payments.concat([action.payload]).sort((a, b) => b.paymentDate - a.paymentDate)
        })
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
    } else if(action.type === LOADING_PROJECTS_MAPPING) {
        return Object.assign({}, state, {
            loadingProjectsMapping: true
        });
    } else if(action.type === LOADING_CLIENTS) {
        return Object.assign({}, state, {
            loadingClients: true
        });
    } else if(action.type === LOADING_TIMES) {
        return Object.assign({}, state, {
            loadingTimes: true
        });
    } else if(action.type === LOADING_EXPENSES) {
        return Object.assign({}, state, {
            loadingExpenses: true
        });
    } else if(action.type === LOADING_PAYMENT) {
        return Object.assign({}, state, {
            loadingPayments: true
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
    } else if(action.type === REMOVED_EXPENSE) {
        let tmp = state.expenses.filter(e => e.uid !== action.payload);
        return Object.assign({}, state, {
            loadingExpenses: false,
            expenses: tmp.sort((a, b) => b.expenseDate - a.expenseDate)
        });
    } else if(action.type === REMOVED_TIME) {
        let tmp = state.times.filter(t => t.uid !== action.payload);
        return Object.assign({}, state, {
            loadingTimes: false,
            times: tmp.sort((a, b) => b.timeDate - a.timeDate)
        });
    } else if(action.type === USERS_LOADED) {
        return Object.assign({}, state, {
            users: state.users.concat(action.payload).sort((a, b) => a.name.localeCompare(b.name)),
            loadingUsers: false
        });
    } else if(action.type === PROJECTS_MAPPING_LOADED) {
        let tmp = {};
        action.payload.forEach(project => {
            tmp[project.uid] = project.projectTitle;
        });
        return Object.assign({}, state, {
            loadingProjectsMapping: false,
            projectsNames: tmp
        });
    } else if(action.type === CLIENTS_LOADED) {
        let tmp = {};
        action.payload.forEach(client => {
            tmp[client.uid] = client.denomination;
        });
        return Object.assign({}, state, {
            clients: state.clients.concat(action.payload).sort((a, b) => a.denomination.localeCompare(b.denomination)),
            loadingClients: false,
            clientsNames: tmp
        });
    } else if(action.type === PROJECTS_LOADED) {
        return Object.assign({}, state, {
            projects: action.payload,
            loadingProjects: false
        });
    } else if(action.type === PROJECT_LOADED) {
        return Object.assign({}, state, {
            project: action.payload,
            loadingProjects: false
        });
    } else if(action.type === EXPENSES_LOADED) {
        return Object.assign({}, state, {
            expenses: action.payload.sort((a, b) => b.expenseDate - a.expenseDate),
            loadingExpenses: false,
            loadedExpenseOnce: true
        });
    } else if(action.type === PAYMENTS_LOADED) {
        return Object.assign({}, state, {
            payments: action.payload.sort((a, b) => b.paymentDate - a.paymentDate),
            loadingPayments: false,
            loadedPaymentsOnce: true
        });
    } else if(action.type === TIMES_LOADED) {
        return Object.assign({}, state, {
            times: action.payload.sort((a, b) => b.timeDate - a.timeDate),
            loadingTimes: false,
            loadedTimesOnce: true
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
    } else if(action.type === UPDATED_EXPENSE) {
        const uid = action.payload.uid;
        let tmp = state.expenses.filter(e => { return e.uid !== uid });
        tmp.push(action.payload);
        return Object.assign({}, state, {
            loadingExpenses: false,
            expenses: tmp.sort((a, b) => b.expenseDate - a.expenseDate)
        })
    } else if(action.type === UPDATED_TIME) {
        const uid = action.payload.uid;
        let tmp = state.times.filter(t => t.uid !== uid);
        tmp.push(action.payload);
        return Object.assign({}, state, {
            loadingTimes: false,
            times: tmp.sort((a, b) => b.timeDate - a.timeDate)
        });
    } else if(action.type === ADD_CLIENT) {
        return Object.assign({}, state, {
            loadingClients: false,
            clients: state.clients.concat([action.payload]).sort((a, b) => a.denomination.localeCompare(b.denomination))
        });
    }

    return state;
};
  
export default rootReducer;