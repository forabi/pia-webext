import * as React from 'react';
import { store, getSelectedServer, DispatchProps } from '../../store';
import { connect } from 'react-redux';
import linkState from 'linkstate';

type Props = Pick<State, 'isEnabled'> & {
  server: Server | null,
} & DispatchProps;

class LoginPage extends React.Component<Props, void> {
  toggleEnabled = () => {
    this.props.dispatch({
      type: 'PATCH_STATE',
      payload: {
        isEnabled: !this.props.isEnabled,
      },
    });
  }

  render() {
    const { isEnabled, server } = this.props;
    if (server === null) {
      return <div>Unexpected Error</div>;
    }
    return (
      <label>
        {server.name}
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={this.toggleEnabled}
        />
      </label>
    );
  }
}

export const ConnectedLoggedInPage = connect((state: State): Partial<Props> => ({
  isEnabled: state.isEnabled,
  server: getSelectedServer(state),
}))(LoginPage);
