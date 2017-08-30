export interface IAuthenticationService {
  login(username: string, password: string): Promise<ILoginResult>;
  logout(): Promise<any>;
  getToken(): string;
  hasToken(): boolean;
  getIdentity(): IIdentity;
}

export interface IAuthenticationRepository {
  login(username: string, password: string): Promise<any>;
  logout(): Promise<any>;
}

export interface ILoginResult {
  identity?: IIdentity;
  error?: string;
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
