import {RootState} from "../../redux/rootReducer";

export const selectIsAuthenticated = (state: RootState) => state.authState.isAuthenticated;
export const selectIsLoggingIn = (state: RootState) => state.authState.isLoggingIn;
export const selectLoginError = (state: RootState) => state.authState.loginError;
export const selectAccount = (state: RootState) => state.authState.account;