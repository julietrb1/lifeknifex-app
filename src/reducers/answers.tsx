import {ANSWERS_FETCH_DATA_SUCCESS, ANSWERS_HAS_ERRORED, ANSWERS_IS_LOADING} from "../actions/answers";

export function answersHasErrored(state = false, action) {
    switch (action.type) {
        case ANSWERS_HAS_ERRORED:
            return action.hasErrored;
        default:
            return state;
    }
}

export function answersIsLoading(state = false, action) {
    switch (action.type) {
        case ANSWERS_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
}

export function answers(state = {}, action) {
    switch (action.type) {
        case ANSWERS_FETCH_DATA_SUCCESS:
            return action.answers;
        default:
            return state;
    }
}