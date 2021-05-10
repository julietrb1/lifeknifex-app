import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reqGetAccount, reqLogIn, reqLogOut } from '../../backend';
import IAccount from '../../models/IAccount';
import { extractStoreError } from '../../Utils';
import { AppThunk } from '../../redux/reduxTypes';

interface IAuthState {
  isAuthenticated: boolean | null;
  isLoggingIn: boolean;
  loginError: string;
  account: IAccount | null;
}

const initialState: IAuthState = {
  isAuthenticated: null,
  isLoggingIn: false,
  loginError: '',
  account: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state: IAuthState) => {
      state.isLoggingIn = true;
      state.loginError = '';
    },
    loginSuccess: (state: IAuthState, { payload: account }: PayloadAction<IAccount>) => {
      state.account = account;
      state.isAuthenticated = true;
      state.isLoggingIn = false;
    },
    loginFailure: (state: IAuthState, { payload: loginError }: PayloadAction<string>) => {
      state.isLoggingIn = false;
      state.loginError = loginError;
      state.isAuthenticated = false;
      state.account = null;
    },
    logoutPerform: (state: IAuthState) => {
      state.isAuthenticated = false;
      state.isLoggingIn = false;
      state.loginError = '';
      state.account = null;
    },
  },
});

export const {
  loginFailure, loginStart, loginSuccess, logoutPerform,
} = authSlice.actions;

export default authSlice.reducer;

export const logIn = (username: string, password: string): AppThunk => async (dispatch) => {
  dispatch(loginStart());
  try {
    const { data: account } = await reqLogIn(username, password);
    dispatch(loginSuccess(account));
    return account;
  } catch (e) {
    const message = extractStoreError(e);
    dispatch(loginFailure(message));
    throw Error(message);
  }
};

export const logOut = (): AppThunk => async (dispatch) => {
  dispatch(loginStart());
  try {
    await reqLogOut();
  } finally {
    dispatch(logoutPerform());
  }
};

export const fetchAccount = (): AppThunk => async (dispatch) => {
  try {
    dispatch(loginStart());
    const { data: account } = await reqGetAccount();
    dispatch(loginSuccess(account));
    return account;
  } catch (e) {
    dispatch(loginFailure(''));
    throw Error(extractStoreError(e));
  }
};
