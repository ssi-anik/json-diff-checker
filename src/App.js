import React, { Component } from "react";
import { Container, Grid, Divider } from "semantic-ui-react";
import { DataHolder } from "./DataHolder";
import { Variation } from "./Variation";
import { guess_data_type } from "./common";

class App extends Component {

    constructor (props) {
        super(props);
        this.state = {
            sourceJson: {},
            destinationJson: {},

            sourceBy: '',
            destinationBy: '',

            sourceDoesNotContain: {},
            destinationDoesNotContain: {},

            sourceParseError: false,
            destinationParseError: false,
        };
        this.leftInputChange = this.leftInputChange.bind(this);
        this.rightInputChange = this.rightInputChange.bind(this);

        this.leftFromUserOnChange = this.leftFromUserOnChange.bind(this);
        this.rightFromUserOnChange = this.rightFromUserOnChange.bind(this);

        this.showDifferences = this.showDifferences.bind(this);
    }

    parseJSON (str) {
        try {
            return JSON.parse(str);
        } catch ( e ) {
            return false;
        }
    }

    leftFromUserOnChange (event) {
        this.setState({
            sourceBy: event.target.value
        })
    }

    rightFromUserOnChange (event) {
        this.setState({
            destinationBy: event.target.value
        })
    }

    leftInputChange (event) {
        let json = this.parseJSON(event.target.value);
        let parseError, source;

        if ( false === json ) {
            parseError = true;
            source = '';
        } else {
            parseError = false;
            source = json;
        }

        this.setState({
            sourceParseError: parseError,
            sourceJson: source
        }, () => {
            this.showDifferences();
        });
    }

    rightInputChange (event) {
        let json = this.parseJSON(event.target.value);
        let parseError, destination;

        if ( false === json ) {
            parseError = true;
            destination = '';
        } else {
            parseError = false;
            destination = json;
        }

        this.setState({
            destinationParseError: parseError,
            destinationJson: destination
        }, () => {
            this.showDifferences();
        });
    }

    getObjectKeys (obj) {
        let missing = {};
        for ( let key in obj ) {
            let i = 0;
            missing[key] = {};

            missing[key][i++] = 'Type assumed: ' + guess_data_type(obj[key]);

            if ( null !== obj[key] && typeof obj[key] === typeof {} && !Array.isArray(obj[key]) ) {
                missing[key] = { ...missing[key], ...this.getObjectKeys(obj[key]) };
            }
        }

        return missing;
    }

    findDifferences (source, destination) {
        let changes = {};
        for ( let key in source ) {
            let i = 0;

            // initialize with empty object
            changes[key] = {};

            if ( destination[key] === undefined ) {
                changes[key][i++] = 'Missing. (' + guess_data_type(source[key]) + ')';

                if ( null !== source[key] && typeof source[key] === typeof {} && !Array.isArray(source[key]) ) {
                    // key not null or  & key is object NOT ARRAY, Fuck JS
                    changes[key] = { ...changes[key], ...this.getObjectKeys(source[key]) };
                }
            } else if ( guess_data_type(source[key]) !== guess_data_type(destination[key]) ) {
                // first add the data type to the bucket
                changes[key][i++] = 'Found Mismatched. (' + guess_data_type(source[key]) + ')';

                if ( null !== source[key] && typeof source[key] === typeof {} && !Array.isArray(source[key]) ) {
                    changes[key] = { ...changes[key], ...this.getObjectKeys(source[key]) };
                }
            } else if ( destination[key] !== undefined ) { // destination has the key
                // source key holds an object, but the destination doesn't hold any object
                if ( !Array.isArray(source[key]) && typeof source[key] === typeof {} && typeof destination[key] !== typeof {} ) {
                    changes[key] = { ...changes[key], ...this.getObjectKeys(source[key]) };
                } else if ( !Array.isArray(source[key]) && typeof source[key] === typeof {} && typeof source[key] === typeof destination[key] ) {
                    changes[key] = { ...changes[key], ...this.findDifferences(source[key], destination[key]) };
                }
            }

            if ( Object.keys(changes[key]).length === 0 ) {
                delete changes[key];
            }
        }

        return changes;
    }

    showDifferences () {
        if ( Object.keys(this.state.sourceJson).length === 0 ) {
            this.setState({
                sourceJson: {}
            });
        }

        if ( Object.keys(this.state.destinationJson).length === 0 ) {
            this.setState({
                destinationJson: {}
            });
        }

        // initialize to default
        this.setState({
            sourceDoesNotContain: [],
            destinationDoesNotContain: [],
        });

        let sourceDoesNotContain = this.findDifferences(this.state.destinationJson, this.state.sourceJson);
        this.setState({
            sourceDoesNotContain: sourceDoesNotContain
        }, () => {
        });

        let destinationDoesNotContain = this.findDifferences(this.state.sourceJson, this.state.destinationJson);
        this.setState({
            destinationDoesNotContain: destinationDoesNotContain
        }, () => {
        });
    }

    render () {
        return (
            <Container fluid style = {{
                paddingLeft: '15px',
                paddingRight: '15px',
                paddingTop: '5px'
            }}>
                <Divider horizontal> JSON Diff Checker by
                    <a href = 'https://github.com/ssi-anik' rel = "noopener noreferrer" target = '_blank'>@ssi-anik</a>
                </Divider>
                <Grid divided = 'vertically'>
                    <Grid.Row columns = {2}>
                        <Grid.Column>
                            <DataHolder hasParseError = {this.state.sourceParseError}
                                        from = {this.state.sourceBy.length > 0 ? this.state.sourceBy : 'Local JSON'}
                                        fromOnChange = {this.leftFromUserOnChange}
                                        onTextAreaChange = {this.leftInputChange}
                                        textarea_placeholder = {this.state.sourceBy.toString().length > 0 ? this.state.sourceBy + "'s JSON" : 'Local JSON'} />
                        </Grid.Column>
                        <Grid.Column>
                            <DataHolder hasParseError = {this.state.destinationParseError}
                                        fromOnChange = {this.rightFromUserOnChange}
                                        from = {this.state.destinationBy.length > 0 ? this.state.destinationBy : 'Server JSON'}
                                        onTextAreaChange = {this.rightInputChange}
                                        textarea_placeholder = {this.state.destinationBy.length > 0 ? this.state.destinationBy + "'s JSON" : 'Server JSON'} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider horizontal> Results shown Below </Divider>
                <Grid divided = 'vertically'>
                    <Grid.Row columns = {2}>
                        <Grid.Column>
                            {
                                this.state.sourceDoesNotContain && Object.keys(this.state.sourceDoesNotContain).length > 0 ?
                                    <Variation
                                        header = {"Differs from " + (this.state.destinationBy.length ? this.state.destinationBy : 'Server JSON' ).toUpperCase()}
                                        differences = {this.state.sourceDoesNotContain} /> :
                                    ''
                            }
                        </Grid.Column>
                        <Grid.Column>
                            {
                                this.state.destinationDoesNotContain && Object.keys(this.state.destinationDoesNotContain).length > 0 ?
                                    <Variation
                                        header = {"Differs from " + (this.state.sourceBy.length ? this.state.sourceBy : 'Local JSON' ).toUpperCase()}
                                        differences = {this.state.destinationDoesNotContain} /> :
                                    ''
                            }

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default App;
