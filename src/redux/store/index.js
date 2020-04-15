import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers/index";
import thunk from "redux-thunk";
import { forbiddenUserMiddleware } from "../middleware/index";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer,
    storeEnhancers(applyMiddleware(forbiddenUserMiddleware, thunk)));

export default store;