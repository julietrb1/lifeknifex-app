import {Reducer} from "redux";
import {IBackendItem, IPaginatedResponse} from "../backend-common";
import update from 'immutability-helper';
import {
    FoodActionTypes,
    IFoodFetchDataSuccessAction,
    IFoodHasErroredAction,
    IFoodIsLoadingAction
} from "../actions/foods";
import {arrayToObject, IStoreState} from "../Utils";

export interface IFood extends IBackendItem {
    name: string;
    health_index: number;
    is_archived: boolean;
    icon: string;
}

export interface IFoodStoreState extends IStoreState<IFood> {
}


export const foodsHasErrored: Reducer<boolean, IFoodHasErroredAction> = (state = false, action) => {
    switch (action.type) {
        case FoodActionTypes.FOOD_HAS_ERRORED:
            return action.hasErrored;
        default:
            return state;
    }
};

export const foodsIsLoading: Reducer<boolean, IFoodIsLoadingAction> = (state = false, action) => {
    switch (action.type) {
        case FoodActionTypes.FOOD_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
};

type FoodFetchActions = IFoodFetchDataSuccessAction;

export const foods: Reducer<IFoodStoreState, FoodFetchActions> = (state = {}, action) => {
    console.log(`Reducer reports ${state}`);
    switch (action.type) {
        case FoodActionTypes.FOOD_FETCH_DATA_SUCCESS:
            return update(state, {$set: arrayToObject(action.foods.results, 'url')});
        default:
            return state;
    }
};

export const foodResponse: Reducer<IPaginatedResponse<IFood>, FoodFetchActions> = (state = {}, action) => {
    switch (action.type) {
        case FoodActionTypes.FOOD_FETCH_DATA_SUCCESS:
            return action.foods;
        default:
            return state;
    }
};

export interface IFoodSlice {
    foods: IFoodStoreState;
    foodsIsLoading: boolean;
    foodsHasErrored: boolean;
    foodResponse: IPaginatedResponse<IFood>;
}