import {API_ANSWERS, API_GOALS} from "../Backend";
import axios from "axios";

export const GOALS_HAS_ERRORED = 'GOALS_HAS_ERRORED';
export const GOALS_IS_LOADING = 'GOALS_IS_LOADING';
export const GOALS_FETCH_DATA_SUCCESS = 'GOALS_FETCH_DATA_SUCCESS';
export const GOAL_UPDATE_ANSWER_SUCCESS = 'GOAL_UPDATE_ANSWER_SUCCESS';
export const GOAL_CREATE_ANSWER_SUCCESS = 'GOAL_CREATE_ANSWER_SUCCESS';
export const GOAL_CREATE_SUCCESS = 'GOAL_CREATE_SUCCESS';
export const GOAL_UPDATE_SUCCESS = 'GOAL_UPDATE_SUCCESS';
export const GOAL_FETCH_ONE_SUCCESS = 'GOAL_FETCH_ONE_SUCCESS';

export const goalsHasErrored = (hasErrored: boolean) => ({type: GOALS_HAS_ERRORED, hasErrored});
export const goalsIsLoading = (isLoading: boolean) => ({type: GOALS_IS_LOADING, isLoading});
export const goalsFetchDataSuccess = (goals: any) => ({type: GOALS_FETCH_DATA_SUCCESS, goals});
export const goalUpdateAnswerSuccess = (answer: any) => ({type: GOAL_UPDATE_ANSWER_SUCCESS, answer});
export const goalCreateAnswerSuccess = (answer: any) => ({type: GOAL_CREATE_ANSWER_SUCCESS, answer});
export const goalCreateSuccess = (goal: any) => ({type: GOAL_CREATE_SUCCESS, goal});
export const goalUpdateSuccess = (goal: any) => ({type: GOAL_UPDATE_SUCCESS, goal});
export const goalFetchOneSuccess = (goal: any) => ({type: GOAL_FETCH_ONE_SUCCESS, goal});

export function goalsFetchAll(search: string) {
    const params = {search};
    return (dispatch: any) => {
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

export function goalUpdateAnswer(goal: any, value: number) {
    return (dispatch: any) => {
        axios.patch(goal.todays_answer, {value})
            .then(response => response.data)
            .then(answer => dispatch(goalUpdateAnswerSuccess(answer)));
    };
}

export function goalCreateAnswer(goal: any, value: number) {
    return (dispatch: any) => {
        axios.post(API_ANSWERS, {
            goal: goal.url,
            value: value
        })
            .then(response => response.data)
            .then(answer => dispatch(goalCreateAnswerSuccess(answer)));
    };
}

export function goalCreate(goal: any) {
    return (dispatch: any) => {
        axios.post(API_GOALS, goal)
            .then(response => response.data)
            .then(goal => dispatch(goalCreateSuccess(goal)));
    };
}

export function goalUpdate(goal: any) {
    return (dispatch: any) => {
        axios.patch(`${API_GOALS}${goal.id}/`, goal)
            .then(response => response.data)
            .then(goal => dispatch(goalUpdateSuccess(goal)));
    };
}

export function goalsFetchOne(goalId: number) {
    return (dispatch: any) => {
        axios.get(`${API_GOALS}${goalId}/`)
            .then(response => response.data)
            .then(goal => dispatch(goalFetchOneSuccess(goal)));
    };
}