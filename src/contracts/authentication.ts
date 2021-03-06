export interface IAuthenticationService {
  login(username: string, password: string): Promise<IIdentity>;
  logout(): Promise<void>;
  getToken(): string;
  hasToken(): boolean;
  getIdentity(): IIdentity;
}

export interface IAuthenticationRepository {
  login(username: string, password: string): Promise<ILoginResult>;
  logout(): Promise<ILogoutResult>;
  getIdentity(token: string): Promise<any>;
}

export interface ILoginResult {
  identity: IIdentity;
  token: string;
}

export interface ILogoutResult {
  result: boolean;
}

export interface IIdentity {
  id: string;
  name: string;
  roles: Array<string>;
}

export enum AuthenticationStateEvent {
  LOGIN = 'login',
  LOGOUT = 'logout',
}
