import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../redux/store";
import {reqGetAccount, reqLogInGet, reqLogInPost, reqLogOut} from "../../backend";
import IAccount from "../../models/IAccount";

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
    account: null
};

const authSlice = createSlice({
    name: 'auth', initialState: initialState, reducers: {
        loginStart: (state: IAuthState) => {
            state.isLoggingIn = true;
            state.loginError = '';
        }, loginSuccess: (state: IAuthState) => {
            state.isAuthenticated = true;
            state.isLoggingIn = false;
        }, loginFailure: (state: IAuthState, {payload: loginError}: PayloadAction<string>) => {
            state.isLoggingIn = false;
            state.loginError = loginError;
            state.isAuthenticated = false;
        }, logoutPerform: (state: IAuthState) => {
            state.isAuthenticated = false;
            state.isLoggingIn = false;
            state.loginError = '';
        }, accountFetchSuccess: (state: IAuthState, {payload: account}: PayloadAction<IAccount | null>) => {
            state.account = account;
            state.isAuthenticated = true;
            state.loginError = '';
        }
    }
});

export const {loginFailure, loginStart, loginSuccess, logoutPerform, accountFetchSuccess} = authSlice.actions;

export default authSlice.reducer;

export const logIn = (username: string, password: string): AppThunk => async dispatch => {
    dispatch(loginStart());
    try {
        await reqLogInGet();
        await reqLogInPost(username, password);
        dispatch(loginSuccess());

    } catch (e) {
        dispatch(loginFailure(e.toString()));
    }
};

export const logOut = (): AppThunk => async dispatch => {
    try {
        await reqLogOut();
    } finally {
        dispatch(logoutPerform());
    }
};

export const fetchAccount = (): AppThunk => async dispatch => {
    try {
        dispatch(loginStart());
        const {data: account} = await reqGetAccount();
        dispatch(accountFetchSuccess(account));
    } catch (e) {
        dispatch(loginFailure(e.toString()));
    }
}