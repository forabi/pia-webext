import { h, Component, render } from 'preact';
import { getIsLoggedIn, getServerId, initializeStore, initialState, State, store } from './store';
import { Provider, connect } from 'preact-redux';
import { ConnectedLoggedInPage } from './pages/LoggedIn';
import { ConnectedLoginPage } from './pages/Login';
import { ConnectedServerSelectionPage } from './pages/ServerSelection';

type Props = Pick<State, 'serverId' | 'isLoggedIn'>;

class App extends Component<Props, void> {
  render({ isLoggedIn, serverId }: Props) {
    console.log('hey');
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

browser.storage.local.get().then((savedState: State) => {
  store.dispatch(initializeStore({
    ...initialState,
    ...savedState,
    isLoggingIn: false,
  }));

  render(
    <Provider store={store}>
      <ConnectedApp />
    </Provider>,
    document.getElementById('container') as Element,
  );
})
