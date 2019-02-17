import {API_GOALS} from "../Backend";
import axios from "axios";

export function goalsHasErrored(bool) {
    return {
        type: 'GOALS_HAS_ERRORED',
        hasErrored: bool
    };
}

export function goalsIsLoading(bool) {
    return {
        type: 'GOALS_IS_LOADING',
        isLoading: bool
    };
}

export function goalsFetchDataSuccess(goals) {
    return {
        type: 'GOALS_FETCH_DATA_SUCCESS',
        goals
    };
}

export function goalsFetchAll(search) {
    const params = {};
    if (search && search.length) {
        params['search'] = search;
    }

    return dispatch => {
        dispatch(goalsIsLoading(true));
        axios.get(API_GOALS, {params: params})
            .then(response => {
                dispatch(goalsIsLoading(false));
                return response;
            })
            .then(response => response.data)
            .then(goals => dispatch(goalsFetchDataSuccess(goals)))
            .catch(() => dispatch(goalsHasErrored(true)));
    };
}