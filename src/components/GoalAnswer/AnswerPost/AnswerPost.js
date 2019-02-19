import React from 'react';
import PropTypes from 'prop-types';
import {Form, Radio} from 'semantic-ui-react';

const yesNoAnswerSet = [
    {label: 'Yes', value: 1}, {label: 'No', value: 2},
];

const likertAnswerSet = [
    {label: 'Effectively', value: 1}, {label: 'Adequately', value: 2},
    {label: 'Poorly', value: 3}, {label: 'Unsuccessfully', value: 4},
];

const AnswerPost = props => {
    const answerSet = props.goal.style === 'yesno' ? yesNoAnswerSet : likertAnswerSet;
    return <Form.Group inline>
        {answerSet.map(item => <Form.Field
            key={item.value}
            control={Radio}
            label={item.label}
            value={item.value}
            name='goal-value'
            checked={props.checkedValue === item.value}
            onChange={() => props.onAnswer(item.value)}/>)}
    </Form.Group>;
};

AnswerPost.propTypes = {
    goal: PropTypes.object.isRequired,
    checkedValue: PropTypes.number,
    onAnswer: PropTypes.func.isRequired
};

export default AnswerPost;