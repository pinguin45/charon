import {bindable, computedFrom, inject} from 'aurelia-framework';
import {IAuthenticationService, IIdentity} from '../../contracts/index';

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
      .catch((error: Error): void => {
        alert(error.message);
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
