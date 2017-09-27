import * as React from 'react';
import { getIsLoggedIn, getServerId, initializeStore, initialState, store } from './store';
import { Provider, connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { render } from 'react-dom';
import { ConnectedLoggedInPage } from './pages/LoggedIn';
import { ConnectedLoginPage } from './pages/Login';
import { ConnectedServerSelectionPage } from './pages/ServerSelection';

type Props = Pick<State, 'serverId' | 'isLoggedIn'>;

class App extends React.Component<Props, { }> {
  render() {
    const { isLoggedIn, serverId } = this.props;
    if (!isLoggedIn) {
      return <ConnectedLoginPage />
    } else if (!serverId) {
      return <ConnectedServerSelectionPage />
    } else {
      return <ConnectedLoggedInPage />;
    }
  }
}

const ConnectedApp = connect((state: State): Partial<Props> => ({
  isLoggedIn: getIsLoggedIn(state),
  serverId: getServerId(state),
}))(App);

const theme = createMuiTheme();

const renderApp = (savedState?: Partial<State>) => {
  store.dispatch(initializeStore({
    ...initialState,
    ...savedState,
    isLoggingIn: false,
    isLoggedIn: false,
  }));

  render(
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <ConnectedApp />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('container'),
  );
}

if ('browser' in window) {
  browser.storage.local
    .get(Object.keys(initialState))
    .then(renderApp);
} else {
  renderApp();
}