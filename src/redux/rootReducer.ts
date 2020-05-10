import {combineReducers} from '@reduxjs/toolkit';
// import {reducer as toastrReducer} from 'react-redux-toastr'; // TODO: Add toastr
import consumptionReducer from '../features/consumptions/consumptionSlice';
import foodReducer from '../features/foods/foodSlice';
import goalReducer from '../features/goals/goalSlice';

const rootReducer = combineReducers({
    consumptionState: consumptionReducer,
    foodState: foodReducer,
    goalState: goalReducer
});
export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;