import { observable, action, IObservableArray, computed } from "mobx";

export enum AlertType {
    Error,
    Warning,
    Info,
    Success
};

export class Alert {
    message: string;
    type: AlertType;
    time: number;

    constructor(type: AlertType, message: string) {
        this.type = type;
        this.message = message;
        this.time = Date.now();
    }
}

class AlertStore {
    @observable alerts = [] as unknown as IObservableArray<Alert>;

    @action
    add = (type: AlertType, message: string) => {
        const alert = new Alert(type, message);
        this.alerts.push(alert);
        console.log("kpedo");
        setTimeout(() => this.clear(alert), 30000);
    }

    @action
    clear = (alert: Alert) => {
        this.alerts.remove(alert);
    }

    @action
    clearAll = () => {
        this.alerts.clear();
    }

    @computed
    get hasAlert() {
        return this.alerts.length > 0;
    }
}

const store = new AlertStore();
export default store;