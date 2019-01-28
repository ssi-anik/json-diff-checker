import React, { Component } from "react";
import { Container, Grid, Dropdown, Divider } from "semantic-ui-react";
import { DataHolder } from "./DataHolder";
import { Variation } from "./Variation";

class App extends Component {

    options = [
        {
            key: 'key',
            value: 'key',
            text: 'Keys Only',
            icon: 'key'
        },
        {
            key: 'value',
            value: 'value',
            text: 'Values Only',
            icon: 'database'
        },
        {
            key: 'all',
            value: 'all',
            text: 'All Mismatches',
            icon: 'sync'
        },
    ];

    constructor (props) {
        super(props);
        this.state = {
            sourceJson: {},
            destinationJson: {},

            sourceBy: '',
            destinationBy: '',

            sourceDoesNotContain: [],
            destinationDoesNotContain: [],

            sourceParseError: false,
            destinationParseError: false,
        };
        this.leftInputChange = this.leftInputChange.bind(this);
        this.rightInputChange = this.rightInputChange.bind(this);

        this.leftFromUserOnChange = this.leftFromUserOnChange.bind(this);
        this.rightFromUserOnChange = this.rightFromUserOnChange.bind(this);

        this.handleDifferenceDropdown = this.handleDifferenceDropdown.bind(this);
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
        });
    }

    keyDifferenceChecker (source, destination, root = '') {
        let changes = [];
        for ( let key in source ) {
            // destination has the key
            if ( destination[key] !== undefined ) {
                // source and destination keys contain the same type of object and any of them is type of object
                // iterate again.
                /*if (typeof source[key] == typeof destination[key] && typeof destination[key] == typeof {}) {
                    console.log(key);
                    root = root.length > 0 ? root + '.' + key : key;
                    changes.concat(this.keyDifferenceChecker(source[key], destination[key], root));
                }*/
            } else {
                changes.push(key);
            }
        }

        return changes;
    }

    handleDifferenceDropdown (event, data) {
        if ( Object.keys(this.state.sourceJson).length == 0) {
            alert((this.state.sourceBy ? this.state.sourceBy : 'Source') + ' is not set to check');
            return;
        }

        if ( Object.keys(this.state.destinationJson).length == 0 ) {
            alert((this.state.destinationBy ? this.state.destinationBy : 'Destination') + ' is not set to check');
            return;
        }
        // initialize to default
        this.setState({
            sourceDoesNotContain: [],
            destinationDoesNotContain: [],
        })
        switch ( data.value ) {
            case 'value':
                break;
            case 'key':
                let sourceDoesNotContain = this.keyDifferenceChecker(this.state.destinationJson, this.state.sourceJson);
                this.setState({
                    sourceDoesNotContain: sourceDoesNotContain
                });

                let destinationDoesNotContain = this.keyDifferenceChecker(this.state.sourceJson, this.state.destinationJson);
                this.setState({
                    destinationDoesNotContain: destinationDoesNotContain
                });
                break;
            default:
                alert('Invalid changes');
                return;
        }
    }

    render () {
        return (
            <Container fluid style = {{
                paddingLeft: '15px',
                paddingRight: '15px',
                paddingTop: '5px'
            }}>
                <Dropdown onChange = { this.handleDifferenceDropdown } placeholder = 'Difference By' fluid selection options = {this.options} />
                <Divider />
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
                <Divider horizontal> Results Below </Divider>
                <Grid divided = 'vertically'>
                    <Grid.Row columns = {2}>
                        <Grid.Column>
                            {
                                this.state.sourceDoesNotContain && this.state.sourceDoesNotContain instanceof Array && this.state.sourceDoesNotContain.length > 0 ?
                                    <Variation
                                        header = {"Varies from " + (this.state.destinationBy.length ? this.state.destinationBy : 'Server JSON' )}
                                        differences = {this.state.sourceDoesNotContain} /> :
                                    ''
                            }
                        </Grid.Column>
                        <Grid.Column>
                            {
                                this.state.destinationDoesNotContain && this.state.destinationDoesNotContain instanceof Array && this.state.destinationDoesNotContain.length > 0 ?
                                    <Variation
                                        header = {"Varies from " + (this.state.sourceBy.length ? this.state.sourceBy : 'Local JSON' )}
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
