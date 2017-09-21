import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store, DispatchProps } from '../../store';
import linkState from 'linkstate';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';

type Props = Pick<State, 'username' | 'password' | 'isLoggingIn'> & DispatchProps;

class LoginPage extends Component<Props, void> {
  setValue = (key: keyof State) => (ev: any) => {
    this.props.dispatch({
      type: 'PATCH_STATE',
      payload: {
        [key]: ev.target.value,
      },
    })
  }

  handleSubmit = (e: Event) => {
    e.preventDefault();
    this.props.dispatch({
      type: 'LOGIN_REQUESTED',
      payload: null,
    });
  }

  render({ username, password, isLoggingIn }: Props) {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <span>Username:</span>
          <Input
            type="text"
            name="username"
            placeholder="Username (p1234567)"
            disabled={isLoggingIn}
            value={username || ''}
            onInput={this.setValue('username')}
          />
        </label>
        <label>
          <span>Password:</span>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            disabled={isLoggingIn}
            value={password || ''}
            onInput={this.setValue('password')}
          />
        </label>
        <Button type="submit" disabled={isLoggingIn} raised>
          Login
        </Button>
      </form>
    );
  }
}

export const ConnectedLoginPage = connect((state: State): Partial<Props> => ({
  username: state.username,
  password: state.password,
  isLoggingIn: state.isLoggingIn,
}))(LoginPage);
