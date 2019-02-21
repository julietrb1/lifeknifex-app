import {IBackendItem, IPaginatedResponse} from "../backend-common";
import {
    ConsumptionsActionTypes,
    ConsumptionsFetchDataSuccessAction,
    ConsumptionsHasErroredAction,
    ConsumptionsIsLoadingAction
} from "../actions/consumptions";
import {Reducer} from "redux";

export interface IConsumption extends IBackendItem {
    food: string;
    date: string;
    quantity: number;
    food_name: string;
    food_icon: string;
}

export interface IConsumptionsStoreState extends IPaginatedResponse<IConsumption> {
}

export const consumptionsHasErrored: Reducer<boolean, ConsumptionsHasErroredAction> = (state = false, action) => {
    switch (action.type) {
        case ConsumptionsActionTypes.CONSUMPTIONS_HAS_ERRORED:
            return action.hasErrored;
        default:
            return state;
    }
};

export const consumptionsIsLoading: Reducer<boolean, ConsumptionsIsLoadingAction> = (state = false, action) => {
    switch (action.type) {
        case ConsumptionsActionTypes.CONSUMPTIONS_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
};

export const consumptions: Reducer<IConsumptionsStoreState, ConsumptionsFetchDataSuccessAction> = (state = {}, action) => {
    switch (action.type) {
        case ConsumptionsActionTypes.CONSUMPTIONS_FETCH_DATA_SUCCESS:
            return action.consumptions;
        default:
            return state;
    }
};