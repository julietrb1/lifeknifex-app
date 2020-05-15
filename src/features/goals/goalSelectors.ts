import { RootState } from '../../redux/rootReducer';

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
