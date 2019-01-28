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

            differenceType: 'key',

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

    getObjectKeys (obj, root = '') {
        let keys = [];
        for ( let key in obj ) {
            let missingKey = root.length ? root + '[' + key + ']' : key;
            if ( typeof obj[key] == typeof {} ) {
                keys = keys.concat(this.getObjectKeys(obj[key], missingKey));
            } else {
                keys.push(missingKey);
            }
        }

        return keys;
    }

    differenceByKey (source, destination, root = '') {
        let changes = [];
        for ( let key in source ) {
            let missingKey = root.length ? root + '[' + key + ']' : key;
            // destination has the key
            if ( destination[key] !== undefined ) {
                // source key holds an object, but the destination doesn't hold any object
                if ( typeof source[key] === typeof {} && typeof destination[key] !== typeof {} ) {
                    changes = changes.concat(this.getObjectKeys(source[key], missingKey));
                } else if ( typeof source[key] === typeof {} && typeof source[key] === typeof destination[key] ) {
                    changes = changes.concat(this.differenceByKey(source[key], destination[key], missingKey));
                }
            } else {
                if ( typeof source[key] === typeof {} ) {
                    changes = changes.concat(this.getObjectKeys(source[key], missingKey));
                } else {
                    changes.push(missingKey);
                }
            }
        }

        return changes;
    }

    showDifferences () {
        let type = this.state.differenceType;

        if ( type.length === 0 ) {
            return;
        }

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

        switch ( type ) {
            case 'value':
                break;
            case 'key':
                let sourceDoesNotContain = this.differenceByKey(this.state.destinationJson, this.state.sourceJson);
                this.setState({
                    sourceDoesNotContain: sourceDoesNotContain
                });
                let destinationDoesNotContain = this.differenceByKey(this.state.sourceJson, this.state.destinationJson);
                this.setState({
                    destinationDoesNotContain: destinationDoesNotContain
                });
                break;
            default:
                return;
        }
    }

    handleDifferenceDropdown (event, { value }) {
        this.setState({
            differenceType: value
        }, () => {
            this.showDifferences();
        });
    }

    render () {
        return (
            <Container fluid style = {{
                paddingLeft: '15px',
                paddingRight: '15px',
                paddingTop: '5px'
            }}>
                <Dropdown
                    onChange = { this.handleDifferenceDropdown }
                    placeholder = 'Difference By'
                    icon = 'sync alternate'
                    fluid
                    labeled
                    button
                    className = 'icon'
                    selection
                    defaultValue={'key'}
                    options = {this.options} />
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
                <Divider horizontal> Results shown Below </Divider>
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
