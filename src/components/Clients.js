import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import BarLoader from "react-spinners/BarLoader";
import { AlertType } from '../stores/AlertStore';
import { connect } from "react-redux";
import { addAlert, clearAlert, addClient, updateClient, deleteClient } from "../redux/actions/index";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { trimFields, trimString } from '../utils/inputUtils';
import '../styles/Clients.css';

const mapStateToProps = state => {
    return {
        alerts: state.alerts,
        clients: state.clients,
        loadingClients: state.loadingClients
     };
};

const INITIAL_STATE = {
    denomination: '', currDenomination: '',
    address: '', currAddress: '',
    address2: '', currAddress2: '',
    city: '', currCity: '',
    state: '', currState: '',
    country: '', currCountry: '',
    zipCode: '', currZipCode: '',
    rfc: '', currRfc: '',
    contact: '', currContact: '',
    email: '', currEmail: '',
    phone: '', currPhone: '',
    website: '', currWebsite: '',
    yearSince: '', currYearSince: '',
    uid: '', currUid: '',
    iva: true, currIva: true,
    validated: false,
    edit: false,
    showModalCliente: false,
    error: null,
    activeIdx: -1,
    searchQuery: ''
};

class Clientes extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.handleCloseCliente = this.handleCloseCliente.bind(this);
        this.handleShowCliente = this.handleShowCliente.bind(this);
        this.handleNewClient = this.handleNewClient.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onChangeRadio = this.onChangeRadio.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onDelete() {
        if(window.confirm('Are you sure you want to delete this client?')) {
            this.props.deleteClient(this.props.clients[this.state.activeIdx].uid);
            this.setState({ activeIdx: -1, edit: false });
        }
    }

    onSave() {
        const { currDenomination, currAddress, currAddress2, currCity, currState, currCountry, currZipCode,
             currRfc, currContact, currEmail, currPhone, currWebsite, currYearSince, currIva, currUid } = this.state;
        const trimmedClient = trimFields({
            currDenomination, currAddress, currAddress2, currCity, currState, currCountry, currZipCode,
            currRfc, currContact, currEmail, currPhone, currWebsite, currYearSince
        }, [
            'currDenomination', 'currAddress', 'currAddress2', 'currCity', 'currState', 'currCountry', 'currZipCode',
            'currRfc', 'currContact', 'currEmail', 'currPhone', 'currWebsite', 'currYearSince'
        ]);

        if(trimmedClient.currDenomination.length === 0) {
            this.props.addAlert(AlertType.Error, "Business name cannot be empty.");
            return;
        }

        if(trimmedClient.currContact.length === 0) {
            this.props.addAlert(AlertType.Error, "Contact cannot be empty.");
            return;
        }

        const payload = {
            address: trimmedClient.currAddress, address2: trimmedClient.currAddress2, city: trimmedClient.currCity, state: trimmedClient.currState,
            country: trimmedClient.currCountry, zipCode: trimmedClient.currZipCode, contact: trimmedClient.currContact, denomination: trimmedClient.currDenomination,
            email: trimmedClient.currEmail, iva: currIva, phone: trimmedClient.currPhone, rfc: trimmedClient.currRfc,
            website: trimmedClient.currWebsite, yearSince: trimmedClient.currYearSince, uid: currUid
        };
        this.props.updateClient(currUid, payload);

        this.setState({ edit: false });
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onChangeRadio() {
        this.setState({ currIva: !this.state.currIva });
    }

    onEdit() {
        this.setState({ edit: true });
    }

    onCancelEdit() {
        const client = this.props.clients[this.state.activeIdx];
        this.handleSelectClient(client, this.state.activeIdx);
    }

    handleNewClient(event) {
        event.preventDefault();
        this.setState({ validated: true });

        const { denomination, address, address2, city, state, country, zipCode,
             rfc, contact, email, phone, website, yearSince } = this.state;
        const trimmedClient = trimFields({
            denomination, address, address2, city, state, country, zipCode,
            rfc, contact, email, phone, website, yearSince
        }, [
            'denomination', 'address', 'address2', 'city', 'state', 'country', 'zipCode',
            'rfc', 'contact', 'email', 'phone', 'website', 'yearSince'
        ]);
        const iva = document.getElementById("yesIVA").checked;

        if(trimmedClient.denomination === "" || trimmedClient.contact === "") return;

        const payload = {
            denomination: trimmedClient.denomination,
            address: trimmedClient.address,
            address2: trimmedClient.address2,
            city: trimmedClient.city,
            state: trimmedClient.state,
            country: trimmedClient.country,
            zipCode: trimmedClient.zipCode,
            rfc: trimmedClient.rfc,
            contact: trimmedClient.contact,
            email: trimmedClient.email,
            phone: trimmedClient.phone,
            website: trimmedClient.website,
            yearSince: trimmedClient.yearSince,
            iva: iva
        };
        this.props.addClient(payload);

        this.setState({ ...INITIAL_STATE });
    }

    handleOnChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleShowCliente() {
        this.setState({ showModalCliente: true });
    }

    handleCloseCliente() {
        this.setState({ showModalCliente: false });
    }

    handleSelectClient = (client, idx) => {
        this.setState({
            activeIdx: idx,
            edit: false,
            currUid: client.uid || '',
            currDenomination: client.denomination || '',
            currAddress: client.address || '',
            currAddress2: client.address2 || '',
            currCity: client.city || '',
            currState: client.state || '',
            currCountry: client.country || '',
            currZipCode: client.zipCode || '',
            currRfc: client.rfc || '',
            currContact: client.contact || '',
            currEmail: client.email || '',
            currPhone: client.phone || '',
            currWebsite: client.website || '',
            currYearSince: client.yearSince || '',
            currIva: client.iva !== undefined ? client.iva : true,
        });
    };

    renderField(label, value, name) {
        const { edit } = this.state;
        return (
            <div className="client-field-row">
                <span className="client-field-label">{label}</span>
                {edit ? (
                    <Form.Control
                        className="client-field-input"
                        value={value || ''}
                        onChange={this.onChange}
                        name={name}
                    />
                ) : (
                    <span className="client-field-value">{value || '—'}</span>
                )}
            </div>
        );
    }

    renderModal() {
        const { denomination, address, address2, rfc, contact, email,
                phone, website, yearSince, city, state, country, zipCode, validated } = this.state;
        return(
            <Modal show={this.state.showModalCliente} onHide={this.handleCloseCliente}>
                <Modal.Header closeButton>
                    <Modal.Title>New client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={this.handleNewClient}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Name </Form.Label>
                            <Col sm="7">
                                <Form.Control isInvalid={validated && trimString(denomination).length === 0} name="denomination" onChange={this.handleOnChange} value={denomination} as="textarea" rows="1" required />
                                <Form.Control.Feedback type="invalid">Name cannot be empty.</Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Address </Form.Label>
                            <Col sm="7">
                                <Form.Control name="address" onChange={this.handleOnChange} value={address} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Address 2 </Form.Label>
                            <Col sm="7">
                                <Form.Control name="address2" onChange={this.handleOnChange} value={address2} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> City </Form.Label>
                            <Col sm="7">
                                <Form.Control name="city" onChange={this.handleOnChange} value={city} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> State </Form.Label>
                            <Col sm="7">
                                <Form.Control name="state" onChange={this.handleOnChange} value={state} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Country </Form.Label>
                            <Col sm="7">
                                <Form.Control name="country" onChange={this.handleOnChange} value={country} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Zip Code </Form.Label>
                            <Col sm="7">
                                <Form.Control name="zipCode" onChange={this.handleOnChange} value={zipCode} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> RFC </Form.Label>
                            <Col sm="7">
                                <Form.Control name="rfc" onChange={this.handleOnChange} value={rfc} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Contact </Form.Label>
                            <Col sm="7">
                                <Form.Control isInvalid={validated && trimString(contact).length === 0} name="contact" onChange={this.handleOnChange} value={contact} as="textarea" rows="1" required />
                                <Form.Control.Feedback type="invalid">Contact cannot be empty.</Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Email </Form.Label>
                            <Col sm="7">
                                <Form.Control name="email" onChange={this.handleOnChange} value={email} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Phone </Form.Label>
                            <Col sm="7">
                                <Form.Control name="phone" onChange={this.handleOnChange} value={phone} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Website </Form.Label>
                            <Col sm="7">
                                <Form.Control name="website" onChange={this.handleOnChange} value={website} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="3"> Client since </Form.Label>
                            <Col sm="7">
                                <Form.Control name="yearSince" onChange={this.handleOnChange} value={yearSince} as="textarea" rows="1" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} >
                            <Form.Label column sm="3"> IVA </Form.Label>
                            <Col sm="7">
                                <div>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="ivaRadio"
                                    id="yesIVA"
                                    defaultChecked
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="ivaRadio"
                                    id="noIVA"
                                />
                                </div>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleCloseCliente}>
                        Cancel
                    </Button>
                    <Button className="legem-primary" type="submit" onClick={this.handleNewClient}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        const { edit, currDenomination, currAddress, currAddress2, currRfc, currContact,
            currEmail, currPhone, currWebsite, currYearSince, currIva, currCity, currState,
            currCountry, currZipCode, searchQuery, activeIdx } = this.state;

        const allClients = this.props.clients || [];
        const filteredClients = allClients.filter(c =>
            (c.denomination || '').toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <AuthUserContext.Consumer>
                {() => (
                    this.props.loadingClients
                        ? <BarLoader css={{width: "100%"}} loading={this.props.loadingClients} />
                        : <div className="clients-page">
                            {this.renderModal()}
                            <div className="clients-layout">

                                {/* LEFT PANEL — client list */}
                                <div className="client-list-panel">
                                    <div className="client-list-header">
                                        <input
                                            type="text"
                                            className="client-search-input"
                                            placeholder="Search clients..."
                                            value={searchQuery}
                                            onChange={e => this.setState({ searchQuery: e.target.value })}
                                        />
                                        <Button className="btn-new-client" onClick={this.handleShowCliente}>
                                            + New client
                                        </Button>
                                    </div>
                                    <div className="client-list-scroll">
                                        {filteredClients.map(client => {
                                            const originalIdx = allClients.findIndex(c => c.uid === client.uid);
                                            return (
                                                <div
                                                    key={client.uid}
                                                    className={`client-list-item${activeIdx === originalIdx ? ' active' : ''}`}
                                                    onClick={() => this.handleSelectClient(client, originalIdx)}
                                                >
                                                    <div className="client-list-avatar">
                                                        {(client.denomination || '?')[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="client-list-name">{client.denomination}</div>
                                                        {client.city
                                                            ? <div className="client-list-secondary">{client.city}</div>
                                                            : null
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* RIGHT PANEL — client detail */}
                                <div className="client-detail-panel">
                                    {activeIdx === -1
                                        ? <div className="client-empty-state">
                                            <p>Select a client to view details</p>
                                          </div>
                                        : <div className="client-card">

                                            {/* HEADER */}
                                            <div className="client-card-header">
                                                <div className="client-avatar-large">
                                                    {(currDenomination || '?')[0].toUpperCase()}
                                                </div>
                                                <div className="client-card-title">
                                                    {edit
                                                        ? <Form.Control
                                                            value={currDenomination}
                                                            onChange={this.onChange}
                                                            name="currDenomination"
                                                            size="lg"
                                                            placeholder="Business name"
                                                          />
                                                        : <h2>{currDenomination}</h2>
                                                    }
                                                </div>
                                                <div className="client-card-actions">
                                                    {edit
                                                        ? <>
                                                            <Button variant="outline-secondary" onClick={() => this.onCancelEdit()}>Cancel</Button>
                                                            <Button className="legem-primary" onClick={this.onSave}>Save</Button>
                                                          </>
                                                        : <Button variant="outline-primary" onClick={this.onEdit}>Edit</Button>
                                                    }
                                                </div>
                                            </div>

                                            {/* ADDRESS */}
                                            <div className="client-section">
                                                <div className="client-section-title">Address</div>
                                                {this.renderField('Address', currAddress, 'currAddress')}
                                                {this.renderField('Address 2', currAddress2, 'currAddress2')}
                                                {this.renderField('City', currCity, 'currCity')}
                                                {this.renderField('State', currState, 'currState')}
                                                {this.renderField('Country', currCountry, 'currCountry')}
                                                {this.renderField('ZIP Code', currZipCode, 'currZipCode')}
                                            </div>

                                            {/* CONTACT */}
                                            <div className="client-section">
                                                <div className="client-section-title">Contact</div>
                                                {this.renderField('Contact', currContact, 'currContact')}
                                                {this.renderField('Email', currEmail, 'currEmail')}
                                                {this.renderField('Phone', currPhone, 'currPhone')}
                                                {this.renderField('Website', currWebsite, 'currWebsite')}
                                            </div>

                                            {/* BUSINESS */}
                                            <div className="client-section">
                                                <div className="client-section-title">Business</div>
                                                {this.renderField('RFC', currRfc, 'currRfc')}
                                                {this.renderField('Client since', currYearSince, 'currYearSince')}
                                                <div className="client-field-row">
                                                    <span className="client-field-label">IVA</span>
                                                    {edit
                                                        ? <div className="client-field-input">
                                                            <Form.Check
                                                                onChange={this.onChangeRadio}
                                                                checked={currIva}
                                                                inline
                                                                name="radioBtn"
                                                                label="Yes"
                                                                type="radio"
                                                                id="currIva"
                                                            />
                                                            <Form.Check
                                                                onChange={this.onChangeRadio}
                                                                checked={!currIva}
                                                                inline
                                                                name="radioBtn"
                                                                label="No"
                                                                type="radio"
                                                                id="currNoIva"
                                                            />
                                                          </div>
                                                        : <span className={`iva-badge ${currIva ? 'yes' : 'no'}`}>
                                                            {currIva ? 'Yes' : 'No'}
                                                          </span>
                                                    }
                                                </div>
                                            </div>

                                            {edit &&
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                                                    <IconButton onClick={this.onDelete} color="secondary" aria-label="delete">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            }

                                        </div>
                                    }
                                </div>

                            </div>
                        </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

Clientes.propTypes = {
    alerts: PropTypes.array,
    clients: PropTypes.array,
    loadingClients: PropTypes.bool,
    addAlert: PropTypes.func,
    clearAlert: PropTypes.func,
    addClient: PropTypes.func,
    updateClient: PropTypes.func,
    deleteClient: PropTypes.func
};

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    clearAlert,
    addAlert,
    addClient,
    updateClient,
    deleteClient
})(withAuthorization(condition)(Clientes));
