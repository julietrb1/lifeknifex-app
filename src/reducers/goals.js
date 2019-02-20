import update from 'immutability-helper';

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
        case 'GOAL_UPDATE_ANSWER_SUCCESS':
            const goalIndex = state.results.findIndex(goal => goal.url === action.answer.goal);
            if (goalIndex < 0) {
                return state;
            }
            return update(state, {
                results: {
                    [goalIndex]: {
                        todays_answer_value: {
                            $set: action.answer.value
                        }
                    }
                }
            });
        default:
            return state;
    }
}