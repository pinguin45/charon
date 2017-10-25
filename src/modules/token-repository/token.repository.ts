import {IIdentity, ITokenRepository} from '@process-engine/consumer_client';

export class TokenRepository implements ITokenRepository {

  private identity: IIdentity;
  private token: string;

  public getToken(): string {
    return this.token;
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public getIdentity(): IIdentity {
    return this.identity;
  }

  public setIdentity(identity: IIdentity): void {
    this.identity = identity;
  }
}
