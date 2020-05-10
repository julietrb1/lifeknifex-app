import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import BreadcrumbSet from "../common-components/BreadcrumbSet";
import HeaderBar from "../common-components/HeaderBar";
import moment from "moment";
import {Button, Divider, Form, Input, Label, Radio} from "semantic-ui-react";
import DatePicker from "react-datepicker";

import './GoalForm.scss';
import 'react-datepicker/dist/react-datepicker.min.css';
import {BACKEND_DATE_FORMAT} from "../../constants";
import {firstCase} from "../../Utils";
import {useHistory, useParams} from 'react-router-dom';
import {selectGoalById, selectGoalsLoading} from "../../features/goals/goalSelectors";
import {RootState} from "../../redux/rootReducer";
import {createGoal, updateGoal} from "../../features/goals/goalSlice";
import IGoal from "../../models/IGoal";

const GoalForm: React.FC = () => {
    const dispatch = useDispatch();
    const {goBack} = useHistory();
    const {goalId} = useParams();
    const goal = useSelector((state: RootState) => selectGoalById(state, goalId));
    const [draftGoal, setDraftGoal] = useState<IGoal>(goal || {
        id: 0,
        url: '',
        question: '',
        test: 'atleast',
        frequency: 1,
        style: 'yesno',
        start_date: moment().format(BACKEND_DATE_FORMAT)
    });
    const isLoading = useSelector(selectGoalsLoading);
    const testInputLabel = `day${goal?.frequency !== 1 ? 's' : ''}`;
    const actionWord = goalId ? 'Edit' : 'New';
    const sections = [
        {name: 'Goals', href: '/goals'},
        {name: actionWord}
    ];

    const isFormValid = !!(
        draftGoal &&
        draftGoal.question && draftGoal.question.length >= 3 &&
        draftGoal.test &&
        draftGoal.style &&
        draftGoal.start_date
    );

    const onDateChange = (date: Date) => setDraftGoal({
        ...draftGoal,
        start_date: moment(date).format(BACKEND_DATE_FORMAT)
    });

    const handleGoalSubmit = () => {
        draftGoal.question = draftGoal.question.replace(/(\?+)$/g, '');
        draftGoal.question = draftGoal.question.replace(/^((Did I)|(Have I))\s+/gi, '');
        draftGoal.question = firstCase(draftGoal.question, true);

        if (draftGoal.id) dispatch(updateGoal(draftGoal));
        else dispatch(createGoal(draftGoal));
        goBack();
    };

    return (
        <div>
            <BreadcrumbSet sections={sections}/>
            <HeaderBar title={`${actionWord} Goal`} icon='draftGoals'/>
            <Form onSubmit={handleGoalSubmit} loading={isLoading}>
                <Form.Field required>
                    <label>Question</label>
                    <Input type='text' onChange={e => setDraftGoal({...draftGoal, question: e.target.value})}
                           placeholder='Get to bed on time last night'
                           value={draftGoal.question} label={{basic: true, content: '?'}}
                           labelPosition='right'>
                        <Label>Did I</Label>
                        <input/>
                        <Label>?</Label>
                    </Input>
                </Form.Field>
                <Form.Field required>
                    <label>Test</label>
                </Form.Field>
                <Form.Field inline>
                    <Radio label='At least every' name='draftGoal-test' value='atleast'
                           checked={draftGoal.test === 'atleast'}
                           onChange={(e, d) => setDraftGoal({...draftGoal, test: String(d.value)})}/>
                    <Input type='number' value={draftGoal.frequency} className='frequency-input'
                           onChange={e => setDraftGoal({...draftGoal, frequency: Number(e.target.value)})}
                           label={{basic: true, content: testInputLabel}}
                           labelPosition='right' disabled={draftGoal.test !== 'atleast'}/>
                </Form.Field>
                <Form.Field inline>
                    <Radio label='No more than every' name='goal-test' value='nomore'
                           checked={draftGoal.test === 'nomore'}
                           onChange={(e, d) => setDraftGoal({...draftGoal, test: String(d.value)})}/>
                    <Input type='number' value={draftGoal.frequency}
                           onChange={e => setDraftGoal({...draftGoal, frequency: Number(e.target.value)})}
                           label={{basic: true, content: testInputLabel}} className='frequency-input'
                           labelPosition='right' disabled={draftGoal.test !== 'nomore'}/>
                </Form.Field>
                <Form.Field>
                    <Radio label='Never' name='goal-test' value='never' checked={draftGoal.test === 'never'}
                           onChange={(e, d) => setDraftGoal({...draftGoal, test: String(d.value)})}/>
                </Form.Field>
                <Divider hidden/>

                <Form.Field required>
                    <label>Style</label>
                </Form.Field>
                <Form.Field>
                    <Radio label='Yes/No' name='goal-style' value='yesno'
                           checked={draftGoal.style === 'yesno'}
                           onChange={(e, d) => setDraftGoal({...draftGoal, style: String(d.value)})}/>
                </Form.Field>
                <Form.Field>
                    <Radio label='Likert' name='goal-style' value='likert'
                           checked={draftGoal.style === 'likert'}
                           onChange={(e, d) => setDraftGoal({...draftGoal, style: String(d.value)})}/>
                </Form.Field>
                <Divider hidden/>

                <Form.Field required>
                    <label>Start Date</label>
                </Form.Field>
                <Form.Field>
                    <DatePicker dropdownMode='select' onChange={onDateChange}
                                selected={moment(draftGoal.start_date).toDate()} dateFormat='dd/MM/yyyy'/>
                </Form.Field>

                <Divider hidden/>
                <Button.Group>
                    <Button type='button' onClick={goBack}>Back</Button>
                    <Button.Or/>
                    <Button positive type="submit" disabled={!isFormValid}>Save Goal</Button>
                </Button.Group>
            </Form>
        </div>
    );
};

// componentDidUpdate(prevProps: Readonly<Props>) {
//     const previousGoal = Object.values(prevProps.goals).find(goal => goal.id === goalId);
//     const goal = Object.values(goals).find(goal => goal.id === goalId);
//     if (!previousGoal && goal) {
//         setState({goal});
//     }
// }

export default GoalForm;