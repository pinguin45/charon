import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {
  AuthenticationStateEvent,
  IAuthenticationRepository,
  IAuthenticationService,
  IIdentity,
} from '../../contracts/index';

@inject(EventAggregator, 'AuthenticationRepository')
export class AuthenticationService implements IAuthenticationService {

  private eventAggregator: EventAggregator;
  private authenticationRepository: IAuthenticationRepository;
  private token: string;
  private identity: IIdentity;

  constructor(eventAggregator: EventAggregator, authenticationRepository: IAuthenticationRepository) {
    this.eventAggregator = eventAggregator;
    this.authenticationRepository = authenticationRepository;
  }

  public getToken(): string {
    return this.token;
  }

  public getIdentity(): IIdentity {
    return this.identity;
  }

  public async login(username: string, password: string): Promise<IIdentity> {
    const result: any = await this.authenticationRepository.login(username, password);
    this.token = result.token;
    this.identity = result.identity;
    this.eventAggregator.publish(AuthenticationStateEvent.LOGIN, result.identity);
    return result;
  }

  public async logout(): Promise<void> {
    const result: any =  await this.authenticationRepository.logout();
    this.token = null;
    this.identity = null;
    this.eventAggregator.publish(AuthenticationStateEvent.LOGOUT);
    return result;
  }

  public hasToken(): boolean {
    return this.token !== null && this.token !== undefined && this.token !== '';
  }
}
