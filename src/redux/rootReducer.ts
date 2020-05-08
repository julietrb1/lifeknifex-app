import {combineReducers} from '@reduxjs/toolkit';
import {foodResponse, foods, foodsHasErrored, foodsIsLoading, IFoodSlice} from '../reducers/foods';
import {goals, goalsHasErrored, goalsIsLoading, goalsResponse, IGoalSlice} from '../reducers/goals';
import {answers, answersHasErrored, answersIsLoading, IAnswerSlice} from '../reducers/answers';
import {consumptions, consumptionsHasErrored, consumptionsIsLoading, IConsumptionSlice} from "../reducers/consumptions";
// import {reducer as toastrReducer} from 'react-redux-toastr'; // TODO: Add toastr

export type RootState = IFoodSlice & IAnswerSlice & IConsumptionSlice & IGoalSlice;

const rootReducer = combineReducers({
    foods, foodsHasErrored, foodsIsLoading, foodResponse,
    goals, goalsHasErrored, goalsIsLoading, goalsResponse,
    answers, answersHasErrored, answersIsLoading,
    consumptions, consumptionsHasErrored, consumptionsIsLoading
});
export default rootReducer;