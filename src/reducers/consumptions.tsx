export function consumptionsHasErrored(state = false, action) {
    switch (action.type) {
        case 'CONSUMPTIONS_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

export function consumptionsIsLoading(state = false, action) {
    switch (action.type) {
        case 'CONSUMPTIONS_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}

export function consumptions(state = {}, action) {
    switch (action.type) {
        case 'CONSUMPTIONS_FETCH_DATA_SUCCESS':
            return action.consumptions;
        default:
            return state;
    }
}