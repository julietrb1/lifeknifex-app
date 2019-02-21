import React from 'react';
import {Message} from "semantic-ui-react";
import {IErrorMessageProps} from "./IErrorMessageProps";

const ErrorMessage: React.FC<IErrorMessageProps> = props => {
    if (typeof props.content === 'string') {
        return <Message error header={props.header} content={props.content}/>;
    } else if (Array.isArray(props.content)) {
        return <Message error header={props.header} list={props.content}/>;
    } else {
        throw new Error('Incompatible content provided as error message. Must be either string or array.');
    }
};

export default ErrorMessage;