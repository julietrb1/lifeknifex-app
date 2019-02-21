import {combineReducers} from 'redux';
import {foods, foodsHasErrored, foodsIsLoading} from './foods';
import {goals, goalsHasErrored, goalsIsLoading, goalsResponse} from './goals';
import {answers, answersHasErrored, answersIsLoading} from './answers';
import {consumptions, consumptionsHasErrored, consumptionsIsLoading} from "./consumptions";
import {reducer as toastrReducer} from 'react-redux-toastr';

export default combineReducers({
    foods, foodsHasErrored, foodsIsLoading,
    goals, goalsHasErrored, goalsIsLoading, goalsResponse,
    answers, answersHasErrored, answersIsLoading,
    consumptions, consumptionsHasErrored, consumptionsIsLoading,
    toastrReducer
});