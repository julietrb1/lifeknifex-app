import Card from 'react-bootstrap/Card';
import React from 'react';
import { useSelector } from 'react-redux';
import CommonStatistic from './CommonStatistic';
import { selectAllGoals, selectGoalResponse } from '../../features/goals/goalSelectors';


const GoalDashboard = () => {
  const goals = useSelector(selectAllGoals);
  const getGoalToAnswerCount = () => Object.values(goals).filter((goal) => !goal.todays_answer).length;
  const goalsResponse = useSelector(selectGoalResponse);
  return (
    <Card className="dashboard">
      <Card.Body className="dashboard-body">
        <CommonStatistic count={Number(goalsResponse?.count)} label="Goals" />
        <CommonStatistic count={getGoalToAnswerCount()} label="To answer" />
      </Card.Body>
    </Card>
  );
};

export default GoalDashboard;
