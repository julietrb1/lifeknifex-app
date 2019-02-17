import {combineReducers} from 'redux';
import {foods, foodsHasErrored, foodsIsLoading} from './foods';
import {goals, goalsHasErrored, goalsIsLoading} from './goals';
import {answers, answersHasErrored, answersIsLoading} from './answers';

export default combineReducers({
    foods, foodsHasErrored, foodsIsLoading,
    goals, goalsHasErrored, goalsIsLoading,
    answers, answersHasErrored, answersIsLoading
});