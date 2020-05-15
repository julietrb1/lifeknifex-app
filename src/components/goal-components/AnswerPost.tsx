import React from 'react';
import { Button, Divider, Form, Radio, } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import IGoal from '../../models/IGoal';

const yesNoAnswerSet = [
  { label: 'Yes', value: 1 }, { label: 'No', value: 2 },
];

const likertAnswerSet = [
  { label: 'Effectively', value: 1 }, { label: 'Adequately', value: 2 },
  { label: 'Poorly', value: 3 }, { label: 'Unsuccessfully', value: 4 },
];

const BackButton = (isStart: boolean | null, goBack: any, mode: string) => {
  const history = useHistory();
  if (mode === 'post') {
    return <Button disabled={isStart || false} type="button" onClick={goBack}>Back</Button>;
  }
  return (
    <Button
      type="button"
      onClick={history.goBack}
    >
      Cancel
    </Button>
  );
};

const NextButton = (mode: string, isEnd: boolean | null, checkedValue: number | null) => {
  if (mode === 'post' && !isEnd) {
    return <Button type="submit">Next</Button>;
  } if (mode === 'post' && isEnd) {
    return <Button positive type="submit">Finish</Button>;
  }
  return <Button disabled={!checkedValue} positive type="submit">Finish</Button>;
};

export interface IAnswerPostProps {
  goal: IGoal;
  checkedValue: number | null;
  onAnswer: (answer: number) => any;
  isStart: boolean | null;
  isEnd: boolean | null;
  mode: 'post' | 'single';
  goBack: () => any;
}

const AnswerPost: React.FC<IAnswerPostProps> = (
  {
    goal, checkedValue, onAnswer, isEnd, isStart, mode, goBack,
  }: IAnswerPostProps,
) => {
  const answerSet = goal.style === 'yesno' ? yesNoAnswerSet : likertAnswerSet;
  return (
    <div>
      <Form.Group inline>
        {answerSet.map((item) => (
          <Form.Field
            key={item.value}
            control={Radio}
            label={item.label}
            value={item.value}
            name="goal-value"
            checked={checkedValue === item.value}
            onChange={() => onAnswer(item.value)}
          />
        ))}
      </Form.Group>
      <Divider hidden />
      <Button.Group>
        {BackButton(isStart, goBack, mode)}
        <Button.Or />
        {NextButton(mode, isEnd, checkedValue)}
      </Button.Group>
    </div>
  );
};

export default AnswerPost;
