import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { RootState } from './rootReducer';

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
