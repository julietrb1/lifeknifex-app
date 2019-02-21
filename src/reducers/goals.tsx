import update from 'immutability-helper';
import {arrayToObject} from "../Utils";
import {Reducer} from "redux";
import {
    GoalsActionTypes,
    GoalsCreateAnswerSuccessAction,
    GoalsCreateSuccessAction,
    GoalsFetchDataAction,
    GoalsFetchOneAction,
    GoalsHasErroredAction,
    GoalsIsLoadingAction,
    GoalsUpdateAnswerSuccessAction,
    GoalsUpdateSuccessAction
} from "../actions/goals";
import {IPaginatedResponse} from "../backend-common";

export interface IGoalsReduxState {
    hasErrored: boolean;
}

export interface IGoal {
    id: number;
    todays_answer_value: number;
    todays_answer: string;
    last_answered: string;
}

export interface IGoalsStoreState {
    [goalId: string]: IGoal;
}

export const goalsHasErrored: Reducer<boolean, GoalsHasErroredAction> = (state = false, action) => {
    switch (action.type) {
        case GoalsActionTypes.GOALS_HAS_ERRORED:
            return action.hasErrored;
        default:
            return state;
    }
};

export const goalsIsLoading: Reducer<boolean, GoalsIsLoadingAction> = (state = false, action) => {
    switch (action.type) {
        case GoalsActionTypes.GOALS_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
};

type GoalsFetchActions =
    GoalsCreateSuccessAction
    | GoalsFetchDataAction
    | GoalsUpdateSuccessAction
    | GoalsUpdateAnswerSuccessAction
    | GoalsCreateAnswerSuccessAction
    | GoalsFetchOneAction;

export const goals: Reducer<IGoalsStoreState, GoalsFetchActions> = (state = {}, action) => {
    switch (action.type) {
        case GoalsActionTypes.GOALS_FETCH_DATA_SUCCESS:
            return arrayToObject(action.goals.results, 'url');
        case GoalsActionTypes.GOAL_UPDATE_ANSWER_SUCCESS:
        case GoalsActionTypes.GOAL_CREATE_ANSWER_SUCCESS:
            return update(state, {
                [action.answer.goal]: {
                    todays_answer_value: {$set: action.answer.value},
                    todays_answer: {$set: action.answer.url},
                    last_answered: {$set: action.answer.date}
                }
            });
        case GoalsActionTypes.GOAL_CREATE_SUCCESS:
        case GoalsActionTypes.GOAL_UPDATE_SUCCESS:
        case GoalsActionTypes.GOAL_FETCH_ONE_SUCCESS:
            return update(state, {
                [action.goal.url]: {$set: action.goal}
            });
        default:
            return state;
    }
};

export interface IGoalsResponseStoreState extends IPaginatedResponse<IGoal> {
}

export const goalsResponse: Reducer<IGoalsResponseStoreState, GoalsFetchDataAction> = (state = {}, action) => {
    switch (action.type) {
        case GoalsActionTypes.GOALS_FETCH_DATA_SUCCESS:
            return action.goals;
        default:
            return state;
    }
};