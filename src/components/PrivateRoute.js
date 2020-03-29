// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthUserContext } from './Auth';

// class PrivateRoute extends Component {
//     render(){
//         return(
//             <AuthUserContext.Consumer>
//             { authUser =>
//                 <Route path={this.props.path} comp={this.props.component} 
//                     render = {() =>
//                         authUser ? <Component {...this.props} />
//                         : <Redirect to={{ pathname: '/login', state: { from: this.props.path } }} />
//                     }
//                 />
//             }
//             </AuthUserContext.Consumer>
//         );
//     }
// }

const PrivateRoute = ({ component: Component, authUser: any, ...rest }) => {
    return (
        <AuthUserContext.Consumer>
            {
                authUser =>
                <Route
                    {...rest}
                    render = {props =>
                        authUser ? (
                            <Component {...props} />
                        ) : (
                                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                            )
                    }
                />
            }
        </AuthUserContext.Consumer>
        
    )
}

export default PrivateRoute;