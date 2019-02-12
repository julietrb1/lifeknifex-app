import React from 'react';
import HeaderBar from "../HeaderBar/HeaderBar";
import PropTypes from "prop-types";
import {Button, Divider, Form, Message} from "semantic-ui-react";
import {extractError} from "../../Utils";
import {getFeature, register} from '../../Backend';
import RequestComponent from "../common/RequestComponent/RequestComponent";
import {API_FEATURE_REGISTRATION_ENABLED} from '../../constants';

class Register extends RequestComponent {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            submitting: false,
            submissionError: ''
        };
    }

    componentDidMount() {
        getFeature(this.cancelToken, API_FEATURE_REGISTRATION_ENABLED)
            .then(isRegistrationEnabled => {
                if (!isRegistrationEnabled) {
                    this.props.history.replace('/login');
                }
            });
    }

    handleSubmit = () => {
        if (this.state.submitting) {
            return;
        }

        this.setState({usernameError: !this.state.username});
        this.setState({passwordError: !this.state.password});

        if (!this.state.username ||
            !this.state.password) {
            this.setState({submissionError: ['Username and password required']});
            return;
        }

        this.setState({submitting: true});

        register(this.cancelToken, this.state.username, this.state.password)
            .then(() => this.props.history.replace('/'))
            .catch(err => {
                this.setState({
                    submitting: false,
                    submissionError: extractError(err)
                });
            });
    };

    handleChange = (e, {value}) => {
        this.setState({[e.target.name]: value});
    };

    render() {
        return <div className='register'>
            <HeaderBar title="Register" icon='account'/>
            <Divider hidden/>
            <Form
                onSubmit={this.handleSubmit}
                loading={this.state.submitting}
                error={!!this.state.submissionError}>
                <Message
                    error
                    header='Registration Failed'
                    list={this.state.submissionError}
                    onDismiss={() => this.setState({submissionError: ''})}
                />
                <Form.Field required>
                    <label>Username</label>
                    <Form.Input
                        name="username"
                        error={this.state.usernameError}
                        value={this.state.username}
                        onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field required>
                    <label>Password</label>
                    <Form.Input type="password"
                                name="password"
                                error={this.state.passwordError}
                                value={this.state.password}
                                onChange={this.handleChange}/>
                </Form.Field>
                <Button primary type="submit">Register</Button>
                <Button
                    type='button'
                    basic
                    onClick={() => this.props.history.replace('/login')}>
                    Log In Instead
                </Button>
            </Form>
        </div>;
    }
}

Register.propTypes = {
    history: PropTypes.object
};

export default Register;