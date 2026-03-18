import React from 'react';

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => {
    const WithFirebase = props => (
        <FirebaseContext.Consumer>
            {firebase => <Component {...props} firebase={firebase} />}
        </FirebaseContext.Consumer>
    );
    WithFirebase.displayName = `withFirebase(${Component.displayName || Component.name || 'Component'})`;
    return WithFirebase;
};

export default FirebaseContext;