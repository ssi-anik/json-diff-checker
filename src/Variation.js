import React from "react";
import { Container, Grid, Message, List, Label, Popup } from "semantic-ui-react";
import { guess_data_type } from "./common";

export const Variation = ({header, differences}) => {
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

const Parser = ({data}) => {
    return (
        <List bulleted as={'ul'}>
            {
                // flObjKey = first level object key
                Object.keys(data).map((flObjKey) => {
                    let flObject = data[flObjKey];
                    return (
                        <ParseAsList key = {flObjKey} keyName = { flObjKey } data = { flObject } root = {flObjKey} />
                    );
                })
            }
        </List>
    )
}

const ParseAsList = ({ keyName, data, root }) => {
    return (
        <List.Item as = 'li' value = '-'>
            <Popup
                trigger={<Label content={ keyName } />}
                content={ root }
                position='right center'
                inverted
            />
            <List.List as = 'ol'>
                {
                    Object.keys(data).map((key) => {
                        switch ( guess_data_type(key) ) {
                            case 'String':
                                return (
                                    <ParseAsList key = {key} keyName = { key } data = { data[key] } root = {root + '->' + key} />
                                );
                            default:
                                return (
                                    <List.Item value = '-' as = 'li' key = {key}> { data[key] } </List.Item>
                                );
                        }
                    })
                }
            </List.List>
        </List.Item>
    )
}