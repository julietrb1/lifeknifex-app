import React from 'react';
import {Button, Divider, Form, Radio} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";
import {RouteComponentProps} from "react-router";

const yesNoAnswerSet = [
    {label: 'Yes', value: 1}, {label: 'No', value: 2},
];

const likertAnswerSet = [
    {label: 'Effectively', value: 1}, {label: 'Adequately', value: 2},
    {label: 'Poorly', value: 3}, {label: 'Unsuccessfully', value: 4},
];

const BackButton = (isStart: boolean | null, goBack: any, history: any, mode: string) => {
    if (mode === 'post') {
        return <Button disabled={isStart || false} type='button' onClick={goBack}>Back</Button>;
    } else {
        return <Button type='button'
                       onClick={history.goBack}>Cancel</Button>;
    }
};

const NextButton = (mode: string, isEnd: boolean | null, checkedValue: number | null) => {
    if (mode === 'post' && !isEnd) {
        return <Button type="submit">Next</Button>;
    } else if (mode === 'post' && isEnd) {
        return <Button positive type="submit">Finish</Button>;
    } else {
        return <Button disabled={!checkedValue} positive type="submit">Finish</Button>;
    }
};

export interface IAnswerPostProps extends RouteComponentProps {
    goal: any;
    checkedValue: number | null;
    onAnswer: (answer: number) => any;
    isStart: boolean | null;
    isEnd: boolean | null;
    mode: 'post' | 'single';
    goBack: () => any;
}

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