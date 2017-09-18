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
        console.log('data: ' + msg.message);
      });
    }

    // public activate(): any {
    //   this.sock.on('data', (msg: any) => {
    //     console.log('data: ' + msg.message);
    //   });
    // }

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
      return this.sock.send(channel, message);
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

    // public sendMessage(): void {
    //   const message: any = {};
    //   message.metadata = {
    //     channel: 'testchannel',
    //   };
    //   message.message = 'Testnachricht';
    //   setInterval( () => {
    //     this.sock.send(message);
    //   }, 1000);
    // }

}
