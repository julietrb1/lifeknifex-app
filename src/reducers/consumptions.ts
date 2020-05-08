import {
    ConsumptionActionTypes,
    IConsumptionFetchDataSuccessAction,
    IConsumptionHasErroredAction,
    IConsumptionIsLoadingAction
} from "../actions/consumptions";
import {Reducer} from "redux";
import {IBackendItem} from "../models/IBackendItem";
import {IPaginatedResponse} from "../models/IPaginatedReponse";

export interface IConsumption extends IBackendItem {
    food: string;
    date: string;
    quantity: number;
    food_name: string;
    food_icon: string;
}

export interface IConsumptionSlice {
    consumptionsHasErrored: boolean;
    consumptionsIsLoading: boolean;
    consumptions: IPaginatedResponse<IConsumption>;
}

export const consumptionsHasErrored: Reducer<boolean, IConsumptionHasErroredAction> = (state = false, action) => {
    switch (action.type) {
        case ConsumptionActionTypes.CONSUMPTION_HAS_ERRORED:
            return action.hasErrored;
        default:
            return state;
    }
};

export const consumptionsIsLoading: Reducer<boolean, IConsumptionIsLoadingAction> = (state = false, action) => {
    switch (action.type) {
        case ConsumptionActionTypes.CONSUMPTION_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
};

export const consumptions: Reducer<IPaginatedResponse<IConsumption>, IConsumptionFetchDataSuccessAction> = (state = {}, action) => {
    switch (action.type) {
        case ConsumptionActionTypes.CONSUMPTION_FETCH_DATA_SUCCESS:
            return action.consumptions;
        default:
            return state;
    }
};