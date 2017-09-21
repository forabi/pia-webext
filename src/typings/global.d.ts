declare type Server = {
  name: string;
  dns: string;
  iso: string;
  port: number;
  mace: number;
};

declare type State = {
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

declare type ProxyScriptConfig = {
  server: Server | null;
  isEnabled: boolean;
  bypassList: string[];
};

declare type ProxyScriptPayloadsByMessageType = {
  SET_CONFIG: ProxyScriptConfig;
  PATCH_CONFIG: Partial<ProxyScriptConfig>;
};

declare type ProxyScriptMessageType = keyof ProxyScriptPayloadsByMessageType;

declare type ProxyScriptMessage<T extends ProxyScriptMessageType> = {
  type: T;
  payload: ProxyScriptPayloadsByMessageType[T];
};


declare type ProxyHandlerPayloadsByMessageType = {
  INIT: void;
  LOG: any[];
};

declare type ProxyHandlerMessageType = keyof ProxyHandlerPayloadsByMessageType;

declare type ProxyHandlerMessage<T extends ProxyHandlerMessageType> = {
  type: T;
  payload: ProxyHandlerPayloadsByMessageType[T];
};