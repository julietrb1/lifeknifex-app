import React from 'react';
import PropTypes from 'prop-types';
import {Button, Divider, Form, Radio} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";

const yesNoAnswerSet = [
    {label: 'Yes', value: 1}, {label: 'No', value: 2},
];

const likertAnswerSet = [
    {label: 'Effectively', value: 1}, {label: 'Adequately', value: 2},
    {label: 'Poorly', value: 3}, {label: 'Unsuccessfully', value: 4},
];

const AnswerPost = props => {
    const answerSet = props.goal.style === 'yesno' ? yesNoAnswerSet : likertAnswerSet;
    return <div>
        <Form.Group inline>
            {answerSet.map(item => <Form.Field
                key={item.value}
                control={Radio}
                label={item.label}
                value={item.value}
                name='goal-value'
                checked={props.checkedValue === item.value}
                onChange={() => props.onAnswer(item.value)}/>)}
        </Form.Group>
        <Divider hidden/>
        <Button.Group>
            <Button onClick={props.history.goBack}>Cancel</Button>
            <Button.Or/>
            <Button positive type="submit">Save Answer</Button>
        </Button.Group>
    </div>;
};

AnswerPost.propTypes = {
    goal: PropTypes.object.isRequired,
    checkedValue: PropTypes.number,
    onAnswer: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};

export default withRouter(AnswerPost);