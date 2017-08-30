import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {IAuthenticationRepository, IIdentity} from '../../contracts';

const HTTP_CODE_OK: number = 200;

@inject(HttpClient)
export class AuthenticationRepository implements IAuthenticationRepository {

  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public login(username: string, password: string): Promise<IIdentity> {
    return this.http
      .fetch('http://localhost:8000/iam/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })
      .then((response: Response) => {
        const result: any = response.json();
        return result;
      });
  }

  public logout(): Promise<any> {
    return this.http
      .fetch('http://localhost:8000/iam/logout', {
        method: 'get',
      })
      .then((response: Response) => {
        return response.json();
      });
  }
}
