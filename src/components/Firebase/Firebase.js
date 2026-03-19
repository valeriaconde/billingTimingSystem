import { initializeApp, getApps, getApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    onAuthStateChanged,
} from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';

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
        const app = getApps().length === 0 ? initializeApp(config) : getApp();
        this.auth = getAuth(app);
        this.db = getDatabase(app);
    }

    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
            return v.toString(16);
        });
    }

    // *** Password API ***
    doCreateUserWithEmailAndPassword = (email, password, roles) => {
        const secondaryApp = initializeApp(config, this.createUUID());
        const secondaryAuth = getAuth(secondaryApp);
        return createUserWithEmailAndPassword(secondaryAuth, email, password)
            .then(firebaseUser =>
                set(ref(this.db, `users/${firebaseUser.user.uid}`), {
                    email,
                    roles,
                    salary: 0,
                    startYear: 2003,
                    job: "Associate",
                    name: email,
                    initials: "AAA",
                })
            )
            .catch(error => error);
    }

    doSignInWithEmailAndPassword = (email, password) =>
        signInWithEmailAndPassword(this.auth, email, password);

    doSignOut = () => signOut(this.auth);

    doPasswordReset = email => sendPasswordResetEmail(this.auth, email);

    doPasswordUpdate = password => updatePassword(this.auth.currentUser, password);

    // *** Merge Auth and DB User API *** //
    onAuthUserListener = (next, fallback) =>
        onAuthStateChanged(this.auth, authUser => {
            if (authUser) {
                get(ref(this.db, `users/${authUser.uid}`))
                    .then(snapshot => {
                        const dbUser = snapshot.val();

                        if (dbUser.email !== authUser.email) {
                            fallback();
                        } else {
                            if (!dbUser.roles) {
                                dbUser.roles = {};
                            }

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
    user = uid => ref(this.db, `users/${uid}`);
    users = () => ref(this.db, 'users');
}

export default Firebase;
