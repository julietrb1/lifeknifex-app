import {API_CONSUMPTIONS} from "../Backend";
import axios from "axios";

export function consumptionsHasErrored(bool) {
    return {
        type: 'CONSUMPTIONS_HAS_ERRORED',
        hasErrored: bool
    };
}

export function consumptionsIsLoading(bool) {
    return {
        type: 'CONSUMPTIONS_IS_LOADING',
        isLoading: bool
    };
}

export function consumptionsFetchDataSuccess(consumptions) {
    return {
        type: 'CONSUMPTIONS_FETCH_DATA_SUCCESS',
        consumptions
    };
}

export function consumptionsFetchAll() {
    return dispatch => {
        dispatch(consumptionsIsLoading(true));
        axios.get(API_CONSUMPTIONS)
            .then(response => {
                dispatch(consumptionsIsLoading(false));
                return response;
            })
            .then(response => response.data)
            .then(consumptions => dispatch(consumptionsFetchDataSuccess(consumptions)))
            .catch(() => dispatch(consumptionsHasErrored(true)));
    };
}