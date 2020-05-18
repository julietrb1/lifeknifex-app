import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import HeaderBar from '../common-components/HeaderBar';
import PlaceholderSet from '../common-components/PlaceholderSet';
import AnswerEmpty from './AnswerEmpty';
import AnswerPre from './AnswerPre';
import AnswerPost from './AnswerPost';
import { extractError, firstCase } from '../../Utils';
import { createAnswer, fetchAllGoals, updateAnswer } from '../../features/goals/goalSlice';
import {
  selectGoalById,
  selectGoalIdsByAnswered,
  selectGoalsInIds,
  selectGoalsLoaded,
  selectGoalsLoading,
} from '../../features/goals/goalSelectors';
import { RootState } from '../../redux/rootReducer';

const sections = [
  { name: 'Goals', href: '/goals' },
  { name: 'Answer' },
];

interface IAnswerParams {
  goalId: string;
}

const Answer: React.FC = () => {
  const dispatch = useDispatch();
  const { goalId } = useParams<IAnswerParams>();
  const history = useHistory();
  const isLoading = useSelector(selectGoalsLoading);
  const isLoaded = useSelector(selectGoalsLoaded);
  const [goalIndex, setGoalIndex] = useState(0);
  const [preGoalIds] = useState(useSelector((
    state: RootState,
  ) => selectGoalIdsByAnswered(state, false)));
  const [postGoalIds] = useState(useSelector((
    state: RootState,
  ) => selectGoalIdsByAnswered(state, true)));
  const isPostMode = useSelector(() => !!goalId || !preGoalIds.length);
  const postGoals = useSelector((state: RootState) => selectGoalsInIds(state, postGoalIds));
  const preGoals = useSelector((state: RootState) => selectGoalsInIds(state, preGoalIds));
  const multiGoalList = isPostMode
    ? postGoals
    : preGoals;
  const filteredGoals = useSelector((state: RootState) => (goalId
    ? [selectGoalById(state, Number(goalId))]
    : multiGoalList));
  const done = goalIndex === filteredGoals.length;
  const currentGoal = filteredGoals[goalIndex];
  const [candidateValue, setCandidateValue] = useState(currentGoal?.todays_answer_value ?? 0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // TODO: Remove this code smell - use props for re-render instead of manually setting state
    if (currentGoal) setCandidateValue(currentGoal.todays_answer_value ?? 0);
  }, [currentGoal]);

  useEffect(() => {
    if (!isLoaded) dispatch(fetchAllGoals());
  }, [dispatch, isLoaded]);

  const goToGoal = useCallback((increment: number = 1) => {
    setGoalIndex(goalIndex + increment);
    if (goalIndex + increment === filteredGoals.length && goalId) {
      history.replace('/goals');
    }
  }, [filteredGoals, goalId, goalIndex, history]);

  useEffect(() => {
    if (filteredGoals && goalIndex < 0) goToGoal();
  }, [filteredGoals, goToGoal, goalIndex]);

  const handleSubmit = async (increment: number) => {
    if (!currentGoal) return;
    const haveSingleGoal = !!goalId;
    const todaysAnswer = currentGoal.todays_answer_value;
    try {
      if ((haveSingleGoal || isPostMode) && todaysAnswer) {
        await dispatch(updateAnswer(currentGoal, candidateValue));
        if (isPostMode) {
          goToGoal(increment);
        } else {
          history.goBack();
        }
      } else if (haveSingleGoal) {
        await dispatch(createAnswer(currentGoal, candidateValue));
        history.goBack();
      }
    } catch (e) {
      enqueueSnackbar(`Failed to save answer: ${extractError(e)}`, { variant: 'error' });
    }
  };

  const PageContent = () => {
    if (done) {
      return <AnswerEmpty />;
    }
    // const loading = isLoading || !filteredGoals; // TODO: Show loading in Bootstrap
    return (
      <Form onSubmit={() => handleSubmit(1)}>
        <h3>
          {currentGoal
            ? `Did I ${firstCase(currentGoal.question)}?`
            : 'Loading Goal...'}
        </h3>
        <GoalProgressCount />
        <FormContent />
        {goalId
          ? ''
          : (<Button className="float-right" variant="outline-primary" as={Link} to="/goals">Back to Goals</Button>)}

      </Form>
    );
  };

  const handlePreAnswer = async (answerValue: number) => {
    if (!currentGoal) return;
    await dispatch(createAnswer(currentGoal, answerValue));
    goToGoal();
  };

  const FormContent = () => {
    if (isLoading || !currentGoal) {
      return <PlaceholderSet />;
    }
    if (isPostMode) {
      return (
        <AnswerPost
          goal={currentGoal}
          onAnswer={setCandidateValue}
          checkedValue={candidateValue}
          mode={goalId ? 'single' : 'post'}
          isStart={goalIndex === 0}
          isEnd={filteredGoals
          && goalIndex === filteredGoals.length - 1}
          goBack={() => handleSubmit(-1)}
        />
      );
    }
    return <AnswerPre goal={currentGoal} onAnswer={handlePreAnswer} />;
  };

  const GoalProgressCount = () => {
    if (goalId) {
      return null;
    }

    const filteredGoalLength = filteredGoals?.length || '--';
    return (
      <div>
        {`${goalIndex + 1} / ${filteredGoalLength}`}
      </div>
    );
  };

  return (
    <div>
      <BreadcrumbSet sections={sections} />
      <HeaderBar title="Answer Goals" />
      <PageContent />
    </div>
  );
};

export default Answer;
