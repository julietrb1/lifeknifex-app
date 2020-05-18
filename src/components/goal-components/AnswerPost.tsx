import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useHistory } from 'react-router-dom';
import IGoal from '../../models/IGoal';
import { likertAnswerSet, yesNoAnswerSet } from '../../constants';

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
    return <Button variant="primary" type="submit">Next</Button>;
  }
  if (mode === 'post' && isEnd) {
    return <Button variant="primary" type="submit">Finish</Button>;
  }
  return <Button disabled={!checkedValue} variant="primary" type="submit">Finish</Button>;
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
      <Form.Group>
        <ButtonGroup>
          {answerSet.map(({ label, value }) => (
            <ToggleButton
              type="radio"
              key={value}
              value={value}
              id={`post_${value}`}
              name="goal-value"
              checked={checkedValue === value}
              onChange={() => onAnswer(value)}
            >
              {label}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Form.Group>
      <ButtonGroup>
        {BackButton(isStart, goBack, mode)}
        <Button/>
        {NextButton(mode, isEnd, checkedValue)}
      </ButtonGroup>
    </div>
  );
};

export default AnswerPost;
