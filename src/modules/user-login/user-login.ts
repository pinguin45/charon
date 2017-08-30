import {bindable, computedFrom, inject} from 'aurelia-framework';
import {IAuthenticationService, IIdentity, ILoginResult} from '../../contracts/index';

@inject('AuthenticationService')
export class UserLogin {

  private authenticationService: IAuthenticationService;
  @bindable()
  private username: string;
  @bindable()
  private password: string;

  constructor(authenticationService: IAuthenticationService) {
    this.authenticationService = authenticationService;
  }

  public get hasValidInput(): boolean {
    const validUsername: boolean = this.username !== null && this.username !== undefined && this.username !== '';
    const validPassword: boolean = this.password !== null && this.password !== undefined && this.password !== '';
    return validUsername && validPassword;
  }

  public login(): void {
    this.authenticationService.login(this.username, this.password)
      .then((result: ILoginResult): void => {
        if (result.error) {
          alert(result.error);
        }
      });
  }

  public logout(): void {
    this.authenticationService.logout();
  }

  @computedFrom('authenticationService.token')
  public get isLoggedIn(): boolean {
    return this.authenticationService.hasToken();
  }

  @computedFrom('isLoggedIn')
  public get identity(): IIdentity {
    return this.authenticationService.getIdentity();
  }
}
