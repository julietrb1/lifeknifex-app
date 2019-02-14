import {API_FOODS, instance} from "../Backend";

export function foodsHasErrored(bool) {
    return {
        type: 'FOODS_HAS_ERRORED',
        hasErrored: bool
    };
}

export function foodsIsLoading(bool) {
    return {
        type: 'FOODS_IS_LOADING',
        isLoading: bool
    };
}

export function foodsFetchDataSuccess(foods) {
    return {
        type: 'FOODS_FETCH_DATA_SUCCESS',
        foods
    };
}

export function foodsFetchAll(search, isArchivedVisible) {
    const params = {};
    if (search && search.length) {
        params['search'] = search;
    }

    if (isArchivedVisible) {
        params['archived'] = 1;
    }

    return dispatch => {
        dispatch(foodsIsLoading(true));
        instance.get(API_FOODS, {params: params})
            .then(response => {
                dispatch(foodsIsLoading(false));
                return response;
            })
            .then(response => response.data)
            .then(foods => dispatch(foodsFetchDataSuccess(foods)))
            .catch(() => dispatch(foodsHasErrored(true)));
    };
}