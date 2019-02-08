import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar';
import PropTypes from 'prop-types';
import {Button, Divider, Form, Input, Message} from 'semantic-ui-react';
import {extractError} from '../../Utils';
import RequestComponent from '../common/RequestComponent/RequestComponent';
import {getAccount, getFeature, logIn} from '../../Backend';
import {API_FEATURE_REGISTRATION_ENABLED} from '../../constants';

class Login extends RequestComponent {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loggingIn: false,
            submissionError: '',
            isRegistrationEnabled: false
        };
    }

    componentDidMount() {
        this.checkRegistrationEnabled();
        this.checkLoggedIn();
    }

    checkLoggedIn() {
        getAccount(this.cancelToken).then(account => {
            if (account) {
                this.props.history.replace('/');
            }
        });
    }

    performLogin = () => {
        this.setState({
            loggingIn: true
        });
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

    handleChange = (e, {value}) => {
        this.setState({[e.target.name]: value});
    };

    render() {
        return <div className="login">
            <HeaderBar title="Log In" icon='account'/>
            <Divider hidden/>
            <Form error={!!this.state.submissionError} onSubmit={this.performLogin} loading={this.state.loggingIn}>
                <Message
                    error
                    header='Login Failed'
                    content={this.state.submissionError}/>
                <Form.Field>
                    <label>Username</label>
                    <Input name='username' onChange={this.handleChange} value={this.state.username}/>
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <Input name='password' type='password' onChange={this.handleChange} value={this.state.password}/>
                </Form.Field>
                <Button primary type="submit">Log In</Button>
                <this.RegistrationButton/>
            </Form>
        </div>;
    }

    RegistrationButton = () => this.state.isRegistrationEnabled ?
        <Button
            type='button'
            onClick={() => this.props.history.push('/register')}
            basic
        >
            No account? Register now.
        </Button>
        : null;

    checkRegistrationEnabled() {
        getFeature(this.cancelToken, API_FEATURE_REGISTRATION_ENABLED)
            .then(isRegistrationEnabled => this.setState({isRegistrationEnabled}));
    }
}

Login.propTypes = {
    history: PropTypes.object
};

export default Login;