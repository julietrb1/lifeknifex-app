import React from 'react';
import {Form} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {COLOR_GOALS} from "../../../constants";

const AnswerPre = props => {
    if (props.goal.style === 'yesno') {
        return <div>
            <Form.Button fluid basic color={COLOR_GOALS} onClick={() => props.onAnswer(1)}>Yes</Form.Button>
            <Form.Button fluid basic color={COLOR_GOALS} onClick={() => props.onAnswer(2)}>No</Form.Button>
        </div>;
    } else {
        return <div>
            <Form.Button fluid basic color={COLOR_GOALS} onClick={() => props.onAnswer(1)}>Effectively</Form.Button>
            <Form.Button fluid basic color={COLOR_GOALS} onClick={() => props.onAnswer(2)}>Adequately</Form.Button>
            <Form.Button fluid basic color={COLOR_GOALS} onClick={() => props.onAnswer(3)}>Poorly</Form.Button>
            <Form.Button fluid basic color={COLOR_GOALS} onClick={() => props.onAnswer(4)}>Unsuccessfully</Form.Button>
        </div>;
    }
};

AnswerPre.propTypes = {
    goal: PropTypes.object.isRequired,
    onAnswer: PropTypes.func.isRequired
};

export default AnswerPre;