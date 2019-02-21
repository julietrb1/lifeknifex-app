import {Reducer} from "redux";
import {IBackendItem} from "../backend-common";
import {
    FoodsActionTypes,
    FoodsFetchDataSuccessAction,
    IFoodsHasErroredAction,
    IFoodsIsLoadingAction
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

export const foodsHasErrored: Reducer<boolean, IFoodsHasErroredAction> = (state = false, action) => {
    switch (action.type) {
        case FoodsActionTypes.FOODS_HAS_ERRORED:
            return action.hasErrored;
        default:
            return state;
    }
};

export const foodsIsLoading: Reducer<boolean, IFoodsIsLoadingAction> = (state = false, action) => {
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

export interface IFoodsSlice {
    foods: any;
    foodsIsLoading: boolean;
    foodsHasErrored: boolean;
}