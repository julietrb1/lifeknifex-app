import {API_CONSUMPTIONS} from "../Backend";
import axios from "axios";
import {Action, Dispatch} from "redux";
import {IPaginatedResponse} from "../backend-common";
import {ThunkResult} from "../store/configure-store";
import {IConsumption} from "../reducers/consumptions";

export type IConsumptionsActions =
    ConsumptionsHasErroredAction
    | ConsumptionsIsLoadingAction
    | ConsumptionsFetchDataSuccessAction;

export enum ConsumptionsActionTypes {
    CONSUMPTIONS_HAS_ERRORED = 'CONSUMPTIONS_HAS_ERRORED',
    CONSUMPTIONS_IS_LOADING = 'CONSUMPTIONS_IS_LOADING',
    CONSUMPTIONS_FETCH_DATA_SUCCESS = 'CONSUMPTIONS_FETCH_DATA_SUCCESS'
}

export interface ConsumptionsHasErroredAction extends Action<ConsumptionsActionTypes.CONSUMPTIONS_HAS_ERRORED> {
    hasErrored: boolean
}

export interface ConsumptionsIsLoadingAction extends Action<ConsumptionsActionTypes.CONSUMPTIONS_IS_LOADING> {
    isLoading: boolean
}

export interface ConsumptionsFetchDataSuccessAction extends Action<ConsumptionsActionTypes.CONSUMPTIONS_FETCH_DATA_SUCCESS> {
    consumptions: IPaginatedResponse<IConsumption>
}

type ConsumptionsFetchAllTypes = ConsumptionsHasErroredAction
    | ConsumptionsIsLoadingAction
    | ConsumptionsFetchDataSuccessAction;

export function consumptionsFetchAll(): ThunkResult<void> {
    return (dispatch: Dispatch<ConsumptionsFetchAllTypes>) => {
        dispatch({isLoading: true} as ConsumptionsIsLoadingAction);
        axios.get(API_CONSUMPTIONS)
            .then(response => {
                dispatch({isLoading: false} as ConsumptionsIsLoadingAction);
                return response;
            })
            .then(response => response.data)
            .then(consumptions => dispatch({consumptions} as ConsumptionsFetchDataSuccessAction))
            .catch(() => dispatch({hasErrored: true} as ConsumptionsHasErroredAction));
    };
}