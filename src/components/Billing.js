import React, { Component } from 'react';
import Select from 'react-select';
import { Form, Row, Col, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { AuthUserContext, withAuthorization } from './Auth';
import { connect } from 'react-redux';
import {  } from "../redux/actions/index";
import {
    Document,
    Paragraph,
    Media,
    Header,
    Packer,
    Footer,
    PageNumber,
    TextRun,
    AlignmentType
} from "docx";
import { saveAs } from "file-saver";

const mapStateToProps = state => {
    return { 
        file: state.file
     };
};

class billing extends Component {
    constructor(props) {
        super(props);
    }

    generateHeader = (image1) => {
        return new Header({
            children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [image1]
            })],
        });
    }

    generateFooter = () => {
        return new Footer({
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            children: [PageNumber.CURRENT],
                            font: "Arial"
                        })
                    ]
                })
            ]
        });
    }

    generateDoc = async(event) => {
        event.preventDefault();
        // Get image for header
        const doc = new Document();
        const blob = await fetch("https://raw.githubusercontent.com/valeriaconde/billingTimingSystem/master/public/invHead.png").then(r => r.blob());
        const image1 = Media.addImage(doc, blob, 790, 135, {
            floating: {
                horizontalPosition: {
                    offset: 0,
                },
                verticalPosition: {
                    offset: 0,
                },
                margins: {
                    top: 0,
                    bottom: 10,
                    left: 5,
                    right: 5
                }
            }
        });
        
        // Create doc
        doc.addSection({
            headers: {
                default: this.generateHeader(image1)
            },
            children: [new Paragraph("Hello World")],
            footers: {
                default: this.generateFooter()
            }
        });

        // Save doc
        Packer.toBlob(doc).then(blob => {
            console.log(blob);
            saveAs(blob, "MyDoc.docx");
            console.log("Document created successfully");
        });
    }

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser =>
                    <div>
                        <h4 className="blueLetters topMargin leftMargin"> New notice </h4>

                        {/* CHOOSE CLIENT */}
                        <Form className="leftMargin topMargin">
                            <Form.Group as={Row}>
                                <Form.Label column sm="3"> Client </Form.Label>
                                <Col sm="7">
                                    <Select />
                                </Col>
                            </Form.Group>

                            {/* CHOOSE PROJECTS */}
                            <Form.Group as={Row}>
                                <Form.Label column sm="3"> Projects: </Form.Label>
                            </Form.Group>

                            <Form.Group className="leftMargin">
                                <div key="checbox" className="mb-3">
                                    <Form.Check type="checkbox" id="checkbox" label="checkbox" />
                                </div>
                            </Form.Group>


                            {/* CHOOSE LANGUAGE OF NOTICE */}
                            <Form.Group as={Row} className="topMargin">
                                <Form.Label column sm="3"> Language of notice </Form.Label>
                                <Col sm="7">
                                    <ButtonToolbar className="justify-content-between ">
                                        <ButtonGroup toggle>
                                            <Button variant="light">EN</Button>
                                            <Button variant="light">ES</Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                </Col>
                            </Form.Group>

                            <Button className="legem-primary" type="submit" onClick={this.generateDoc}> Generate charge notice </Button>
                            <Button className="legem-primary" type="submit"> Download </Button>

                        </Form>


                    </div>
                }
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;
export default connect(mapStateToProps, {
    
})(withAuthorization(condition)(billing));