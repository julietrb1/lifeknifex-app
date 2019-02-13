import {combineReducers} from 'redux';
import {foods, foodsHasErrored, foodsIsLoading} from './foods';

export default combineReducers({
    foods,
    foodsHasErrored,
    foodsIsLoading
});