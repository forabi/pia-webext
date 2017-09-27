import * as React from 'react';
import { connect } from 'react-redux';
import { store, DispatchProps } from '../../store';
import { DispatchProp } from 'react-redux';
import linkState from 'linkstate';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import yellow from 'material-ui/colors/yellow';

type Props = Pick<State, 'username' | 'password' | 'isLoggingIn'> & {
  hasError: boolean;
} & DispatchProps & DispatchProp<State>;

class LoginPage extends React.Component<Props, { }> {
  setValue = (key: keyof State) => (ev: any) => {
    this.props.dispatch({
      type: 'PATCH_STATE',
      payload: {
        [key]: ev.target.value,
        lastLoginError: null,
      },
    });
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
        <div style={{ backgroundColor: yellow[500] }}>
          Warning: this is an unofficial extension.
          Use at your own risk.
        </div>
        {/* <Grid> */}
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
        {/* </Grid> */}
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
