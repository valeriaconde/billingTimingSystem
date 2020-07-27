import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';

class NotFoundPage extends Component {
    // constructor(props) {
    //     super(props);
    // }
    render() {
        return (
            <div>
                <Alert variant="primary">
                    <Alert.Heading>404 Not Found</Alert.Heading>
                    <p>
                        Page not found.
                    </p>
                    <hr />
                    <a href="/home">Back to home</a>
                </Alert>
            </div>
        );
    }
}
export default NotFoundPage;