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
                        Esta página no existe.
                    </p>
                    <hr />
                    <a href="/home">Volver a inicio</a>
                </Alert>
            </div>
        );
    }
}
export default NotFoundPage;