import React from 'react';
import {Button, Divider, Form, Radio} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import {IAnswerPostProps} from "./IAnswerPostProps";

const yesNoAnswerSet = [
    {label: 'Yes', value: 1}, {label: 'No', value: 2},
];

const likertAnswerSet = [
    {label: 'Effectively', value: 1}, {label: 'Adequately', value: 2},
    {label: 'Poorly', value: 3}, {label: 'Unsuccessfully', value: 4},
];

const BackButton = (isStart: boolean, goBack: any, history: any, mode: string) => {
    if (mode === 'post') {
        return <Button disabled={isStart} type='button' onClick={goBack}>Back</Button>;
    } else {
        return <Button type='button'
                       onClick={history.goBack}>Cancel</Button>;
    }
};

const NextButton = (mode: string, isEnd: boolean, checkedValue: number) => {
    if (mode === 'post' && !isEnd) {
        return <Button type="submit">Next</Button>;
    } else if (mode === 'post' && isEnd) {
        return <Button positive type="submit">Finish</Button>;
    } else {
        return <Button disabled={!checkedValue} positive type="submit">Finish</Button>;
    }
};

const AnswerPost: React.FC<IAnswerPostProps> = props => {
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
            {BackButton(props.isStart, props.goBack, props.history, props.mode)}
            <Button.Or/>
            {NextButton(props.mode, props.isEnd, props.checkedValue)}
        </Button.Group>
    </div>;
};

export default withRouter(AnswerPost);