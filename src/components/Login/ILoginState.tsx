export interface ILoginState {
    username: string;
    password: string;
    loggingIn: boolean;
    submissionError: string;
    isRegistrationEnabled: boolean;
    usernameError: boolean;
    passwordError: boolean;
}