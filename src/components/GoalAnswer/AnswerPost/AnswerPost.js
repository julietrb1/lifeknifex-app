import React from 'react';
import PropTypes from 'prop-types';
import {Form, Radio} from 'semantic-ui-react';

const AnswerPost = props => {
    if (props.goal.style === 'yesno') {
        return <Form.Group inline>
            <Form.Field
                control={Radio}
                label='Yes'
                value='1'
                name='goal-value'
                checked={props.checkedValue === 1}
                onChange={() => props.onAnswer(1)}/>
            <Form.Field
                control={Radio}
                label='No'
                value='2'
                name='goal-value'
                checked={props.checkedValue === 2}
                onChange={() => props.onAnswer(2)}/>
        </Form.Group>;
    } else {
        return <Form.Group inline>
            <Form.Field
                control={Radio}
                label='Effectively'
                value='1'
                name='goal-value'
                checked={props.checkedValue === 1}
                onChange={() => props.onAnswer(1)}/>
            <Form.Field
                control={Radio}
                label='Adequately'
                value='2'
                name='goal-value'
                checked={props.checkedValue === 2}
                onChange={() => props.onAnswer(2)}/>
            <Form.Field
                control={Radio}
                label='Poorly'
                value='3'
                name='goal-value'
                checked={props.checkedValue === 3}
                onChange={() => props.onAnswer(3)}/>
            <Form.Field
                control={Radio}
                label='Unsuccessfully'
                value='4'
                name='goal-value'
                checked={props.checkedValue === 4}
                onChange={() => props.onAnswer(4)}/>
        </Form.Group>;
    }
};

AnswerPost.propTypes = {
    goal: PropTypes.object.isRequired,
    checkedValue: PropTypes.number,
    onAnswer: PropTypes.func.isRequired
};

export default AnswerPost;