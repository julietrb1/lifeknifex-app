import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  Divider, Form, Input, Label, Radio,
} from 'semantic-ui-react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DatePicker from 'react-datepicker';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import HeaderBar from '../common-components/HeaderBar';

import './GoalForm.scss';
import 'react-datepicker/dist/react-datepicker.min.css';
import { BACKEND_DATE_FORMAT } from '../../constants';
import { firstCase } from '../../Utils';
import { selectGoalById, selectGoalsLoading } from '../../features/goals/goalSelectors';
import { RootState } from '../../redux/rootReducer';
import { createGoal, fetchGoal, updateGoal } from '../../features/goals/goalSlice';
import IGoal from '../../models/IGoal';

interface IGoalFormParams {
  goalId: string;
}

const GoalForm: React.FC = () => {
  const dispatch = useDispatch();
  const { goBack } = useHistory();
  const { goalId } = useParams<IGoalFormParams>();
  const { enqueueSnackbar } = useSnackbar();
  const goal = useSelector((state: RootState) => selectGoalById(state, Number(goalId)));
  const [draftGoal, setDraftGoal] = useState<IGoal>(goal || {
    id: 0,
    url: '',
    question: '',
    test: 'atleast',
    frequency: 1,
    style: 'yesno',
    start_date: moment().format(BACKEND_DATE_FORMAT),
  });
  const isLoading = useSelector(selectGoalsLoading);
  const testInputLabel = `day${goal?.frequency !== 1 ? 's' : ''}`;
  const actionWord = goalId ? 'Edit' : 'New';
  const sections = [
    { name: 'Goals', href: '/goals' },
    { name: actionWord },
  ];

  useEffect(() => {
    if (goalId && !goal) dispatch(fetchGoal(Number(goalId)));
  }, [goal, goalId, dispatch]);

  useEffect(() => {
    if (goal) setDraftGoal(goal);
  }, [goal]);

  const isFormValid = !!(
    draftGoal
    && draftGoal.question && draftGoal.question.length >= 3
    && draftGoal.test
    && draftGoal.style
    && draftGoal.start_date
  );

  const onDateChange = (date: Date) => setDraftGoal({
    ...draftGoal,
    start_date: moment(date).isValid()
      ? moment(date).format(BACKEND_DATE_FORMAT)
      : moment().format(BACKEND_DATE_FORMAT),
  });

  const handleGoalSubmit = async () => {
    draftGoal.question = draftGoal.question.replace(/(\?+)$/g, '');
    draftGoal.question = draftGoal.question.replace(/^((Did I)|(Have I))\s+/gi, '');
    draftGoal.question = firstCase(draftGoal.question, true);

    try {
      if (draftGoal.id) await dispatch(updateGoal(draftGoal));
      else await dispatch(createGoal(draftGoal));
    } catch (e) {
      enqueueSnackbar(`Failed to save goal: ${e.message}`, { variant: 'error' });
    }
  };

  return (
    <div>
      <BreadcrumbSet sections={sections} />
      <HeaderBar title={`${actionWord} Goal`} />
      <Form onSubmit={handleGoalSubmit} loading={isLoading}>
        <Form.Field required>
          <label htmlFor="question">Question</label>
          <Input
            id="question"
            type="text"
            onChange={(e) => setDraftGoal({ ...draftGoal, question: e.target.value })}
            placeholder="Get to bed on time last night"
            value={draftGoal.question}
            labelPosition="right"
          >
            <Label basic>Did I</Label>
            <input />
            <Label>?</Label>
          </Input>
        </Form.Field>
        <Form.Field required>
          <label>Test</label>
        </Form.Field>
        <Form.Field inline>
          <Radio
            label={<label htmlFor="atleast">At least every</label>}
            name="draftGoal-test"
            value="atleast"
            id="atleast"
            checked={draftGoal.test === 'atleast'}
            onChange={(e, d) => setDraftGoal({ ...draftGoal, test: String(d.value) })}
          />
          <Input
            type="number"
            value={draftGoal.frequency}
            className="frequency-input"
            onChange={(e) => setDraftGoal({ ...draftGoal, frequency: Number(e.target.value) })}
            label={{ basic: true, content: testInputLabel }}
            labelPosition="right"
            disabled={draftGoal.test !== 'atleast'}
          />
        </Form.Field>
        <Form.Field inline>
          <Radio
            label={<label htmlFor="nomore">No more than every</label>}
            name="goal-test"
            id="nomore"
            value="nomore"
            checked={draftGoal.test === 'nomore'}
            onChange={(e, d) => setDraftGoal({ ...draftGoal, test: String(d.value) })}
          />
          <Input
            type="number"
            value={draftGoal.frequency}
            onChange={(e) => setDraftGoal({ ...draftGoal, frequency: Number(e.target.value) })}
            label={{ basic: true, content: testInputLabel }}
            className="frequency-input"
            labelPosition="right"
            disabled={draftGoal.test !== 'nomore'}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label={<label htmlFor="never">Never</label>}
            name="goal-test"
            value="never"
            id="never"
            checked={draftGoal.test === 'never'}
            onChange={(e, d) => setDraftGoal({ ...draftGoal, test: String(d.value) })}
          />
        </Form.Field>
        <Divider hidden />

        <Form.Field required>
          <label>Style</label>
        </Form.Field>
        <Form.Field>
          <Radio
            label={<label htmlFor="yesno">Yes/No</label>}
            name="goal-style"
            value="yesno"
            id="yesno"
            checked={draftGoal.style === 'yesno'}
            onChange={(e, d) => setDraftGoal({ ...draftGoal, style: String(d.value) })}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label={<label htmlFor="likert">Likert</label>}
            name="goal-style"
            value="likert"
            id="likert"
            checked={draftGoal.style === 'likert'}
            onChange={(e, d) => setDraftGoal({ ...draftGoal, style: String(d.value) })}
          />
        </Form.Field>
        <Divider hidden />

        <Form.Field required>
          <label>Start Date</label>
        </Form.Field>
        <Form.Field>
          <DatePicker
            dropdownMode="select"
            onChange={onDateChange}
            selected={moment(draftGoal.start_date).toDate()}
            dateFormat="dd/MM/yyyy"
          />
        </Form.Field>

        <Divider hidden />
        <ButtonGroup>
          <Button type="button" variant="outline-primary" onClick={goBack}>Back</Button>
          <Button variant="primary" type="submit" disabled={!isFormValid}>Save Goal</Button>
        </ButtonGroup>
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
