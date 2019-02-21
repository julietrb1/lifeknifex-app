import {API_FOODS} from "../Backend";
import axios from "axios";
import {Action, Dispatch} from "redux";
import {ThunkResult} from "../store/configure-store";
import {IPaginatedResponse} from "../backend-common";
import {IFood} from "../reducers/foods";

export type IFoodsActions = FoodsFetchDataSuccessAction
    | IFoodsHasErroredAction
    | IFoodsIsLoadingAction;

export enum FoodsActionTypes {
    FOODS_HAS_ERRORED = 'FOODS_HAS_ERRORED',
    FOODS_IS_LOADING = 'FOODS_IS_LOADING',
    FOODS_FETCH_DATA_SUCCESS = 'FOODS_FETCH_DATA_SUCCESS'
}

export interface FoodsFetchDataSuccessAction extends Action<FoodsActionTypes.FOODS_FETCH_DATA_SUCCESS> {
    foods: IPaginatedResponse<IFood>;
}

export interface IFoodsHasErroredAction extends Action<FoodsActionTypes.FOODS_HAS_ERRORED> {
    hasErrored: boolean
}

export interface IFoodsIsLoadingAction extends Action<FoodsActionTypes.FOODS_IS_LOADING> {
    isLoading: boolean
}

type FoodsFetchAllActions = IFoodsIsLoadingAction | IFoodsHasErroredAction | FoodsFetchDataSuccessAction;

export function foodsFetchAll(search: string, archived: boolean): ThunkResult<void> {
    const params = {search, archived};
    return (dispatch: Dispatch<FoodsFetchAllActions>) => {
        dispatch({isLoading: true} as IFoodsIsLoadingAction);
        axios.get(API_FOODS, {params: params})
            .then(response => {
                dispatch({isLoading: false} as IFoodsIsLoadingAction);
                return response;
            })
            .then(response => response.data)
            .then(foods => dispatch({foods} as FoodsFetchDataSuccessAction))
            .catch(() => dispatch({hasErrored: true} as IFoodsHasErroredAction));
    };
}