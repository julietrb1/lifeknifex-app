import moment from 'moment';
import { RootState } from '../../redux/rootReducer';
import { BACKEND_DATE_FORMAT } from '../../constants';

export const selectGoalByUrl = (
  state: RootState, goalUrl: string,
) => state.goalState.goalsByUrl[goalUrl];

export const selectGoalById = (
  state: RootState, goalId: number,
) => Object.values(state.goalState.goalsByUrl).find((g) => g.id === goalId);

export const selectGoalsLoaded = (
  state: RootState,
) => state.goalState.goalResponse !== null;

export const selectGoalsLoading = (
  state: RootState,
) => state.goalState.isLoading;

export const selectAllGoals = (
  state: RootState,
) => Object.values(state.goalState.goalsByUrl);

export const selectGoalResponse = (
  state: RootState,
) => state.goalState.goalResponse;

export const selectGoalIdsByAnswered = (
  state: RootState, answered: boolean,
) => Object.values(state.goalState.goalsByUrl).filter(
  (g) => (g.last_answered === moment().format(BACKEND_DATE_FORMAT)) === answered,
).map((g) => g.id);

export const selectGoalsInIds = (
  state: RootState, ids: number[],
) => ids.map((id) => selectGoalById(state, id));
