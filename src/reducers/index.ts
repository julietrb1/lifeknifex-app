import {combineReducers} from 'redux';
import {foods, foodsHasErrored, foodsIsLoading, IFoodsReduxState} from './foods';
import {goals, goalsHasErrored, goalsIsLoading, goalsResponse} from './goals';
import {answers, answersHasErrored, answersIsLoading} from './answers';
import {consumptions, consumptionsHasErrored, consumptionsIsLoading} from "./consumptions";
import {reducer as toastrReducer} from 'react-redux-toastr';

export type RootState = IFoodsReduxState & GoalsReduxState & AnswersReduxState & ConsumptionsReduxState;

export default combineReducers({
    foods, foodsHasErrored, foodsIsLoading,
    goals, goalsHasErrored, goalsIsLoading, goalsResponse,
    answers, answersHasErrored, answersIsLoading,
    consumptions, consumptionsHasErrored, consumptionsIsLoading,
    toastrReducer
});