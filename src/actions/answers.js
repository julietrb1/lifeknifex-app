import {API_ANSWERS} from "../Backend";
import axios from "axios";

export const ANSWERS_HAS_ERRORED = 'ANSWERS_HAS_ERRORED';
export const ANSWERS_IS_LOADING = 'ANSWERS_IS_LOADING';
export const ANSWERS_FETCH_DATA_SUCCESS = 'ANSWERS_FETCH_DATA_SUCCESS';

export const answersHasErrored = hasErrored => ({type: ANSWERS_HAS_ERRORED, hasErrored});
export const answersIsLoading = isLoading => ({type: ANSWERS_IS_LOADING, isLoading});
export const answersFetchDataSuccess = answers => ({type: ANSWERS_FETCH_DATA_SUCCESS, answers});

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