import {API_CONSUMPTIONS} from "../Backend";
import axios from "axios";
import {Action, ActionCreator, Dispatch} from "redux";
import {ThunkResult} from "../redux/store";
import {IConsumptionSlice} from "../reducers/consumptions";
import {ThunkAction} from "redux-thunk";
import {IPaginatedResponse} from "../models/IPaginatedReponse";
import {IConsumption} from "../models/IConsumption";

export type IConsumptionActions =
    IConsumptionHasErroredAction
    | IConsumptionIsLoadingAction
    | IConsumptionFetchDataSuccessAction;

export enum ConsumptionActionTypes {
    CONSUMPTION_HAS_ERRORED = 'CONSUMPTION_HAS_ERRORED',
    CONSUMPTION_IS_LOADING = 'CONSUMPTION_IS_LOADING',
    CONSUMPTION_FETCH_DATA_SUCCESS = 'CONSUMPTION_FETCH_DATA_SUCCESS'
}

export interface IConsumptionHasErroredAction extends Action<ConsumptionActionTypes.CONSUMPTION_HAS_ERRORED> {
    hasErrored: boolean
}

export const consumptionHasErrored: ActionCreator<ThunkAction<void, IConsumptionSlice, any, IConsumptionHasErroredAction>> = (hasErrored: boolean) => (dispatch: Dispatch<IConsumptionHasErroredAction>) => dispatch({
    type: ConsumptionActionTypes.CONSUMPTION_HAS_ERRORED,
    hasErrored
});

export interface IConsumptionIsLoadingAction extends Action<ConsumptionActionTypes.CONSUMPTION_IS_LOADING> {
    isLoading: boolean
}

export const consumptionIsLoading: ActionCreator<ThunkAction<void, IConsumptionSlice, any, IConsumptionIsLoadingAction>> = (isLoading: boolean) => (dispatch: Dispatch<IConsumptionIsLoadingAction>) => dispatch({
    type: ConsumptionActionTypes.CONSUMPTION_IS_LOADING,
    isLoading
});

export interface IConsumptionFetchDataSuccessAction extends Action<ConsumptionActionTypes.CONSUMPTION_FETCH_DATA_SUCCESS> {
    consumptions: IPaginatedResponse<IConsumption>
}

export const consumptionFetchDataSuccess: ActionCreator<ThunkAction<void, IConsumptionSlice, any, IConsumptionFetchDataSuccessAction>> = (consumptions: IPaginatedResponse<IConsumption>) => (dispatch: Dispatch<IConsumptionFetchDataSuccessAction>) => dispatch({
    type: ConsumptionActionTypes.CONSUMPTION_FETCH_DATA_SUCCESS,
    consumptions
});

type ConsumptionFetchAllTypes = IConsumptionHasErroredAction
    | IConsumptionIsLoadingAction
    | IConsumptionFetchDataSuccessAction;

export function consumptionFetchAll(): ThunkResult<void> {
    return (dispatch: Dispatch<any>) => {
        dispatch(consumptionIsLoading(true));
        axios.get(API_CONSUMPTIONS)
            .then(response => {
                dispatch(consumptionIsLoading(false));
                return response;
            })
            .then(response => response.data)
            .then(consumptions => dispatch(consumptionFetchDataSuccess(consumptions)))
            .catch(() => dispatch(consumptionHasErrored(true)));
    };
}