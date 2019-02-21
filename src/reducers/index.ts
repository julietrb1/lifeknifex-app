import {combineReducers} from 'redux';
import {foods, foodsHasErrored, foodsIsLoading, IFoodSlice} from './foods';
import {goals, goalsHasErrored, goalsIsLoading, goalsResponse, IGoalSlice} from './goals';
import {answers, answersHasErrored, answersIsLoading, IAnswerSlice} from './answers';
import {consumptions, consumptionsHasErrored, consumptionsIsLoading, IConsumptionSlice} from "./consumptions";
// import {reducer as toastrReducer} from 'react-redux-toastr'; // TODO: Add toastr

export type RootState = IFoodSlice & IAnswerSlice & IConsumptionSlice & IGoalSlice;

export default combineReducers({
    foods, foodsHasErrored, foodsIsLoading,
    goals, goalsHasErrored, goalsIsLoading, goalsResponse,
    answers, answersHasErrored, answersIsLoading,
    consumptions, consumptionsHasErrored, consumptionsIsLoading
});