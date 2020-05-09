import ICommonState from "../ICommonState";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../redux/store";
import {IPaginatedResponse} from "../../models/IPaginatedReponse";
import IAnswer from "../../models/IAnswer";
import axios from "axios";
import {API_ANSWERS} from "../../Backend";

interface IAnswerState extends ICommonState {
    answers: IAnswer[];
    answerResponse: IPaginatedResponse<IAnswer> | null;
}

const answersInitialState: IAnswerState = {
    error: null, isLoading: false, answers: [], answerResponse: null
};

const startLoading = (state: IAnswerState) => {
    state.isLoading = true;
};

const loadingFailed = (state: IAnswerState, action: PayloadAction<string>) => {
    state.isLoading = false;
    state.error = action.payload;
};

const answerSlice = createSlice({
    name: 'answers', initialState: answersInitialState, reducers: {
        getAnswersStart: startLoading,
        getAnswersSuccess(state, {payload}: PayloadAction<IPaginatedResponse<IAnswer>>) {
            state.answerResponse = payload;
            state.error = null;
            state.isLoading = false;
        }, getAnswersFailure: loadingFailed,
        saveAnswer(state, {payload: answer}: PayloadAction<IAnswer[]>) {
            // TODO: Save answer
        }, deleteAnswer(state, {payload: answerToDelete}: PayloadAction<IAnswer>) {
            // TODO: Delete answer
        }
    }
});

export const {saveAnswer, deleteAnswer, getAnswersFailure, getAnswersStart, getAnswersSuccess} = answerSlice.actions;

export default answerSlice.reducer;

export const fetchAnswers = (search: string, archived: boolean): AppThunk => async dispatch => {
    const params = {search, archived};
    try {
        dispatch(getAnswersStart());
        const {data} = await axios.get(API_ANSWERS, {params: params});
        dispatch(getAnswersSuccess(data));
    } catch (err) {
        dispatch(getAnswersFailure(err.toString()));
    }
};