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
