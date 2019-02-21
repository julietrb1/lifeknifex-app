import {API_ANSWERS} from "../Backend";
import axios from "axios";
import {Action, ActionCreator} from "redux";
import {ThunkAction} from "redux-thunk";
import {IAnswersReduxState} from "../reducers/answers";

type ThunkResult<R> = ThunkAction<R, IAnswersReduxState, undefined, IAnswersActions>;

export enum AnswersActionTypes {
    ANSWERS_HAS_ERRORED = 'ANSWERS_HAS_ERRORED',
    ANSWERS_IS_LOADING = 'ANSWERS_IS_LOADING',
    ANSWERS_FETCH_DATA_SUCCESS = 'ANSWERS_FETCH_DATA_SUCCESS'
}

export interface AnswersHasErrored extends Action {
    type: AnswersActionTypes.ANSWERS_HAS_ERRORED;
    hasErrored: boolean;
}

export type IAnswersActions = AnswersHasErrored;

export const answersHasErrored: ActionCreator<Action> = (hasErrored: boolean) => ({
    type: AnswersActionTypes.ANSWERS_HAS_ERRORED,
    hasErrored
});
export const answersIsLoading: ActionCreator<Action> = (isLoading: boolean) => ({
    type: AnswersActionTypes.ANSWERS_IS_LOADING,
    isLoading
});
export const answersFetchDataSuccess: ActionCreator<Action> = (answers: any) => ({
    type: AnswersActionTypes.ANSWERS_FETCH_DATA_SUCCESS,
    answers
});

export const answersFetchAll: ThunkResult<void> = (search: string, archived: boolean) => {
    const params = {search, archived};
    return (dispatch: any) => {
        dispatch(answersIsLoading(true));
        axios.get(API_ANSWERS, {params: params})
            .then(response => {
                dispatch(answersIsLoading(false));
                return response;
            })
            .then(response => response.data)
            .then(answers => dispatch(answersFetchDataSuccess(answers)))
            .catch(() => dispatch(answersHasErrored(true)));
    };
};