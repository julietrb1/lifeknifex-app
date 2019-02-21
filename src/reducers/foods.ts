import {Reducer} from "redux";
import {BackendItem} from "../backend-common";
import {
    FoodsActionTypes,
    FoodsFetchDataSuccessAction,
    FoodsHasErroredAction,
    FoodsIsLoadingAction
} from "../actions/foods";
import {arrayToObject} from "../Utils";

export interface IFood extends BackendItem {
    name: string;
    quality: number;
}

export interface IFoodsStoreState {
    [foodUrl: string]: IFood;
}

export const foodsHasErrored: Reducer<boolean, FoodsHasErroredAction> = (state = false, action) => {
    switch (action.type) {
        case FoodsActionTypes.FOODS_HAS_ERRORED:
            return action.hasErrored;
        default:
            return state;
    }
};

export const foodsIsLoading: Reducer<boolean, FoodsIsLoadingAction> = (state = false, action) => {
    switch (action.type) {
        case FoodsActionTypes.FOODS_IS_LOADING:
            return action.isLoading;
        default:
            return state;
    }
};

type FoodsFetchActions = FoodsFetchDataSuccessAction;

export const foods: Reducer<IFoodsStoreState, FoodsFetchActions> = (state = {}, action) => {
    switch (action.type) {
        case FoodsActionTypes.FOODS_FETCH_DATA_SUCCESS:
            return arrayToObject(action.foods.results, 'url');
        default:
            return state;
    }
};

export interface FoodsReduxState {
    foods: any;
    foodsIsLoading: boolean;
    foodsHasErrored: boolean;
}