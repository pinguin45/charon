import {ITokenRepository} from '@process-engine/consumer_client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {
  AuthenticationStateEvent,
  IAuthenticationRepository,
  IAuthenticationService,
  IIdentity,
  ILoginResult,
  ILogoutResult,
} from '../../contracts/index';

const LOCAL_STORAGE_TOKEN_KEY: string = 'process-engine-token';

@inject(EventAggregator, 'AuthenticationRepository', 'TokenRepository')
export class AuthenticationService implements IAuthenticationService {

  private eventAggregator: EventAggregator;
  private authenticationRepository: IAuthenticationRepository;
  private tokenRepository: ITokenRepository;

  constructor(eventAggregator: EventAggregator, authenticationRepository: IAuthenticationRepository, tokenRepository: ITokenRepository) {
    this.eventAggregator = eventAggregator;
    this.authenticationRepository = authenticationRepository;
    this.tokenRepository = tokenRepository;
    this.initialize();
  }

  public async initialize(): Promise<void> {
    const savedToken: string = window.localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (savedToken === undefined || savedToken === null || savedToken === '') {
      return;
    }
    // try to get the identity from the saved token
    let identity: IIdentity;
    try {
      identity = await this.authenticationRepository.getIdentity(savedToken);
    } catch (error) {
      // token is no longer valid, so we remove it from
      // the localstorage
      window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      return;
    }
    this.tokenRepository.setToken(savedToken);
    this.tokenRepository.setIdentity(identity);
  }

  public getToken(): string {
    return this.tokenRepository.getToken();
  }

  public getIdentity(): IIdentity {
    return this.tokenRepository.getIdentity();
  }

  public async login(username: string, password: string): Promise<IIdentity> {
    const result: ILoginResult = await this.authenticationRepository.login(username, password);
    this.tokenRepository.setToken(result.token);
    this.tokenRepository.setIdentity(result.identity);
    this.eventAggregator.publish(AuthenticationStateEvent.LOGIN, result.identity);
    window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, result.token);
    return result.identity;
  }

  public async logout(): Promise<void> {
    const result: any = await this.authenticationRepository.logout();
    this.tokenRepository.setToken(null);
    this.tokenRepository.setIdentity(null);
    this.eventAggregator.publish(AuthenticationStateEvent.LOGOUT);
    window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    return result;
  }

  public hasToken(): boolean {
    const token: string = this.tokenRepository.getToken();
    return token !== null && token !== undefined && token !== '';
  }
}
