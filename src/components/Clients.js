import React, { Component } from 'react';
import { ListGroup, Container, Row, Col, InputGroup, FormControl, Button, ButtonToolbar } from 'react-bootstrap';

class Clientes extends Component {
    // constructor(props) {
    //     super(props);
    // }
    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col sm={4}>
                            <ListGroup as="ul" className="">
                                <ListGroup.Item as="li" active className="legem-primary"> Cliente 1 </ListGroup.Item>
                                <ListGroup.Item as="li" >Cliente 2</ListGroup.Item>
                                <ListGroup.Item as="li"> Cliente 3</ListGroup.Item>
                                <ListGroup.Item as="li">Cliente 4</ListGroup.Item>
                            </ListGroup>
                        </Col>

                        {/* toda esta seccion estara oculta mientras no haya un cliente seleccionado */}
                        <Col sm={8}>
                            <div>
                                <label className="formLabels">Denominación</label>
                                <InputGroup className="mb-3">
                                    <FormControl size="sm" type="text" />
                                </InputGroup>

                                <label className="formLabels">Domicilio</label>
                                <InputGroup className="mb-3">
                                    <FormControl size="sm" type="text" />
                                </InputGroup>

                                <label className="formLabels">RFC</label>
                                <InputGroup className="mb-3">
                                    <FormControl size="sm" type="text" />
                                </InputGroup>

                                <label className="formLabels">Contacto principal</label>
                                <InputGroup className="mb-3">
                                    <FormControl size="sm" type="text" />
                                </InputGroup>

                                <label className="formLabels">Correo electrónico</label>
                                <InputGroup className="mb-3">
                                    <FormControl size="sm" type="text" />
                                </InputGroup>

                                <label className="formLabels">Teléfono</label>
                                <InputGroup className="mb-3">
                                    <FormControl size="sm" type="text" />
                                </InputGroup>

                                <label className="formLabels">Página Web</label>
                                <InputGroup className="mb-3">
                                    <FormControl size="sm" type="text" />
                                </InputGroup>

                                <label className="formLabels">Cliente desde </label>
                                <InputGroup className="mb-3">
                                    <FormControl size="sm" type="text" />
                                </InputGroup>

                                {/* debe estar azul la opcion seleccionada e inhabilitado el boton a menos que le den edit
                                CANTIDAD DE IVA */}
                                
                                <InputGroup>
                                    <label className="formLabels">IVA </label>
                                    <InputGroup.Append>
                                        <Button variant="outline-secondary" className="legem-primary" size="sm">SI</Button>
                                        <Button variant="outline-secondary" size="sm" >NO</Button>
                                    </InputGroup.Append>
                                </InputGroup>

                                {/* pinche boton no lo puedo mover a la derecha alv */}
                                <ButtonToolbar>
                                    <Button variant="secondary" >
                                        Editar
                                    </Button>
                                </ButtonToolbar>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default Clientes;