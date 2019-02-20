import {API_ANSWERS, API_GOALS} from "../Backend";
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

export function goalUpdateAnswerSuccess(answer) {
    return {
        type: 'GOAL_UPDATE_ANSWER_SUCCESS',
        answer
    };
}

export function goalCreateAnswerSuccess(answer) {
    return {
        type: 'GOAL_CREATE_ANSWER_SUCCESS',
        answer
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

export function goalUpdateAnswer(goal, value) {
    return dispatch => {
        axios.patch(goal.todays_answer, {value})
            .then(response => response.data)
            .then(answer => dispatch(goalUpdateAnswerSuccess(answer)));
    };
}

export function goalCreateAnswer(goal, value) {
    return dispatch => {
        axios.post(API_ANSWERS, {
            goal: goal.url,
            value: value
        })
            .then(response => response.data)
            .then(answer => dispatch(goalCreateAnswerSuccess(answer)));
    };
}