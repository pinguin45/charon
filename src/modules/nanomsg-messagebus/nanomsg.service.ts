import {inject} from 'aurelia-framework';
import {IAuthenticationService, INanomsgService} from '../../contracts';
import environment from '../../environment';

@inject('AuthenticationService')
export class NanomsgService implements INanomsgService {

    private authenticationService: IAuthenticationService;
    private messageHandlers: Array<(channel: string, message: any) => void> = new Array();
    private sock: any;

    constructor(authenticationService: IAuthenticationService) {
      this.authenticationService = authenticationService;
      this.sock = new nanomsg.Socket(nanomsg.PAIR);
      this.sock.connect(environment.processengine.routes.nanomsgBus);
      this.sock.on('data', (msg: any) => {
        msg = JSON.parse(msg);
        this.handleIncommingMessage(msg.metadata.channel, msg.data);
        // console.log(JSON.stringify(msg));
      });
    }

    private handleIncommingMessage(channel: string, message: any): void {
      for (const handler of this.messageHandlers) {
        handler(channel, message);
      }
    }

    public createMessage(channel: string): any {
      const message: any = {};
      if (this.authenticationService.hasToken()) {
        message.metadata = {
          token: this.authenticationService.getToken(),
          channel: channel,
        };
      }else {
        message.metadata = {
          channel: channel,
        };
      }
      return message;
    }

    public sendMessage(message: any): Promise<any> {
      return this.sock.send(JSON.stringify(message));
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
