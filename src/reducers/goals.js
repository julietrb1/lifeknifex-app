import update from 'immutability-helper';
import {
    GOAL_CREATE_ANSWER_SUCCESS,
    GOAL_CREATE_SUCCESS,
    GOAL_UPDATE_ANSWER_SUCCESS,
    GOAL_UPDATE_SUCCESS,
    GOALS_FETCH_DATA_SUCCESS,
    GOALS_HAS_ERRORED,
    GOALS_IS_LOADING
} from "../actions/goals";

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
    let goalIndex;
    switch (action.type) {
        case GOALS_FETCH_DATA_SUCCESS:
            return action.goals;
        case GOAL_UPDATE_ANSWER_SUCCESS:
            goalIndex = state.results.findIndex(goal => goal.url === action.answer.goal);
            if (goalIndex < 0) {
                return state;
            }
            return update(state, {
                results: {
                    [goalIndex]: {
                        todays_answer_value: {$set: action.answer.value}
                    }
                }
            });
        case GOAL_CREATE_ANSWER_SUCCESS:
            goalIndex = state.results.findIndex(goal => goal.url === action.answer.goal);
            if (goalIndex < 0) {
                return state;
            }
            return update(state, {
                results: {
                    [goalIndex]: {
                        todays_answer_value: {$set: action.answer.value},
                        todays_answer: {$set: action.answer.url}
                    }
                }
            });
        case GOAL_CREATE_SUCCESS:
            return update(state, {
                results: {$push: [action.goal]}
            });
        case GOAL_UPDATE_SUCCESS:
            goalIndex = state.results.findIndex(goal => goal.id === action.goal.id);
            if (goalIndex < 0) {
                return state;
            }
            return update(state, {
                results: {
                    [goalIndex]: {$set: action.goal}
                }
            });
        default:
            return state;
    }
}