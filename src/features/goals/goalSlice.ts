import ICommonState from "../ICommonState";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../redux/store";
import IGoal from "../../models/IGoal";
import {IPaginatedResponse} from "../../models/IPaginatedReponse";
import axios from "axios";
import {API_ANSWERS, API_GOALS} from "../../Backend";
import IAnswer from "../../models/IAnswer";

interface IGoalState extends ICommonState {
    goalsByUrl: { [goalUrl: string]: IGoal };
    goalResponse: IPaginatedResponse<IGoal> | null;
}

const goalsInitialState: IGoalState = {
    error: null, isLoading: false, goalResponse: null, goalsByUrl: {}
};

const startLoading = (state: IGoalState) => {
    state.isLoading = true;
};

const loadingFailed = (state: IGoalState, action: PayloadAction<string>) => {
    state.isLoading = false;
    state.error = action.payload;
};

const singleGoalSuccess = (state: IGoalState, {payload}: PayloadAction<IGoal>) => {
    state.isLoading = false;
    state.error = null;
    state.goalsByUrl[payload.url] = payload;
};

const singleGoalAnswerSuccess = (state: IGoalState, {payload}: PayloadAction<IAnswer>) => {
    state.isLoading = false;
    state.error = null;
    state.goalsByUrl[payload.url].todays_answer = payload.url;
    state.goalsByUrl[payload.url].todays_answer_value = payload.value;
};

const deletionGoalSuccess = (state: IGoalState, {payload}: PayloadAction<string>) => {
    state.isLoading = false;
    state.error = null;
    delete state.goalsByUrl[payload];
};

const goalSlice = createSlice({
    name: 'goals', initialState: goalsInitialState, reducers: {
        getAllGoalsStart: startLoading,
        getAllGoalsSuccess: singleGoalSuccess,
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
        updateGoalAnswerStart: startLoading,
        updateGoalAnswerSuccess: singleGoalAnswerSuccess,
        updateGoalAnswerFailure: loadingFailed,
        createGoalAnswerStart: startLoading,
        createGoalAnswerSuccess: singleGoalAnswerSuccess,
        createGoalAnswerFailure: loadingFailed
    }
});

export const {
    getAllGoalsFailure, getAllGoalsStart, getAllGoalsSuccess,
    createGoalAnswerFailure, createGoalAnswerStart, createGoalAnswerSuccess,
    createGoalFailure, createGoalStart, createGoalSuccess,
    deleteGoalFailure, deleteGoalStart, deleteGoalSuccess,
    getGoalFailure, getGoalStart, getGoalSuccess,
    updateGoalAnswerFailure, updateGoalAnswerStart, updateGoalAnswerSuccess,
    updateGoalFailure, updateGoalStart, updateGoalSuccess
} = goalSlice.actions;

export default goalSlice.reducer;

export const fetchAllGoals = (search?: string): AppThunk => async dispatch => {
    const params = {search};
    try {
        dispatch(getAllGoalsStart());
        const {data} = await axios.get(API_GOALS, {params: params});
        dispatch(getAllGoalsSuccess(data));
    } catch (e) {
        dispatch(getAllGoalsFailure(e.toString()));
    }
};

export const fetchGoal = (goalId: number): AppThunk => async dispatch => {
    try {
        dispatch(getGoalStart());
        const {data} = await axios.get(`${API_GOALS}${goalId}/`);
        dispatch(getGoalSuccess(data));
    } catch (e) {
        dispatch(getGoalFailure(e.toString()));
    }
};

export const createGoal = (goal: IGoal): AppThunk => async dispatch => {
    try {
        dispatch(createGoalStart());
        const {data} = await axios.post(API_GOALS, goal);
        dispatch(createGoalSuccess(data));
    } catch (e) {
        dispatch(createGoalFailure(e.toString()));
    }
};

export const updateGoal = (goal: IGoal): AppThunk => async dispatch => {
    try {
        dispatch(updateGoalStart());
        const {data} = await axios.patch(`${API_GOALS}${goal.id}/`, goal);
        dispatch(updateGoalSuccess(data));
    } catch (e) {
        dispatch(updateGoalFailure(e.toString()));
    }
};

export const deleteGoal = (goal: IGoal): AppThunk => async dispatch => {
    try {
        dispatch(deleteGoalStart());
        const {data} = await axios.delete(`${API_GOALS}${goal.id}/`);
        dispatch(deleteGoalSuccess(data));
    } catch (e) {
        dispatch(deleteGoalFailure(e.toString()));
    }
};

export const updateGoalAnswer = (goal: IGoal, answer: IAnswer): AppThunk => async dispatch => {
    try {
        dispatch(updateGoalAnswerStart());
        const {data} = await axios.patch(String(goal.todays_answer), {answer});
        dispatch(updateGoalAnswerSuccess(data));
    } catch (e) {
        dispatch(updateGoalAnswerFailure(e.toString()));
    }
};

export const createGoalAnswer = (goal: any, value: number): AppThunk => async dispatch => {
    try {
        dispatch(createGoalAnswerStart());
        const {data} = await axios.post(API_ANSWERS, {
            goal: goal.url,
            value: value
        });
        dispatch(createGoalAnswerSuccess(data));
    } catch (e) {
        dispatch(createGoalAnswerFailure(e.toString()));
    }
};