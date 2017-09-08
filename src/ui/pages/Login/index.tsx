import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { store, DispatchProps } from '../../store';
import linkState from 'linkstate';

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
          <input
            type="text"
            name="username"
            placeholder="Username (p1234567)"
            disabled={isLoggingIn}
            value={username || ''}
            onInput={this.setValue('username')}
            required
          />
        </label>
        <label>
          <span>Password:</span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            disabled={isLoggingIn}
            value={password || ''}
            onInput={this.setValue('password')}
            required
          />
        </label>
        <button type="submit" disabled={isLoggingIn}>Login</button>
      </form>
    );
  }
}

export const ConnectedLoginPage = connect((state: State): Partial<Props> => ({
  username: state.username,
  password: state.password,
  isLoggingIn: state.isLoggingIn,
}))(LoginPage);
