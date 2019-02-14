export function foodsHasErrored(state = false, action) {
    switch (action.type) {
        case 'FOODS_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

export function foodsIsLoading(state = false, action) {
    switch (action.type) {
        case 'FOODS_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}

export function foods(state = {}, action) {
    switch (action.type) {
        case 'FOODS_FETCH_DATA_SUCCESS':
            return action.foods;
        default:
            return state;
    }
}