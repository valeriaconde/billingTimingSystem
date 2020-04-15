import { ADD_USER, ADD_ALERT, CLEAR_ALERT } from "../../constants/action-types";

const initialState = {
    users: [],
    alerts: []
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
        });;
    }

    return state;
};
  
export default rootReducer;