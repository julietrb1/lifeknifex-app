import ICommonState from "../ICommonState";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../redux/store";
import IGoal from "../../models/IGoal";
import {IPaginatedResponse} from "../../models/IPaginatedReponse";

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

export const fetchGoals = (): AppThunk => async dispatch => {
    try {
        dispatch(getGoalsStart());
        // TODO: Fetch goals
        //dispatch(getGoalsSuccess());
    } catch (err) {
        dispatch(getGoalsFailure(err.toString()));
    }
};