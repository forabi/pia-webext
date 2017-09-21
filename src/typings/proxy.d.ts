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
