import update from 'immutability-helper';
import {arrayToObject} from "../Utils";
import {Reducer} from "redux";
import {
    GoalActionTypes,
    GoalCreateAnswerSuccessAction,
    GoalCreateSuccessAction,
    GoalFetchOneSuccessAction,
    GoalsFetchDataSuccessAction,
    GoalsHasErroredAction,
    GoalsIsLoadingAction,
    GoalUpdateAnswerSuccessAction,
    GoalUpdateSuccessAction
} from "../actions/goals";
import {IPaginatedResponse} from "../models/IPaginatedReponse";
import {IGoal} from "../models/IGoal";

export interface IGoalsStoreState {
    [goalUrl: string]: IGoal;
}

export interface IGoalSlice {
    goalsHasErrored: boolean;
    goalsIsLoading: boolean;
    goals: IGoalsStoreState;
    goalsResponse: IPaginatedResponse<IGoal>;
}

export const goalsHasErrored: Reducer<boolean, GoalsHasErroredAction> = (state = false, action) => {
    switch (action.type) {
        case GoalActionTypes.GOAL_HAS_ERRORED:
            return action.hasErrored;
        default:
            return state;
    }
};

export const goalsIsLoading: Reducer<boolean, GoalsIsLoadingAction> = (state = false, action) => {
    switch (action.type) {
        case GoalActionTypes.GOAL_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
};

type GoalsFetchActions =
    GoalCreateSuccessAction
    | GoalsFetchDataSuccessAction
    | GoalUpdateSuccessAction
    | GoalUpdateAnswerSuccessAction
    | GoalCreateAnswerSuccessAction
    | GoalFetchOneSuccessAction;

export const goals: Reducer<IGoalsStoreState, GoalsFetchActions> = (state = {}, action) => {
    switch (action.type) {
        case GoalActionTypes.GOAL_FETCH_DATA_SUCCESS:
            return arrayToObject(action.goals.results, 'url');
        case GoalActionTypes.GOAL_UPDATE_ANSWER_SUCCESS:
        case GoalActionTypes.GOAL_CREATE_ANSWER_SUCCESS:
            return update(state, {
                [action.answer.goal]: {
                    todays_answer_value: {$set: action.answer.value},
                    todays_answer: {$set: action.answer.url},
                    last_answered: {$set: action.answer.date}
                }
            });
        case GoalActionTypes.GOAL_CREATE_SUCCESS:
        case GoalActionTypes.GOAL_UPDATE_SUCCESS:
        case GoalActionTypes.GOAL_FETCH_ONE_SUCCESS:
            return update(state, {
                [String(action.goal.url)]: {$set: action.goal} // TODO: Don't coerce to string - find a better way
            });
        default:
            return state;
    }
};

export const goalsResponse: Reducer<IPaginatedResponse<IGoal>, GoalsFetchDataSuccessAction> = (state = {}, action) => {
    switch (action.type) {
        case GoalActionTypes.GOAL_FETCH_DATA_SUCCESS:
            return action.goals;
        default:
            return state;
    }
};