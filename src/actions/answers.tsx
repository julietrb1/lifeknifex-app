import {API_ANSWERS} from "../Backend";
import axios from "axios";

export const ANSWERS_HAS_ERRORED = 'ANSWERS_HAS_ERRORED';
export const ANSWERS_IS_LOADING = 'ANSWERS_IS_LOADING';
export const ANSWERS_FETCH_DATA_SUCCESS = 'ANSWERS_FETCH_DATA_SUCCESS';

export const answersHasErrored = (hasErrored: boolean) => ({type: ANSWERS_HAS_ERRORED, hasErrored});
export const answersIsLoading = (isLoading: boolean) => ({type: ANSWERS_IS_LOADING, isLoading});
export const answersFetchDataSuccess = (answers: any) => ({type: ANSWERS_FETCH_DATA_SUCCESS, answers});

export function answersFetchAll(search: string, archived: boolean) {
    const params = {search, archived};
    return (dispatch: any) => {
        dispatch(answersIsLoading(true));
        axios.get(API_ANSWERS, {params: params})
            .then(response => {
                dispatch(answersIsLoading(false));
                return response;
            })
            .then(response => response.data)
            .then(answers => dispatch(answersFetchDataSuccess(answers)))
            .catch(() => dispatch(answersHasErrored(true)));
    };
}