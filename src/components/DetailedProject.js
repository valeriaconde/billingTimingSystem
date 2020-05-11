import React, { Component } from 'react';
import { } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

class detailedProject extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    <div>
                        <h3 className="blueLetters topMargin leftMargin">Titulo del proyecto </h3>
                        
                        <div className="tableMargins">
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Registered expenses</b></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell> VCN - Vuelo NYC</TableCell>
                                            <TableCell className="centerText"> 8000</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell> OCM - Pago de peritos</TableCell>
                                            <TableCell className="centerText" >6000 </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>LLM - Multa IMMEX  </TableCell>
                                            <TableCell className="centerText">900</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell> Total expenses  </TableCell>
                                            <TableCell className="centerText">14,900</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <div className="tableMargins topMargin">
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Registered time</b></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell> VCN - Revision de contrato</TableCell>
                                            <TableCell className="centerText"> 15m</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell> OCM - Negociacion JCA </TableCell>
                                            <TableCell className="centerText" >2h 30m </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>LLM - Viaje </TableCell>
                                            <TableCell className="centerText">3h</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Total time </TableCell>
                                            <TableCell className="centerText">5h 45m</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(detailedProject);