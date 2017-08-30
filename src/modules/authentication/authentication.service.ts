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

  public login(username: string, password: string): Promise<IIdentity> {
    return this.authenticationRepository.login(username, password)
      .then((result: any) => {
        if (result.token) {
          this.token = result.token;
        }
        if (result.identity) {
          this.identity = result.identity;
        }
        return result.identity;
      })
      .then((identity: IIdentity) => {
        this.eventAggregator.publish(AuthenticationStateEvent.LOGIN, identity);
        return identity;
      });
  }

  public logout(): Promise<any> {
    return this.authenticationRepository.logout()
      .then((result: any) => {
        this.token = null;
        return result;
      })
      .then((result: any) => {
        this.eventAggregator.publish(AuthenticationStateEvent.LOGOUT);
        return result;
      });
  }

  public hasToken(): boolean {
    return this.token !== null && this.token !== undefined && this.token !== '';
  }
}
