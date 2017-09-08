type Server = {
  name: string;
  dns: string;
  iso: string;
  port: number;
  mace: number;
};

type State = {
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  lastLoginError: string | null;
  isEnabled: boolean;
  username: string | null;
  password: string | null;
  bypassList: string[];
  serverId: string | null;
  serverList: {
    [id: string]: Server;
  };
};

type ProxyScriptConfig = {
  server: Server | null;
  isEnabled: boolean;
  bypassList: string[];
};

type ProxyScriptPayloadsByMessageType = {
  SET_CONFIG: ProxyScriptConfig;
  PATCH_CONFIG: Partial<ProxyScriptConfig>;
};

type ProxyScriptMessageType = keyof ProxyScriptPayloadsByMessageType;

type ProxyScriptMessage<T extends ProxyScriptMessageType> = {
  type: T;
  payload: ProxyScriptPayloadsByMessageType[T];
};


type ProxyHandlerPayloadsByMessageType = {
  INIT: void;
  LOG: any[];
};

type ProxyHandlerMessageType = keyof ProxyHandlerPayloadsByMessageType;

type ProxyHandlerMessage<T extends ProxyHandlerMessageType> = {
  type: T;
  payload: ProxyHandlerPayloadsByMessageType[T];
};