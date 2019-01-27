import React from "react";
import { Container, Grid, Message, List } from "semantic-ui-react";

export const Variation = (props) => {
    return (
        <Container>
            <Grid.Column>
                <Message>
                    <Message.Header as = "h3">{ props.header }</Message.Header>
                    <List bulleted>
                        {
                            props.differences.map((item, index) => {
                                return (<List.Item key = {index}>
                                    {item}
                                </List.Item>)
                            })
                        }
                    </List>
                </Message>
            </Grid.Column>
        </Container>
    )
}