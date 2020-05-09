import ICommonState from "../ICommonState";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../redux/store";
import IGoal from "../../models/IGoal";
import {IPaginatedResponse} from "../../models/IPaginatedReponse";
import axios from "axios";
import {API_ANSWERS, API_GOALS} from "../../Backend";

interface IGoalState extends ICommonState {
    goals: IGoal[];
    goalResponse: IPaginatedResponse<IGoal> | null;
}

const goalsInitialState: IGoalState = {
    error: null, isLoading: false, goals: [], goalResponse: null
};

const startLoading = (state: IGoalState) => {
    state.isLoading = true;
};

const loadingFailed = (state: IGoalState, action: PayloadAction<string>) => {
    state.isLoading = false;
    state.error = action.payload;
};

const goalSlice = createSlice({
    name: 'goals', initialState: goalsInitialState, reducers: {
        getGoalsStart: startLoading,
        getGoalsSuccess(state, {payload}: PayloadAction<IPaginatedResponse<IGoal>>) {
            state.goalResponse = payload;
            state.error = null;
            state.isLoading = false;
        }, getGoalsFailure: loadingFailed,
        saveGoal(state, {payload: goal}: PayloadAction<IGoal[]>) {
            // TODO: Save goal
        }, deleteGoal(state, {payload: goalToDelete}: PayloadAction<IGoal>) {
            // TODO: Delete goal
        }
    }
});

export const {saveGoal, deleteGoal, getGoalsFailure, getGoalsStart, getGoalsSuccess} = goalSlice.actions;

export default goalSlice.reducer;

export const fetchAllGoals = (search?: string): AppThunk => async dispatch => {
    const params = {search};
    try {
        dispatch(getGoalsStart());
        const {data} = await axios.get(API_GOALS, {params: params});
        dispatch(getGoalsSuccess(data));
    } catch (err) {
        dispatch(getGoalsFailure(err.toString()));
    }
};

export const updateGoalAnswer = (goal: IGoal, value: number): AppThunk => async dispatch => {
    const {data} = await axios.patch(String(goal.todays_answer), {value});
    // .then(response => response.data)
    // .then(answer => dispatch(goalUpdateAnswerSuccess(answer)));
};

export const createGoalAnswer = (goal: any, value: number): AppThunk => async dispatch => {
    const {data} = await axios.post(API_ANSWERS, {
        goal: goal.url,
        value: value
    });
    // .then(response => response.data)
    // .then(answer => dispatch(goalCreateAnswerSuccess(answer)));
};

export const createGoal = (goal: IGoal): AppThunk => async dispatch => {
    const {data} = await axios.post(API_GOALS, goal);
    // .then(response => response.data)
    // .then(goal => dispatch(goalCreateSuccess(goal)));
};

export const goalUpdate = (goal: IGoal): AppThunk => async dispatch => {
    const {data} = await axios.patch(`${API_GOALS}${goal.id}/`, goal);
    // .then(response => response.data)
    // .then(goal => dispatch(goalUpdateSuccess(goal)));
};

export const goalsFetchOne = (goalId: number): AppThunk => async dispatch => {
    const {data} = await axios.get(`${API_GOALS}${goalId}/`);
    // .then(response => response.data)
    // .then(goal => dispatch(goalFetchOneSuccess(goal)));
};