import {combineReducers} from 'redux';
import {foods, foodsHasErrored, foodsIsLoading} from './foods';
import {goals, goalsHasErrored, goalsIsLoading} from './goals';

export default combineReducers({
    foods, foodsHasErrored, foodsIsLoading,
    goals, goalsHasErrored, goalsIsLoading
});