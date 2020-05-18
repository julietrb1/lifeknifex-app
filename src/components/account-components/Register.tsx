import React from 'react';
import {
  Button, Divider, Form, InputOnChangeData, Message,
} from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router-dom';
import HeaderBar from '../common-components/HeaderBar';
import { getFeature } from '../../backend';
import RequestComponent from '../common-components/RequestComponent';
import { API_FEATURE_REGISTRATION_ENABLED } from '../../constants';

interface IRegisterState {
  username: string;
  password: string;
  submitting: boolean;
  submissionErrors: string[];
  usernameError: boolean;
  passwordError: boolean;
}

class Register extends RequestComponent<RouteComponentProps, IRegisterState> {
  state = {
    username: '',
    password: '',
    submitting: false,
    submissionErrors: [''],
    usernameError: false,
    passwordError: false,
  };

  componentDidMount() {
    getFeature(this.cancelToken, API_FEATURE_REGISTRATION_ENABLED)
      .then((isRegistrationEnabled) => {
        if (!isRegistrationEnabled) {
          this.props.history.replace('/login');
        }
      });
  }

  handleSubmit = () => {
    if (this.state.submitting) {
      return;
    }

    // this.setState({ usernameError: !this.state.username });
    // this.setState({ passwordError: !this.state.password });

    if (!this.state.username
            || !this.state.password) {
      this.setState({ submissionErrors: ['Username and password required'] });
      return;
    }

    this.setState({ submitting: true });

    // register(this.cancelToken, this.state.username, this.state.password)
    //     .then(() => this.props.history.replace('/'))
    //     .catch(err => {
    //         this.setState({
    //             submitting: false,
    //             submissionErrors: extractError(err)
    //         });
    //     });
  };

  handleUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData,
  ) => {
    this.setState({ username: value });
  };

  handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData,
  ) => {
    this.setState({ password: value });
  };

  render() {
    return (
      <div className="register">
        <HeaderBar title="Register" icon="account" />
        <Divider hidden />
        <Form
          onSubmit={this.handleSubmit}
          loading={this.state.submitting}
          error={!!this.state.submissionErrors.length}
        >
          <Message
            error
            header="Registration Failed"
            list={this.state.submissionErrors}
            onDismiss={() => this.setState({ submissionErrors: [] })}
          />
          <Form.Field required>
            <label>Username</label>
            <Form.Input
              name="username"
              error={this.state.usernameError}
              value={this.state.username}
              onChange={this.handleUsernameChange}
            />
          </Form.Field>
          <Form.Field required>
            <label>Password</label>
            <Form.Input
              type="password"
              name="password"
              error={this.state.passwordError}
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </Form.Field>
          <Button primary type="submit">Register</Button>
          <Button
            type="button"
            basic
            onClick={() => this.props.history.replace('/login')}
          >
            Log In Instead
          </Button>
        </Form>
      </div>
    );
  }
}

export default Register;
