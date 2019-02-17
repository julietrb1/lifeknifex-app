export function goalsHasErrored(state = false, action) {
    switch (action.type) {
        case 'GOALS_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

export function goalsIsLoading(state = false, action) {
    switch (action.type) {
        case 'GOALS_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}

export function goals(state = {}, action) {
    switch (action.type) {
        case 'GOALS_FETCH_DATA_SUCCESS':
            return action.goals;
        default:
            return state;
    }
}