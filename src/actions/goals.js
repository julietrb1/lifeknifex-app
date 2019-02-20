import {API_ANSWERS, API_GOALS} from "../Backend";
import axios from "axios";

export const GOALS_HAS_ERRORED = 'GOALS_HAS_ERRORED';
export const GOALS_IS_LOADING = 'GOALS_IS_LOADING';
export const GOALS_FETCH_DATA_SUCCESS = 'GOALS_FETCH_DATA_SUCCESS';
export const GOAL_UPDATE_ANSWER_SUCCESS = 'GOAL_UPDATE_ANSWER_SUCCESS';
export const GOAL_CREATE_ANSWER_SUCCESS = 'GOAL_CREATE_ANSWER_SUCCESS';
export const GOAL_CREATE_SUCCESS = 'GOAL_CREATE_SUCCESS';
export const GOAL_UPDATE_SUCCESS = 'GOAL_UPDATE_SUCCESS';

export const goalsHasErrored = hasErrored => ({type: GOALS_HAS_ERRORED, hasErrored});
export const goalsIsLoading = isLoading => ({type: GOALS_IS_LOADING, isLoading});
export const goalsFetchDataSuccess = goals => ({type: GOALS_FETCH_DATA_SUCCESS, goals});
export const goalUpdateAnswerSuccess = answer => ({type: GOAL_UPDATE_ANSWER_SUCCESS, answer});
export const goalCreateAnswerSuccess = answer => ({type: GOAL_CREATE_ANSWER_SUCCESS, answer});
export const goalCreateSuccess = goal => ({type: GOAL_CREATE_SUCCESS, goal});
export const goalUpdateSuccess = goal => ({type: GOAL_UPDATE_SUCCESS, goal});

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

export function goalCreate(goal) {
    return dispatch => {
        axios.post(API_GOALS, goal)
            .then(response => response.data)
            .then(goal => dispatch(goalCreateSuccess(goal)));
    };
}

export function goalUpdate(goal) {
    return dispatch => {
        axios.patch(`${API_GOALS}${goal.id}/`, goal)
            .then(response => response.data)
            .then(goal => dispatch(goalUpdateSuccess(goal)));
    };
}