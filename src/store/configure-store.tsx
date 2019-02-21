import {applyMiddleware, createStore} from 'redux';
import thunk, {ThunkAction} from 'redux-thunk';
import rootReducer, {RootState} from '../reducers';
import {IGoalsActions} from "../actions/goals";

export type RootActions = IGoalsActions;
export type ThunkResult<R> = ThunkAction<R, RootState, undefined, RootActions>;

export default function configureStore(initialState: any) {
    return createStore<RootState, RootActions, {}, {}>(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
}