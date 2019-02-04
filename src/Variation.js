import React from "react";
import { Container, Grid, Message, List, Label, Popup } from "semantic-ui-react";
import { guess_data_type } from "./common";

const separator = ' → ';

export const Variation = ({ header, differences }) => {
    return (
        <Container>
            <Grid.Column>
                <Message>
                    <Message.Header as = 'h3'>{ header }</Message.Header>
                    <Parser data = {differences} />
                </Message>
            </Grid.Column>
        </Container>
    );
}

const Parser = ({ data }) => {
    return (
        <List bulleted as = {'ul'}>
            {
                // flObjKey = first level object key
                Object.keys(data).map((flObjKey) => {
                    let flObject = data[flObjKey];
                    return (
                        <ParseAsList key = {flObjKey} keyName = { flObjKey } data = { flObject } root = {'rootObject' + separator + flObjKey} />
                    );
                })
            }
        </List>
    )
}

const ParseAsList = ({ keyName, data, root }) => {
    return (
        <List.Item as = 'li' value = '-' style = {{ paddingTop: '5px' }}>
            <Popup
                trigger = {<Label content = { keyName } />}
                content = { root }
                position = 'right center'
                inverted
            />
            <List.List as = 'ol'>
                {
                    Object.keys(data).map((key) => {
                        let keyType = guess_data_type(key);

                        // method assumes each quoted data as string.
                        // is it actually string? cast it to integer intentionally.
                        if ( keyType === 'String' && !isNaN(key) ) {
                            keyType = 'Integer';
                        }

                        let dataType = guess_data_type(data[key]);
                        if ( ('String' === keyType) || ('Integer' === keyType && ('Array' === dataType || 'Object' === dataType)) ) {
                            return (
                                <ParseAsList key = {key} keyName = { key } data = { data[key] } root = {root + separator + key} />
                            );
                        } else {
                            return (
                                <List.Item value = '-' as = 'li' key = {key} style = {{ paddingTop: '5px' }}> { data[key] } </List.Item>
                            );
                        }
                    })
                }
            </List.List>
        </List.Item>
    )
}