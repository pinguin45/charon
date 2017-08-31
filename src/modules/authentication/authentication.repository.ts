import {HttpClient} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {IAuthenticationRepository, IIdentity, ILoginResult} from '../../contracts';

const HTTP_CODE_OK: number = 200;

@inject(HttpClient)
export class AuthenticationRepository implements IAuthenticationRepository {

  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public login(username: string, password: string): Promise<ILoginResult> {
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
      .then((response: Response): ILoginResult => {
        const result: any = response.json();
        if (result.error) {
          throw new Error(result.error);
        }
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
