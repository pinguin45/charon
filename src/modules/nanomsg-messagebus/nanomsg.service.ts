import {inject} from 'aurelia-framework';
import {IAuthenticationService, INanomsgService} from '../../contracts';
import environment from '../../environment';

@inject('AuthenticationService')
export class NanomsgService implements INanomsgService {

    private authenticationService: IAuthenticationService;
    // public message: string = 'sdhd';
    private sock: any;

    constructor(authenticationService: IAuthenticationService) {
      this.authenticationService = authenticationService;
      this.sock = new nanomsg.Socket(nanomsg.REQ);
      this.sock.connect(environment.processengine.routes.nanomsgBus);
      // this.pub.connect('ws://192.168.161.230:49000');
      // this.start();
    }

    public activate(): any {
      this.sock.on('data', (msg: any) => {
        console.log(msg);
      });
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

    public sendMessage(): void {
      setInterval(() => {
       this.sock.send('Dasiststeintetsts');
      },          environment.processengine.poolingInterval);
    }

}
