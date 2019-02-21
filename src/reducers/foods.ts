import {Reducer} from "redux";
import {IBackendItem} from "../backend-common";
import {
    FoodActionTypes,
    IFoodFetchDataSuccessAction,
    IFoodHasErroredAction,
    IFoodIsLoadingAction
} from "../actions/foods";
import {arrayToObject} from "../Utils";

export interface IFood extends IBackendItem {
    name: string;
    health_index: number;
    is_archived: boolean;
    icon: string;
}

export interface IFoodsStoreState {
    [foodUrl: string]: IFood;
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

type FoodsFetchActions = IFoodFetchDataSuccessAction;

export const foods: Reducer<IFoodsStoreState, FoodsFetchActions> = (state = {}, action) => {
    switch (action.type) {
        case FoodActionTypes.FOOD_FETCH_DATA_SUCCESS:
            return arrayToObject(action.foods.results, 'url');
        default:
            return state;
    }
};

export interface IFoodSlice {
    foods: any;
    foodsIsLoading: boolean;
    foodsHasErrored: boolean;
}