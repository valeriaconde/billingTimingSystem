import { observable, computed, autorun } from "mobx";
import axios from 'axios';

class UserStore {
    @observable users : any = [];

    constructor() {
        autorun(() => console.log(this.users));
    }

    fetch() {
        const url = `${process.env.REACT_APP_DATABASE_URL}/users.json`;
        console.log(url);
        axios.get(url)
            .then(response => {
                if(response?.data) {
                    const usersList = Object.keys(response.data).map(key => ({
                        ...response.data[key],
                        uid: key,
                    }));
                    this.users = usersList;
                } else {
                    console.log("Error");
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    @computed get allUsers() {
        return this.users;
    }

    @computed get isEmpty() {
        return this.users === null || this.users.length === 0;
    }
}

const store = new UserStore();
export default store;