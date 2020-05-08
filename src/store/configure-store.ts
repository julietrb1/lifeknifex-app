import {Action, applyMiddleware, createStore} from 'redux';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import rootReducer, {RootState} from '../reducers';
import {IGoalsActions} from "../actions/goals";
import {IFoodActions} from "../actions/foods";
import {IConsumptionActions} from "../actions/consumptions";

export type RootActions = IGoalsActions | IFoodActions | IConsumptionActions; // TODO: Properly configure RootState and RootActions
export type ThunkResult<R> = ThunkAction<R, RootState, undefined, RootActions>;
export type MyThunkDispatch = ThunkDispatch<RootState, undefined, Action>;

export default function configureStore(initialState: any) {
    return createStore<RootState, RootActions, {}, {}>(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
}