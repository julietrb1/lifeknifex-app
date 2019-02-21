import {API_CONSUMPTIONS} from "../Backend";
import axios from "axios";

export function consumptionsHasErrored(hasErrored: boolean) {
    return {
        type: 'CONSUMPTIONS_HAS_ERRORED',
        hasErrored
    };
}

export function consumptionsIsLoading(isLoading: boolean) {
    return {
        type: 'CONSUMPTIONS_IS_LOADING',
        isLoading
    };
}

export function consumptionsFetchDataSuccess(consumptions: any) {
    return {
        type: 'CONSUMPTIONS_FETCH_DATA_SUCCESS',
        consumptions
    };
}

export function consumptionsFetchAll() {
    return (dispatch: any) => {
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