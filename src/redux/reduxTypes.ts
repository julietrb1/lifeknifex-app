import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
// eslint-disable-next-line import/no-cycle
import { RootState } from './rootReducer';

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
