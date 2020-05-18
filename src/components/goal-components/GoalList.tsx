import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Link } from 'react-router-dom';
import HeaderBar from '../common-components/HeaderBar';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import PlaceholderSet from '../common-components/PlaceholderSet';
import GoalsEmpty from './GoalsEmpty';

import './GoalList.scss';
import {
  selectAllGoals,
  selectGoalsLoaded,
  selectGoalsLoading,
} from '../../features/goals/goalSelectors';
import { fetchAllGoals } from '../../features/goals/goalSlice';
import GoalCard from './GoalCard';
import { BsPlusCircleFill } from 'react-icons/all';
import GoalDashboard from '../common-components/GoalDashboard';

const sections = [
  { name: 'Goals' },
];

const GoalList: React.FC = () => {
  const dispatch = useDispatch();
  const goals = useSelector(selectAllGoals);
  const isLoading = useSelector(selectGoalsLoading);
  const isLoaded = useSelector(selectGoalsLoaded);

  useEffect(() => {
    if (!isLoaded) dispatch(fetchAllGoals());
  }, [isLoaded, dispatch]);

  const NewButton = () => (
    <Button
      as={Link}
      to="/goals/new"
      variant="outline-primary"
    >
      <BsPlusCircleFill className="mr-2"/>
      New Goal
    </Button>
  );

  const GoalsContent = () => {
    if (isLoading) return <PlaceholderSet/>;
    if (Object.keys(goals).length) {
      return (
        <CardDeck>
          {Object.values(goals).map(
            (g) => <GoalCard key={g.url} goal={g}/>,
          )}
        </CardDeck>
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
      <Button as={Link} to={url}>{text}</Button>
    );
  };

  return (
    <div>
      <BreadcrumbSet sections={sections} />
      <HeaderBar title="Goals" icon="goals"/>
      <GoalDashboard/>
      <ButtonGroup className="goal-actions">
        <NewButton/>
        <AnsweringButton/>
      </ButtonGroup>
      <GoalsContent/>
    </div>
  );
};

export default GoalList;
