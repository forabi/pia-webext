import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store, DispatchProps } from '../../store';

type Props = Pick<State, 'serverId' | 'serverList'> & DispatchProps;

class ServerSelectionPage extends Component<Props, void> {
  setServer = (key: string) => () => {
    this.props.dispatch({
      type: 'PATCH_STATE',
      payload: {
        serverId: key,
        isEnabled: true,
      },
    })
  }

  render({ serverId, serverList }: Props) {
    console.log('props', this.props);
    return (
      <ul>
        {
          Object.keys(serverList).map(key => {
            const server = serverList[key];
            return (
              <li key={key}>
                <label>
                  {server.name}
                  <input
                    type="radio"
                    name="server"
                    checked={key === serverId}
                    onChange={this.setServer(key)}
                  />
                </label>
              </li>
            );
          })
        }
      </ul>
    );
  }
}

export const ConnectedServerSelectionPage = connect((state: State): Partial<Props> => {
  return {
    serverId: state.serverId,
    serverList: state.serverList,
  };
})(ServerSelectionPage);
