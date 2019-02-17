import {API_ANSWERS} from "../Backend";
import axios from "axios";

export function answersHasErrored(bool) {
    return {
        type: 'ANSWERS_HAS_ERRORED',
        hasErrored: bool
    };
}

export function answersIsLoading(bool) {
    return {
        type: 'ANSWERS_IS_LOADING',
        isLoading: bool
    };
}

export function answersFetchDataSuccess(answers) {
    return {
        type: 'ANSWERS_FETCH_DATA_SUCCESS',
        answers
    };
}

export function answersFetchAll(search, isArchivedVisible) {
    const params = {};
    if (search && search.length) {
        params['search'] = search;
    }

    if (isArchivedVisible) {
        params['archived'] = 1;
    }

    return dispatch => {
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
}