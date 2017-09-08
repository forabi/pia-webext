import {
  createStore,
  applyMiddleware,
  Store,
  Middleware as ReduxMiddleware,
} from 'redux';
import { createSelector } from 'reselect';

export type Server = {
  name: string;
  dns: string;
  mace: string;
  iso: string;
};

export type State = {
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  lastLoginError: string | null;
  isEnabled: boolean;
  username: string | null;
  password: string | null;
  serverId: string | null;
  serverList: {
    [id: string]: Server;
  };
};

type PayloadsByActionType = {
  INIT: State;
  PATCH_STATE: Partial<State>;
  LOGIN_REQUESTED: null;
  STORAGE_CHANGED: {
    [K in keyof State]?: {
      newValue: State[K];
      oldValue: State[K];
    }
  };
};

type ActionType = keyof PayloadsByActionType;

type Action<T extends ActionType> = {
  type: T;
  payload: PayloadsByActionType[T];
};

type Dispatch = <T extends ActionType>(action: Action<T>) => void;

type Middleware = (store: Store<State>) => (next: Dispatch) => Dispatch;

export type DispatchProps = {
  dispatch: Dispatch;
};

function isActionOfType<T extends ActionType>(
  action: { type: string },
  type: T,
): action is Action<T> {
  return action.type === type;
}

const reducer = (state: State, action: Action<ActionType>) => {
  if (isActionOfType(action, 'PATCH_STATE')) {
    return {
      ...state,
      ...action.payload,
    };
  } else if (isActionOfType(action, 'STORAGE_CHANGED')) {
    const changes = {};
    Object.keys(action.payload).forEach(key => {
      changes[key] = action.payload[key].newValue;
    });
    if (Object.keys(changes).length > 0) {
      return {
        ...state,
        changes,
      };
    }
  } else if (isActionOfType(action, 'INIT')) {
    return action.payload;
  }
  return state;
};

export const initialState: State = {
  isLoggedIn: false,
  isLoggingIn: false,
  lastLoginError: null,
  isEnabled: true,
  password: null,
  username: null,
  serverId: null,
  serverList: {},
};

function createActionCreator<T extends ActionType>(type: T) {
  return (payload: PayloadsByActionType[T]) => ({
    type: type,
    payload: payload,
  });
}

export const patchState = createActionCreator('PATCH_STATE');
export const initializeStore = createActionCreator('INIT');

const AUTH_URL = 'https://www.privateinternetaccess.com/api/client/auth';

const loggerMiddleware: Middleware = () => (next) => action => {
  console.info('Action dispatched', action.type, action.payload);
  return next(action);
}

const loginMiddleware: Middleware = ({ getState }) => next => async action => {
  if (!isActionOfType(action, 'LOGIN_REQUESTED')) {
    next(action);
    return;
  }
  const { password, username } = getState();
  next(patchState({
    isLoggedIn: false,
    isLoggingIn: true,
    lastLoginError: null,
  }));
  try {
    const token = btoa(unescape(encodeURIComponent(username + ':' + password)));
    const authRequest = fetch(AUTH_URL, {
      headers: new Headers({
        Authorization: `Basic ${token}`,
      }),
    });
    const serverListRequest = fetch('https://www.privateinternetaccess.com/api/client/services/https');
    const authResponse = await authRequest;
    const status = authResponse.status;
    if (status === 200) {
      const serverListResponse = await serverListRequest;
      const serverList = await serverListResponse.json();
      console.log('serverList', serverList);
      next(
        patchState({
          isLoggedIn: true,
          isLoggingIn: false,
          lastLoginError: null,
          serverList,
        }),
      );
    } else {
      const body = await authResponse.text();
      next(
        patchState({
          isLoggedIn: false,
          isLoggingIn: false,
          lastLoginError: `${status}: ${body}`,
        }),
      );
    }
  } catch (e) {
    next(
      patchState({
        isLoggedIn: false,
        isLoggingIn: false,
        lastLoginError: `Error: ${e.message}`,
      }),
    );
  }
};

const store = createStore<State>(
  reducer,
  applyMiddleware(...[
    loginMiddleware,
    loggerMiddleware,
  ] as ReduxMiddleware[]),
);

export const getIsLoggedIn = (state: State) => state.isLoggedIn;
export const getIsEnabled = (state: State) => state.isEnabled;
export const getServerList = (state: State) => state.serverList;
export const getServerId = (state: State) => state.serverId;
export const getSelectedServer = createSelector(
  getServerId,
  getServerList,
  (serverId, serverList) => {
    if (!serverId) {
      return null;
    }
    return serverList[serverId];
  },
);
export const isConnected = createSelector(
  getServerId,
  getIsLoggedIn,
  getIsEnabled,
  (serverId, isLoggedIn, isEnabled) => {
    return serverId !== null && isLoggedIn === true && isEnabled === true;
  },
);

store.subscribe(function updateStorage() {
  const state = store.getState();
  browser.storage.local.set(state);
});

store.subscribe(function updateIcon() {
  const state = store.getState();
  const server = getSelectedServer(state);
  const { isLoggedIn, isEnabled } = state;
  if (isConnected(state)) {
    browser.browserAction.setTitle({ title: `Connected to ${server.name}` });
    browser.browserAction.setBadgeText({ text: server.iso });
    browser.browserAction.setIcon({
      path: {
        16: '/images/icons/icon16.png',
        32: '/images/icons/icon32.png',
      },
    });
  } else {
    browser.browserAction.setTitle({ title: 'Not connected' });
    browser.browserAction.setBadgeText({ text: '' });
    browser.browserAction.setIcon({
      path: {
        16: '/images/icons/icon16red.png',
        32: '/images/icons/icon32red.png',
      },
    });
  }
});

export { store };
