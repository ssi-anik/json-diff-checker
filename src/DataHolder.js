import React from "react";
import { Container, Message, TextArea, Input, Form, Label } from "semantic-ui-react";

export const DataHolder = (props) => {
    return (
        <Container>
            <Message info>
                <Form>
                    <Input fluid labelPosition={'left'} placeholder = {props.from}>
                        <Label color = 'green'>From</Label>
                        <input onChange={ props.fromOnChange } />
                    </Input>
                </Form>
            </Message>
            <Form>
                <Form.Field
                    rows = {20}
                    error = {props.hasParseError && (true === props.hasParseError)}
                    control = {TextArea}
                    placeholder = {props.textarea_placeholder}
                    onChange = {(event) => props.onTextAreaChange(event)}
                />
            </Form>
        </Container>
    );
}