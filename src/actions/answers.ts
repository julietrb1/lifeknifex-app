import {API_ANSWERS} from "../Backend";
import axios from "axios";
import {Action, Dispatch} from "redux";
import {IAnswer} from "../reducers/answers";
import {IPaginatedResponse} from "../backend-common";
import {ThunkResult} from "../store/configure-store";

export enum AnswersActionTypes {
    ANSWERS_HAS_ERRORED = 'ANSWERS_HAS_ERRORED',
    ANSWERS_IS_LOADING = 'ANSWERS_IS_LOADING',
    ANSWERS_FETCH_DATA_SUCCESS = 'ANSWERS_FETCH_DATA_SUCCESS'
}

export interface AnswersHasErroredAction extends Action<AnswersActionTypes.ANSWERS_HAS_ERRORED> {
    hasErrored: boolean;
}

export interface AnswersIsLoadingAction extends Action<AnswersActionTypes.ANSWERS_IS_LOADING> {
    isLoading: boolean;
}

export interface AnswersFetchDataSuccessAction extends Action<AnswersActionTypes.ANSWERS_FETCH_DATA_SUCCESS> {
    answers: IPaginatedResponse<IAnswer>;
}

export type IAnswersActions = AnswersHasErroredAction
    | AnswersIsLoadingAction
    | AnswersFetchDataSuccessAction;

export function answersFetchAll(search: string, archived: boolean): ThunkResult<void> {
    const params = {search, archived};
    return (dispatch: Dispatch<IAnswersActions>) => {
        dispatch({isLoading: true} as AnswersIsLoadingAction);
        axios.get(API_ANSWERS, {params: params})
            .then(response => {
                dispatch({isLoading: false} as AnswersIsLoadingAction);
                return response;
            })
            .then(response => response.data)
            .then(answers => dispatch({answers} as AnswersFetchDataSuccessAction))
            .catch(() => dispatch({hasErrored: true} as AnswersHasErroredAction));
    };
}