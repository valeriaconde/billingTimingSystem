import React from 'react';
import { AuthUserContext, withAuthorization } from './Auth';
import '../styles/HomePage.css';

const HomePage = () => (
    <AuthUserContext.Consumer>
        {authUser => {
            const name = authUser?.name || authUser?.email || '';
            return (
                <div className="home-page">
                    <div className="home-greeting">Welcome{name ? `, ${name}` : ''}!</div>
                </div>
            );
        }}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(HomePage);
