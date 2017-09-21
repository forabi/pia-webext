import * as React from 'react';
import { connect } from 'react-redux';
import { store, DispatchProps } from '../../store';
import linkState from 'linkstate';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

type Props = Pick<State, 'username' | 'password' | 'isLoggingIn'> & {
  hasError: boolean;
} & DispatchProps;

class LoginPage extends React.Component<Props, void> {
  setValue = (key: keyof State) => (ev: any) => {
    this.props.dispatch({
      type: 'PATCH_STATE',
      payload: {
        [key]: ev.target.value,
        lastLoginError: null,
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

  render() {
    const { username, password, hasError, isLoggingIn } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          type="text"
          name="username"
          label="Username"
          disabled={isLoggingIn}
          error={hasError}
          value={username || ''}
          onInput={this.setValue('username')}
        />
        <TextField
          type="password"
          name="password"
          label="Password"
          disabled={isLoggingIn}
          error={hasError}
          value={password || ''}
          onInput={this.setValue('password')}
        />
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
  hasError: state.lastLoginError !== null,
}))(LoginPage);
