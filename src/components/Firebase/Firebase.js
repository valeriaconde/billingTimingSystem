import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase { 
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.database();
    }

    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
            return v.toString(16);
        });
    }

    // *** Password API ***
    doCreateUserWithEmailAndPassword = (email, password, roles) => 
    {
        var secondaryApp = app.initializeApp(config, this.createUUID());
        return secondaryApp.auth().createUserWithEmailAndPassword(email, password).then(function(firebaseUser) {
            return app.database().ref(`users/${firebaseUser.user.uid}`)
                .set({
                    email,
                    roles,
                    salary: 0,
                    startYear: 2003,
                    job: "Associate",
                    name: email,
                    initials: "AAA"
                });
        })
        .catch(error => {
            return error;
        });
    }

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

    // *** Merge Auth and DB User API *** //
    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if(authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(snapshot => {
                        const dbUser = snapshot.val();

                        if(dbUser.email !== authUser.email) {
                            fallback();
                        } else {
                            // default empty roles
                            if(!dbUser.roles) {
                                dbUser.roles = {};
                            }

                            // merge auth and db user
                            this.mergedUser = {
                                ...authUser,
                                ...dbUser,
                            };

                            next(this.mergedUser);
                        }
                    });
            } else {
                fallback();
            }
        });

    // *** User API ***
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');
}

export default Firebase;