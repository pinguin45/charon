import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {IAuthenticationRepository, IIdentity, ILoginResult} from '../../contracts';
import environment from '../../environment';

const HTTP_CODE_OK: number = 200;

@inject(HttpClient)
export class AuthenticationRepository implements IAuthenticationRepository {

  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public async login(username: string, password: string): Promise<ILoginResult> {
    const options: RequestInit = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };

    const url: string = `${environment.processengine.routes.iam}/login`;
    const response: Response = await this.http.fetch(url, options);
    const result: any = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }
    return result;
  }

  public async logout(): Promise<any> {
    const url: string = `${environment.processengine.routes.iam}/logout`;
    const response: Response = await this.http.fetch(url, { method: 'get' });
    return response.json();
  }
}
