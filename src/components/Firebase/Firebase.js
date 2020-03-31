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

    // *** Password API ***
    doCreateUserWithEmailAndPassword = (email, password, roles) => 
    {
        var secondaryApp = app.initializeApp(config, "Secondary");
        secondaryApp.auth().createUserWithEmailAndPassword(email, password).then(function(firebaseUser) {
            console.log("User " + firebaseUser.user.email + " " + firebaseUser.user.uid + " created successfully!");
            return app.database().ref(`users/${firebaseUser.user.uid}`)
                .set({
                    email,
                    roles,
                });
        })
        .catch(error => {
            console.log(error);
            return error;
        });
    }

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

    // *** User API ***
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');
}

export default Firebase;