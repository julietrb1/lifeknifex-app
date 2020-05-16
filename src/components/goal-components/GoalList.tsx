import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Divider, Header, Icon, Statistic, } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import HeaderBar from '../common-components/HeaderBar';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import { COLOR_GOALS } from '../../constants';
import PlaceholderSet from '../common-components/PlaceholderSet';
import { getAnswerName, getRelativeMoment } from '../../Utils';
import GoalsEmpty from './GoalsEmpty';

import './Goals.scss';
import CommonStatistic from '../common-components/CommonStatistic';
import IGoal from '../../models/IGoal';
import {
  selectAllGoals,
  selectGoalResponse,
  selectGoalsLoaded,
  selectGoalsLoading,
} from '../../features/goals/goalSelectors';
import { fetchAllGoals } from '../../features/goals/goalSlice';

const sections = [
  { name: 'Goals' },
];

const GoalList: React.FC = () => {
  const dispatch = useDispatch();
  const goals = useSelector(selectAllGoals);
  const goalsResponse = useSelector(selectGoalResponse);
  const isLoading = useSelector(selectGoalsLoading);
  const isLoaded = useSelector(selectGoalsLoaded);

  useEffect(() => {
    if (!isLoaded) dispatch(fetchAllGoals());
  }, [isLoaded, dispatch]);

  const getGoalToAnswerCount = (
  ) => Object.values(goals).filter((goal) => !goal.todays_answer).length;

  const DashboardContent = () => (
    <div>
      <Statistic.Group>
        <CommonStatistic count={Number(goalsResponse?.count)} label="Goals" />
        <CommonStatistic count={getGoalToAnswerCount()} label="To answer" />
      </Statistic.Group>
    </div>
  );

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

  const NewButton = () => (
    <Button
      basic
      as={Link}
      to="/goals/new"
      animated="vertical"
    >
      <Button.Content visible>New Goal</Button.Content>
      <Button.Content hidden>
        <Icon name="plus" />
      </Button.Content>
    </Button>
  );

  const AnswerButton = (goal: IGoal) => {
    const isChange = goal.last_answered && moment().isSame(goal.last_answered, 'day');
    const url = `/goals/answer/${goal.id}`;
    return (
      <Button size="tiny" basic as={Link} to={url} color={COLOR_GOALS}>
        {isChange
          ? 'Change'
          : 'Log'}
        {' '}
        Answer
      </Button>
    );
  };

  const LastAnswered = (goal: IGoal) => {
    if (!goal.last_answered) {
      return (
        <div>
          <Icon name="exclamation triangle" color="orange"/>
          Never answered
        </div>
      );
    }
    if (moment().isSame(goal.last_answered, 'day')) {
      const answerName = getAnswerName(goal);
      return (
        <div>
          <Icon name="check circle" color="green"/>
          Answered
          {' '}
          {answerName ? `"${answerName.toLowerCase()}"` : null}
          {' '}
          today
        </div>
      );
    }
    const relativeMoment = getRelativeMoment(goal.last_answered, true);
    return (
      <div>
        <Icon name="exclamation triangle" color="orange" />
        Last answered
        {' '}
        {relativeMoment}
      </div>
    );
  };

  const GoalCard = (goal: IGoal) => (
    <Card key={goal.id} color={COLOR_GOALS}>
      <Card.Content>
        <Card.Header as="h3">{goal.question}</Card.Header>
        <Card.Meta>{getGoalMeta(goal)}</Card.Meta>
        <Card.Description>
          {LastAnswered(goal)}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div>
          {AnswerButton(goal)}
          <Button size="tiny" basic as={Link} to={`/goals/manage/${goal.id}`}>Edit Goal</Button>
        </div>
      </Card.Content>
    </Card>
  );

  const GoalsContent = () => {
    if (isLoading) {
      return <PlaceholderSet/>;
    }
    if (Object.keys(goals).length) {
      return (
        <Card.Group stackable>
          {Object.values(goals).map(GoalCard)}
        </Card.Group>
      );
    }
    return <GoalsEmpty/>;
  };

  const AnsweringButton = () => {
    const anyAnswered = Object.values(goals).some((goal) => !!goal.todays_answer);
    const allAnswered = Object.values(goals).every((goal) => !!goal.todays_answer);
    const url = '/goals/answer';
    let text;
    if (allAnswered) {
      text = 'Change Answers';
    } else if (anyAnswered) {
      text = 'Continue Answering';
    } else {
      text = 'Start Answering';
    }

    return (
      <Button
        color={COLOR_GOALS}
        as={Link}
        to={url}
        animated="vertical"
      >
        <Button.Content visible>{text}</Button.Content>
        <Button.Content hidden>
          <Icon name="sticky note" />
        </Button.Content>
      </Button>
    );
  };

  return (
    <div>
      <BreadcrumbSet sections={sections} />
      <HeaderBar title="Goals" icon="goals" />

      <Divider horizontal>
        <Header as="h4">Dashboard</Header>
      </Divider>
      <DashboardContent />

      <Divider hidden />

      <Divider horizontal>
        <Header as="h4">Goal Library</Header>
      </Divider>
      <div className="goal-actions">
        <NewButton />
        <AnsweringButton />
      </div>
      <GoalsContent />
    </div>
  );
};

export default GoalList;
