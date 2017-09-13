import {inject} from 'aurelia-framework';
import {IAuthenticationService, IMessageBusService} from '../../contracts';
import environment from '../../environment';

@inject('AuthenticationService')
export class MessageBusService implements IMessageBusService {

  private authenticationService: IAuthenticationService;
  private fayeClient: any;
  private messageHandlers: Array<(channel: string, message: any) => void> = new Array();

  constructor(authenticationService: IAuthenticationService) {
    this.authenticationService = authenticationService;
    this.fayeClient = new (<any> window).Faye.Client(environment.processengine.routes.messageBus);
    this.fayeClient.subscribe('/**').withChannel((channel: string, message: any) => {
      this.handleIncommingMessage(channel, message);
    });
  }

  private handleIncommingMessage(channel: string, message: any): void {
    for (const handler of this.messageHandlers) {
      handler(channel, message);
    }
  }

  public createMessage(): any {
    const message: any = {};
    if (this.authenticationService.hasToken()) {
      message.metadata = {
        token: this.authenticationService.getToken(),
      };
    }
    return message;
  }

  public sendMessage(channel: string, message: any): Promise<any> {
    return this.fayeClient.publish(channel, message);
  }

  public registerMessageHandler(handler: (channel: string, message: any) => void): void {
    this.messageHandlers.push(handler);
  }

  public removeMessageHandler(handler: (channel: string, message: any) => void): void {
    const index: number = this.messageHandlers.indexOf(handler);
    if (index >= 0) {
      this.messageHandlers.slice(index, 1);
    }
  }
}
