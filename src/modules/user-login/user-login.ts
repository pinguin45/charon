import {bindable, computedFrom, inject} from 'aurelia-framework';
import {IAuthenticationService, IIdentity} from '../../contracts/index';

@inject('AuthenticationService')
export class UserLogin {

  private authenticationService: IAuthenticationService;
  private dropdown: HTMLLIElement;
  private windowClickListener: (event: MouseEvent) => void;
  @bindable()
  private username: string;
  @bindable()
  private password: string;
  @bindable()
  private loginError: string;

  constructor(authenticationService: IAuthenticationService) {
    this.authenticationService = authenticationService;
    this.windowClickListener = (event: MouseEvent): void => {
      const node: Node = event.target as Node;
      if (this.dropdown.contains(node)) {
        return;
      }
      this.closeDropdown();
    };
  }

  public get hasValidInput(): boolean {
    const validUsername: boolean = this.username !== null && this.username !== undefined && this.username !== '';
    const validPassword: boolean = this.password !== null && this.password !== undefined && this.password !== '';
    return validUsername && validPassword;
  }

  public async login(): Promise<void> {
    try {
      await this.authenticationService.login(this.username, this.password);
      this.closeDropdown();
      this.username = null;
      this.password = null;
      this.loginError = null;
    } catch (error) {
      this.loginError = error.message;
    }
  }

  public logout(): void {
    this.authenticationService.logout();
    this.closeDropdown();
  }

  public toggleDropdown(): void {
    if (this.dropdown.classList.contains('open')) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  public openDropdown(): void {
    this.dropdown.classList.add('open');
    setTimeout(() => {
      window.addEventListener('click', this.windowClickListener);
    });
  }

  public closeDropdown(): void {
    this.dropdown.classList.remove('open');
    window.removeEventListener('click', this.windowClickListener);
  }

  @computedFrom('authenticationService.tokenRepository.token')
  public get isLoggedIn(): boolean {
    return this.authenticationService.hasToken();
  }

  @computedFrom('isLoggedIn')
  public get identity(): IIdentity {
    return this.authenticationService.getIdentity();
  }
}
