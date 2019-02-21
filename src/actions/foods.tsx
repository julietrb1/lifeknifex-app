import {API_FOODS} from "../Backend";
import axios from "axios";

export function foodsHasErrored(hasErrored: boolean) {
    return {
        type: 'FOODS_HAS_ERRORED',
        hasErrored
    };
}

export function foodsIsLoading(isLoading: boolean) {
    return {
        type: 'FOODS_IS_LOADING',
        isLoading
    };
}

export function foodsFetchDataSuccess(foods: any) {
    return {
        type: 'FOODS_FETCH_DATA_SUCCESS',
        foods
    };
}

export function foodsFetchAll(search: string, archived: boolean) {
    const params = {search, archived};
    return (dispatch: any) => {
        dispatch(foodsIsLoading(true));
        axios.get(API_FOODS, {params: params})
            .then(response => {
                dispatch(foodsIsLoading(false));
                return response;
            })
            .then(response => response.data)
            .then(foods => dispatch(foodsFetchDataSuccess(foods)))
            .catch(() => dispatch(foodsHasErrored(true)));
    };
}