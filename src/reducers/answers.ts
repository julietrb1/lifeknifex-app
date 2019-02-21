import {AnswersActionTypes, AnswersHasErroredAction, AnswersIsLoadingAction} from "../actions/answers";
import {IBackendItem, IPaginatedResponse} from "../backend-common";
import {Reducer} from "redux";

export interface IAnswer extends IBackendItem {
    goal: string;
    value: number;
    date: string;
}

// TODO: Either use this with 'answers' or remove it
// export interface IAnswersStoreState {
//     [answerUrl: string]: IAnswer;
// }

export const answersHasErrored: Reducer<boolean, AnswersHasErroredAction> = (state = false, action) => {
    switch (action.type) {
        case AnswersActionTypes.ANSWERS_HAS_ERRORED:
            return action.hasErrored;
        default:
            return state;
    }
};

export const answersIsLoading: Reducer<boolean, AnswersIsLoadingAction> = (state = false, action) => {
    switch (action.type) {
        case AnswersActionTypes.ANSWERS_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
};

export const answers: Reducer<IPaginatedResponse<IAnswer>> = (state = {}, action) => {
    switch (action.type) {
        case AnswersActionTypes.ANSWERS_FETCH_DATA_SUCCESS:
            return action.answers;
        default:
            return state;
    }
};

export interface IAnswersSlice {
    answers: IPaginatedResponse<IAnswer>;
    answersIsLoading: boolean;
    answersHasErrored: boolean;
}