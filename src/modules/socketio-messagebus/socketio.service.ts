import {inject} from 'aurelia-framework';
import * as io from 'socket.io-client';
import {IAuthenticationService, ISocketioService} from '../../contracts';
import environment from '../../environment';

@inject('AuthenticationService')
export class SocketioService implements ISocketioService {

    private authenticationService: IAuthenticationService;
    private messageHandlers: Array<(channel: string, message: any) => void> = new Array();
    private socket: any;

    constructor(authenticationService: IAuthenticationService) {
      this.authenticationService = authenticationService;
      this.socket = io(environment.processengine.routes.socketIO);
      this.socket.on('test', (msg: any) => {
        console.log(msg);
        // this.handleIncommingMessage(msg.metadata.channel, msg.data);
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
        };
      }
      return message;
    }

    public sendMessage(channel: string, message: any): Promise<any> {
      return this.socket.emit(channel, message);
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
