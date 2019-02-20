import update from 'immutability-helper';
import {
    GOAL_CREATE_ANSWER_SUCCESS,
    GOAL_CREATE_SUCCESS,
    GOAL_FETCH_ONE_SUCCESS,
    GOAL_UPDATE_ANSWER_SUCCESS,
    GOAL_UPDATE_SUCCESS,
    GOALS_FETCH_DATA_SUCCESS,
    GOALS_HAS_ERRORED,
    GOALS_IS_LOADING
} from "../actions/goals";
import {arrayToObject} from "../Utils";

export function goalsHasErrored(state = false, action) {
    switch (action.type) {
        case GOALS_HAS_ERRORED:
            return action.hasErrored;
        default:
            return state;
    }
}

export function goalsIsLoading(state = false, action) {
    switch (action.type) {
        case GOALS_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
}

export function goals(state = {}, action) {
    switch (action.type) {
        case GOALS_FETCH_DATA_SUCCESS:
            return arrayToObject(action.goals.results, 'url');
        case GOAL_UPDATE_ANSWER_SUCCESS:
        case GOAL_CREATE_ANSWER_SUCCESS:
            return update(state, {
                [action.answer.goal]: {
                    todays_answer_value: {$set: action.answer.value},
                    todays_answer: {$set: action.answer.url},
                    last_answered: {$set: action.answer.date}
                }
            });
        case GOAL_CREATE_SUCCESS:
            return update(state, {
                [action.goal.url]: {$set: action.goal}
            });
        case GOAL_UPDATE_SUCCESS:
            return update(state, {
                [action.goal.url]: {$set: action.goal}
            });
        case GOAL_FETCH_ONE_SUCCESS:
            return update(state, {
                [action.goal.url]: {$set: action.goal}
            });
        default:
            return state;
    }
}