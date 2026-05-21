import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "../reducers/index";
import thunk from "redux-thunk";
import { forbiddenUserMiddleware } from "../middleware/index";

const persistConfig = {
    key: "root",
    storage,
    blacklist: [
        "alerts",
        "loadingUsers",
        "loadingClients",
        "loadingProject",
        "loadingProjects",
        "loadingExpenses",
        "loadingTimes",
        "loadingPayments",
        "loadingProjectsMapping",
        "loadingReport",
        "reportReady",
    ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    persistedReducer,
    storeEnhancers(applyMiddleware(forbiddenUserMiddleware, thunk))
);

export const persistor = persistStore(store);
export default store;
