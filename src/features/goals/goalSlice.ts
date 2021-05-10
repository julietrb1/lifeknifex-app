import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ICommonState from '../ICommonState';
import { AppThunk } from '../../redux/store';
import IGoal from '../../models/IGoal';
import { IPaginatedResponse } from '../../models/IPaginatedReponse';
import {
  reqCreateAnswer,
  reqCreateGoal,
  reqDeleteGoal,
  reqGetAllGoals,
  reqGetGoal,
  reqUpdateAnswer,
  reqUpdateGoal,
} from '../../backend';
import IAnswer from '../../models/IAnswer';
import { extractStoreError } from '../../Utils';

interface IGoalState extends ICommonState {
  goalsByUrl: { [goalUrl: string]: IGoal };
  goalResponse: IPaginatedResponse<IGoal> | null;
}

const goalsInitialState: IGoalState = {
  error: null, isLoading: false, goalResponse: null, goalsByUrl: {},
};

const startLoading = (state: IGoalState) => {
  state.isLoading = true;
};

const loadingFailed = (state: IGoalState, action: PayloadAction<string>) => {
  state.isLoading = false;
  state.error = action.payload;
};

const singleGoalSuccess = (state: IGoalState, { payload }: PayloadAction<IGoal>) => {
  state.isLoading = false;
  state.error = null;
  state.goalsByUrl[payload.url] = payload;
};

const allGoalsSuccess = (
  state: IGoalState, { payload }: PayloadAction<IPaginatedResponse<IGoal>>,
) => {
  state.isLoading = false;
  state.error = null;
  (payload.results || []).forEach((c) => {
    state.goalsByUrl[c.url] = c;
  });
  state.goalResponse = payload;
};

const singleAnswerSuccess = (state: IGoalState, { payload }: PayloadAction<IAnswer>) => {
  state.isLoading = false;
  state.error = null;
  state.goalsByUrl[payload.goal].todays_answer = payload.url;
  state.goalsByUrl[payload.goal].todays_answer_value = payload.value;
  state.goalsByUrl[payload.goal].last_answered = payload.date;
};

const deletionGoalSuccess = (state: IGoalState, { payload }: PayloadAction<string>) => {
  state.isLoading = false;
  state.error = null;
  delete state.goalsByUrl[payload];
};

const goalSlice = createSlice({
  name: 'goals',
  initialState: goalsInitialState,
  reducers: {
    getAllGoalsStart: startLoading,
    getAllGoalsSuccess: allGoalsSuccess,
    getAllGoalsFailure: loadingFailed,
    getGoalStart: startLoading,
    getGoalSuccess: singleGoalSuccess,
    getGoalFailure: loadingFailed,
    createGoalStart: startLoading,
    createGoalSuccess: singleGoalSuccess,
    createGoalFailure: loadingFailed,
    updateGoalStart: startLoading,
    updateGoalSuccess: singleGoalSuccess,
    updateGoalFailure: loadingFailed,
    deleteGoalStart: startLoading,
    deleteGoalSuccess: deletionGoalSuccess,
    deleteGoalFailure: loadingFailed,
    updateAnswerStart: startLoading,
    updateAnswerSuccess: singleAnswerSuccess,
    updateAnswerFailure: loadingFailed,
    createAnswerStart: startLoading,
    createAnswerSuccess: singleAnswerSuccess,
    createAnswerFailure: loadingFailed,
  },
});

export const {
  getAllGoalsFailure, getAllGoalsStart, getAllGoalsSuccess,
  createAnswerFailure, createAnswerStart, createAnswerSuccess,
  createGoalFailure, createGoalStart, createGoalSuccess,
  deleteGoalFailure, deleteGoalStart, deleteGoalSuccess,
  getGoalFailure, getGoalStart, getGoalSuccess,
  updateAnswerFailure, updateAnswerStart, updateAnswerSuccess,
  updateGoalFailure, updateGoalStart, updateGoalSuccess,
} = goalSlice.actions;

export default goalSlice.reducer;

export const fetchAllGoals = (search?: string): AppThunk => async (dispatch) => {
  try {
    dispatch(getAllGoalsStart());
    const { data } = await reqGetAllGoals(search);
    dispatch(getAllGoalsSuccess(data));
  } catch (e) {
    dispatch(getAllGoalsFailure(extractStoreError(e)));
  }
};

export const fetchGoal = (goalId: number): AppThunk => async (dispatch) => {
  try {
    dispatch(getGoalStart());
    const { data } = await reqGetGoal(goalId);
    dispatch(getGoalSuccess(data));
  } catch (e) {
    dispatch(getGoalFailure(extractStoreError(e)));
  }
};

export const createGoal = (goal: IGoal): AppThunk => async (dispatch) => {
  try {
    dispatch(createGoalStart());
    const { data } = await reqCreateGoal(goal);
    dispatch(createGoalSuccess(data));
    return goal;
  } catch (e) {
    const message = extractStoreError(e);
    dispatch(createGoalFailure(message));
    throw Error(message);
  }
};

export const updateGoal = (goal: IGoal): AppThunk => async (dispatch) => {
  try {
    dispatch(updateGoalStart());
    const { data } = await reqUpdateGoal(goal);
    dispatch(updateGoalSuccess(data));
    return data;
  } catch (e) {
    const message = extractStoreError(e);
    dispatch(updateGoalFailure(message));
    throw Error(message);
  }
};

export const deleteGoal = (goal: IGoal): AppThunk => async (dispatch) => {
  try {
    dispatch(deleteGoalStart());
    const { data } = await reqDeleteGoal(goal);
    dispatch(deleteGoalSuccess(data));
  } catch (e) {
    dispatch(deleteGoalFailure(extractStoreError(e)));
  }
};

export const updateAnswer = (goal: IGoal, value: number): AppThunk => async (dispatch) => {
  try {
    dispatch(updateAnswerStart());
    const { data } = await reqUpdateAnswer(goal, value);
    dispatch(updateAnswerSuccess(data));
  } catch (e) {
    dispatch(updateAnswerFailure(extractStoreError(e)));
  }
};

export const createAnswer = (goal: IGoal, value: number): AppThunk => async (dispatch) => {
  try {
    dispatch(createAnswerStart());
    const { data } = await reqCreateAnswer(goal, value);
    dispatch(createAnswerSuccess(data));
    return data;
  } catch (e) {
    const message = extractStoreError(e);
    dispatch(createAnswerFailure(message));
    throw Error(message);
  }
};
