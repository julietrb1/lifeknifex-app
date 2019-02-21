import {Reducer} from "redux";

export const foodsHasErrored: Reducer<FoodsReduxState, > = (state = false, action) => {
    switch (action.type) {
        case 'FOODS_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
};

export const foodsIsLoading = (state = false, action) => {
    switch (action.type) {
        case 'FOODS_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
};

export const foods = (state = {}, action) => {
    switch (action.type) {
        case 'FOODS_FETCH_DATA_SUCCESS':
            return action.foods;
        default:
            return state;
    }
};

export interface FoodsReduxState {
    foods: any;
    foodsIsLoading: boolean;
    foodsHasErrored: boolean;
}