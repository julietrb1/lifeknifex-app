import {combineReducers} from 'redux';
import {foods, foodsHasErrored, foodsIsLoading, IFoodsSlice} from './foods';
import {goals, goalsHasErrored, goalsIsLoading, goalsResponse, IGoalsSlice} from './goals';
import {answers, answersHasErrored, answersIsLoading, IAnswersSlice} from './answers';
import {consumptions, consumptionsHasErrored, consumptionsIsLoading, IConsumptionsSlice} from "./consumptions";
// import {reducer as toastrReducer} from 'react-redux-toastr'; // TODO: Add toastr

export type RootState = IFoodsSlice & IAnswersSlice & IConsumptionsSlice & IGoalsSlice;

export default combineReducers({
    foods, foodsHasErrored, foodsIsLoading,
    goals, goalsHasErrored, goalsIsLoading, goalsResponse,
    answers, answersHasErrored, answersIsLoading,
    consumptions, consumptionsHasErrored, consumptionsIsLoading
});