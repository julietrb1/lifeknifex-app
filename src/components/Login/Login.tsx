import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar';
import {Button, Divider, Form, InputOnChangeData, Message} from 'semantic-ui-react';
import {extractError} from '../../Utils';
import RequestComponent from '../common/RequestComponent/RequestComponent';
import {logIn} from '../../Backend';
import {RouteComponentProps} from "react-router";
import {ILoginState} from "./ILoginState";

interface ILoginMatchParams {

}

class Login extends RequestComponent<RouteComponentProps<ILoginMatchParams>, ILoginState> {
    state = {
        username: '',
        password: '',
        loggingIn: false,
        submissionError: '',
        isRegistrationEnabled: false,
        usernameError: false,
        passwordError: false
    };

    componentDidMount() {
        // TODO: Implement check for registration enabled
        // this.checkRegistrationEnabled();
        // ensureLoggedIn()
        //     .then(() => this.props.history.replace('/'))
        //     .catch(() => console.debug('Not logged in'));
    }
    performLogin = () => {
        if (this.state.loggingIn) {
            return;
        }

        this.setState({usernameError: !this.state.username});
        this.setState({passwordError: !this.state.password});

        if (!this.state.username ||
            !this.state.password) {
            this.setState({submissionError: 'Username and password required'});
            return;
        }

        this.setState({loggingIn: true});
        logIn(this.cancelToken, this.state.username, this.state.password)
            .then(account => {
                if (account) {
                    this.props.history.replace('/');
                }
            }).catch(err => {
            this.setState({
                loggingIn: false,
                submissionError: extractError(err)
            });
        });
    };

    handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
        this.setState({username: value});
    };

    handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
        this.setState({password: value});
    };

    render() {
        return <div className="login">
            <HeaderBar title="Log In" icon='account'/>
            <Divider hidden/>
            <Form error={!!this.state.submissionError} onSubmit={this.performLogin} loading={this.state.loggingIn}>
                <Message
                    error
                    header='Logging In Failed'
                    content={this.state.submissionError}/>
                <Form.Field required>
                    <label>Username</label>
                    <Form.Input error={this.state.usernameError} name='username' onChange={this.handleUsernameChange}
                                value={this.state.username}/>
                </Form.Field>
                <Form.Field required>
                    <label>Password</label>
                    <Form.Input error={this.state.passwordError} name='password' type='password'
                                onChange={this.handlePasswordChange} value={this.state.password}/>
                </Form.Field>
                <Button primary type="submit">Log In</Button>
                <this.RegistrationButton/>
            </Form>
        </div>;
    }

    RegistrationButton = () => this.state.isRegistrationEnabled ?
        <Button
            type='button'
            onClick={() => this.props.history.replace('/register')}
            basic
        >
            No account? Register now.
        </Button>
        : null;

    // TODO: Implement check for registration enabled
    // checkRegistrationEnabled() {
    //     getFeature(this.cancelToken, API_FEATURE_REGISTRATION_ENABLED)
    //         .then(isRegistrationEnabled => this.setState({isRegistrationEnabled}));
    // }
}

export default Login;