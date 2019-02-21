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

const BackButton = props => {
    if (props.mode === 'post') {
        return <Button disabled={props.isStart} type='button' onClick={props.goBack}>Back</Button>;
    } else {
        return <Button type='button'
                       onClick={props.history.goBack}>Cancel</Button>;
    }
};

const NextButton = props => {
    if (props.mode === 'post' && !props.isEnd) {
        return <Button type="submit">Next</Button>;
    } else if (props.mode === 'post' && props.isEnd) {
        return <Button positive type="submit">Finish</Button>;
    } else {
        return <Button disabled={!props.checkedValue} positive type="submit">Finish</Button>;
    }
};

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
            <BackButton {...props}/>
            <Button.Or/>
            <NextButton {...props}/>
        </Button.Group>
    </div>;
};

AnswerPost.propTypes = {
    goal: PropTypes.object.isRequired,
    checkedValue: PropTypes.number,
    onAnswer: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(['single', 'post']).isRequired,
    isStart: PropTypes.bool,
    isEnd: PropTypes.bool,
    goBack: PropTypes.func.isRequired
};

export default withRouter(AnswerPost);