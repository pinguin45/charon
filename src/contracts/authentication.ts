export interface IAuthenticationService {
  login(username: string, password: string): Promise<IIdentity>;
  logout(): Promise<void>;
  getToken(): string;
  hasToken(): boolean;
  getIdentity(): IIdentity;
}

export interface IAuthenticationRepository {
  login(username: string, password: string): Promise<any>;
  logout(): Promise<void>;
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
