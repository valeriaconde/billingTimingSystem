import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';


class NotFoundPage extends Component {
    // constructor(props) {
    //     super(props);
    // }
    render() {
        return (
            <div>
                <Alert variant="success">
                <Alert.Heading>404 Not Found</Alert.Heading>
                    <p>
                    Esta página no existe.
                    </p>
                    <hr />
                    <p className="mb-0">
                    Intenta con otra.
                    </p>
                </Alert>
            </div>
        );
    }
}
export default NotFoundPage;