import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import React from 'react';
import {
  FcCalendar, FcCheckmark, FcDeleteDatabase, FcMediumPriority,
} from 'react-icons/all';
import moment from 'moment-timezone';
import { COLOR_GOALS } from '../../constants';
import IGoal from '../../models/IGoal';
import { getAnswerName, getRelativeMoment } from '../../Utils';

interface IGoalCardProps {
  goal: IGoal;
}

const lastAnswered = (goal: IGoal) => {
  if (!goal.last_answered) {
    return (
      <div className="mb-2">
        <FcDeleteDatabase className="mr-2" />
        Never answered
      </div>
    );
  }
  if (moment().isSame(goal.last_answered, 'day')) {
    const answerName = getAnswerName(goal);
    return (
      <div className="mb-2">
        <FcCheckmark className="mr-2" />
        {`Answered ${answerName ? `"${answerName.toLowerCase()}"` : null} today`}
      </div>
    );
  }
  const relativeMoment = getRelativeMoment(goal.last_answered, true);
  return (
    <div className="mb-2">
      <FcMediumPriority className="mr-2" />
      {`Answered ${relativeMoment}`}
    </div>
  );
};

const getGoalMeta = (goal: IGoal) => {
  const { test, frequency } = goal;
  switch (test) {
    case 'atleast':
      if (frequency === 1) {
        return 'Every day';
      }
      return `At least every ${frequency} days`;

    case 'nomore':
      if (frequency === 1) {
        return 'No more than every day';
      }
      return `No more than every ${frequency} days`;

    case 'never':
      return 'Never';
    default:
      return 'Invalid goal target';
  }
};

const AnswerButton = ({ id, last_answered }: IGoal) => {
  const isChange = last_answered && moment().isSame(last_answered, 'day');
  const url = `/goals/answer/${id}`;
  return (
    <Button as={Link} to={url} variant="primary" size="sm">
      {isChange
        ? 'Change'
        : 'Log'}
      {' '}
      Answer
    </Button>
  );
};

const GoalCard: React.FC<IGoalCardProps> = ({ goal }: IGoalCardProps) => (
  <Card key={goal.id} color={COLOR_GOALS} className="goal-card">
    <Card.Header as="h4" className="goal-card-header">
      {goal.question}
    </Card.Header>
    <Card.Body>
      <div className="text-muted">
        {lastAnswered(goal)}
        <FcCalendar className="mr-2" />
        {getGoalMeta(goal)}
      </div>
    </Card.Body>
    <Card.Footer>
      <ButtonGroup>
        {AnswerButton(goal)}
        <Button as={Link} to={`/goals/manage/${goal.id}`} variant="outline-primary" size="sm">
          Edit
          Goal
        </Button>
      </ButtonGroup>
    </Card.Footer>
  </Card>
);

export default GoalCard;
