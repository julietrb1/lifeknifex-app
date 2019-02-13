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