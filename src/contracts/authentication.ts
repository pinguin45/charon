export interface IAuthenticationService {
  login(username: string, password: string): Promise<IIdentity>;
  logout(): Promise<any>;
  getToken(): string;
  hasToken(): boolean;
  getIdentity(): IIdentity;
}

export interface IAuthenticationRepository {
  login(username: string, password: string): Promise<IIdentity>;
  logout(): Promise<any>;
}

export interface IIdentity {
  id: string;
  name: string;
  roles: Array<String>;
}

export enum AuthenticationStateEvent {
  LOGIN = 'login',
  LOGOUT = 'logout',
}
