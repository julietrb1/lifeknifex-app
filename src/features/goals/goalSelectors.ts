import {RootState} from "../../redux/rootReducer";

export const selectGoalById = (state: RootState, goalId: number) => state.goalState.goalsById[goalId];
export const selectGoalsLoaded = (state: RootState) => state.goalState.goalResponse !== null;
export const selectGoalsLoading = (state: RootState) => state.goalState.isLoading;
export const selectAllGoals = (state: RootState) => Object.values(state.goalState.goalsById);
export const selectGoalResponse = (state: RootState) => state.goalState.goalResponse;