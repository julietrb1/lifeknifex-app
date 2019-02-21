import {API_FOODS} from "../Backend";
import axios from "axios";
import {Action, ActionCreator, Dispatch} from "redux";
import {ThunkResult} from "../store/configure-store";
import {IPaginatedResponse} from "../backend-common";
import {IFood, IFoodSlice} from "../reducers/foods";
import {ThunkAction} from "redux-thunk";

export type IFoodActions = IFoodFetchDataSuccessAction
    | IFoodHasErroredAction
    | IFoodIsLoadingAction;

export enum FoodActionTypes {
    FOOD_HAS_ERRORED = 'FOOD_HAS_ERRORED',
    FOOD_IS_LOADING = 'FOOD_IS_LOADING',
    FOOD_FETCH_DATA_SUCCESS = 'FOOD_FETCH_DATA_SUCCESS'
}

export interface IFoodFetchDataSuccessAction extends Action<FoodActionTypes.FOOD_FETCH_DATA_SUCCESS> {
    foods: IPaginatedResponse<IFood>;
}

export const foodFetchDataSuccess: ActionCreator<ThunkAction<void, IFoodSlice, any, IFoodFetchDataSuccessAction>> = (foods: IPaginatedResponse<IFood>) =>
    (dispatch: Dispatch<IFoodFetchDataSuccessAction>) => dispatch({
        type: FoodActionTypes.FOOD_FETCH_DATA_SUCCESS,
        foods
    });

export interface IFoodHasErroredAction extends Action<FoodActionTypes.FOOD_HAS_ERRORED> {
    hasErrored: boolean
}

export const foodHasErrored: ActionCreator<ThunkAction<void, IFoodSlice, any, IFoodHasErroredAction>> = (hasErrored: boolean) => (dispatch: Dispatch<IFoodHasErroredAction>) => dispatch({
    type: FoodActionTypes.FOOD_HAS_ERRORED,
    hasErrored
});

export interface IFoodIsLoadingAction extends Action<FoodActionTypes.FOOD_IS_LOADING> {
    isLoading: boolean
}

export const foodIsLoading: ActionCreator<ThunkAction<void, IFoodSlice, any, IFoodIsLoadingAction>> = (isLoading: boolean) => (dispatch: Dispatch<IFoodIsLoadingAction>) => dispatch({
    type: FoodActionTypes.FOOD_IS_LOADING,
    isLoading
});

type FoodsFetchAllActions = IFoodIsLoadingAction | IFoodHasErroredAction | IFoodFetchDataSuccessAction;

export function foodsFetchAll(search: string, archived: boolean): ThunkResult<void> {
    const params = {search, archived};
    return (dispatch: Dispatch<any>) => {
        dispatch(foodIsLoading(true));
        axios.get(API_FOODS, {params: params})
            .then(response => {
                dispatch(foodIsLoading(false));
                return response;
            })
            .then(response => response.data)
            .then(foods => dispatch(foodFetchDataSuccess(foods)))
            .catch(() => dispatch(foodHasErrored(true)));
    };
}