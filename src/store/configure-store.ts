import {applyMiddleware, createStore} from 'redux';
import thunk, {ThunkAction} from 'redux-thunk';
import rootReducer, {RootState} from '../reducers';
import {IGoalsActions} from "../actions/goals";
import {IFoodsActions} from "../actions/foods";
import {IConsumptionsActions} from "../actions/consumptions";

export type RootActions = IGoalsActions | IFoodsActions | IConsumptionsActions; // TODO: Properly configure RootState and RootActions
export type ThunkResult<R> = ThunkAction<R, RootState, undefined, RootActions>;

export default function configureStore(initialState: any) {
    return createStore<RootState, RootActions, {}, {}>(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
}