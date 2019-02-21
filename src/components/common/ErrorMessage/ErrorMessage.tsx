import React from 'react';
import {Message} from "semantic-ui-react";
import PropTypes from 'prop-types';

const ErrorMessage = props => {
    if (typeof props.content === 'string') {
        return <Message error header={props.header} content={props.content}/>;
    } else if (Array.isArray(props.content)) {
        return <Message error header={props.header} list={props.content}/>;
    } else {
        throw new Error('Incompatible content provided as error message. Must be either string or array.');
    }
};

ErrorMessage.propTypes = {
    content: PropTypes.any.isRequired,
    header: PropTypes.string.isRequired
};

export default ErrorMessage;