import {API_ANSWERS, API_GOALS} from "../Backend";
import axios from "axios";
import {IGoal} from "../reducers/goals";
import {Action, Dispatch} from "redux";
import {ThunkResult} from "../store/configure-store";
import {IPaginatedResponse} from "../backend-common";


export type IGoalsActions =
    GoalsHasErroredAction
    | GoalsIsLoadingAction
    | GoalsFetchDataAction
    | GoalsUpdateAnswerSuccessAction
    | GoalsCreateAnswerSuccessAction
    | GoalsCreateSuccessAction
    | GoalsUpdateSuccessAction
    | GoalsFetchOneSuccessAction;

export enum GoalsActionTypes {
    GOALS_HAS_ERRORED = 'GOALS_HAS_ERRORED',
    GOALS_IS_LOADING = 'GOALS_IS_LOADING',
    GOALS_FETCH_DATA_SUCCESS = 'GOALS_FETCH_DATA_SUCCESS',
    GOAL_UPDATE_ANSWER_SUCCESS = 'GOAL_UPDATE_ANSWER_SUCCESS',
    GOAL_CREATE_ANSWER_SUCCESS = 'GOAL_CREATE_ANSWER_SUCCESS',
    GOAL_CREATE_SUCCESS = 'GOAL_CREATE_SUCCESS',
    GOAL_UPDATE_SUCCESS = 'GOAL_UPDATE_SUCCESS',
    GOAL_FETCH_ONE_SUCCESS = 'GOAL_FETCH_ONE_SUCCESS',
}

export interface GoalsHasErroredAction extends Action<GoalsActionTypes.GOALS_HAS_ERRORED> {
    hasErrored: boolean
}

export interface GoalsIsLoadingAction extends Action<GoalsActionTypes.GOALS_IS_LOADING> {
    isLoading: boolean
}

export interface GoalsFetchDataAction extends Action<GoalsActionTypes.GOALS_FETCH_DATA_SUCCESS> {
    goals: IPaginatedResponse<IGoal>
}

export interface GoalsUpdateAnswerSuccessAction extends Action<GoalsActionTypes.GOAL_UPDATE_ANSWER_SUCCESS> {
    answer: any
}

export interface GoalsCreateAnswerSuccessAction extends Action<GoalsActionTypes.GOAL_CREATE_ANSWER_SUCCESS> {
    answer: any
}

export interface GoalsCreateSuccessAction extends Action<GoalsActionTypes.GOAL_CREATE_SUCCESS> {
    goal: IGoal
}

export interface GoalsUpdateSuccessAction extends Action<GoalsActionTypes.GOAL_UPDATE_SUCCESS> {
    goal: IGoal
}

export interface GoalsFetchOneSuccessAction extends Action<GoalsActionTypes.GOAL_FETCH_ONE_SUCCESS> {
    goal: IGoal
}

type GoalsFetchAllActions = GoalsIsLoadingAction | GoalsFetchDataAction | GoalsHasErroredAction;

export function goalsFetchAll(search?: string): ThunkResult<void> {
    const params = {search};
    return (dispatch: Dispatch<GoalsFetchAllActions>) => {
        dispatch({isLoading: true} as GoalsIsLoadingAction);
        axios.get(API_GOALS, {params: params})
            .then(response => {
                dispatch({type: GoalsActionTypes.GOALS_IS_LOADING, isLoading: false});
                return response;
            })
            .then(response => response.data)
            .then(goals => dispatch({goals} as GoalsFetchDataAction))
            .catch(() => dispatch({hasErrored: true} as GoalsHasErroredAction));
    };
}

export function goalUpdateAnswer(goal: IGoal, value: number): ThunkResult<void> {
    return (dispatch: Dispatch<GoalsUpdateAnswerSuccessAction>) => {
        axios.patch(String(goal.todays_answer), {value})
            .then(response => response.data)
            .then(answer => dispatch({answer} as GoalsUpdateAnswerSuccessAction));
    };
}

export function goalCreateAnswer(goal: any, value: number): ThunkResult<void> {
    return (dispatch: Dispatch<GoalsCreateAnswerSuccessAction>) => {
        axios.post(API_ANSWERS, {
            goal: goal.url,
            value: value
        })
            .then(response => response.data)
            .then(answer => dispatch({answer} as GoalsCreateAnswerSuccessAction));
    };
}

export function goalCreate(goal: IGoal): ThunkResult<void> {
    return (dispatch: Dispatch<GoalsCreateSuccessAction>) => {
        axios.post(API_GOALS, goal)
            .then(response => response.data)
            .then(goal => dispatch({goal} as GoalsCreateSuccessAction));
    };
}

export function goalUpdate(goal: IGoal): ThunkResult<void> {
    return (dispatch: Dispatch<GoalsUpdateSuccessAction>) => {
        axios.patch(`${API_GOALS}${goal.id}/`, goal)
            .then(response => response.data)
            .then(goal => dispatch({goal} as GoalsUpdateSuccessAction));
    };
}

export function goalsFetchOne(goalId: number): ThunkResult<void> {
    return (dispatch: Dispatch<GoalsFetchOneSuccessAction>) => {
        axios.get(`${API_GOALS}${goalId}/`)
            .then(response => response.data)
            .then(goal => dispatch({goal} as GoalsFetchOneSuccessAction));
    };
}