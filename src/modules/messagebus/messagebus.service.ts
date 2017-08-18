import {IMessageBusService} from '../../contracts';

export class MessageBusService implements IMessageBusService {

  private fayeClient: any;

  constructor() {
    console.log('lkoloasdasd');
    this.fayeClient = new (<any> window).Faye.Client('http://localhost:8000/mb');
    // this.fayeClient.publish('/**', )
    this.fayeClient.subscribe('/**').withChannel((channel: string, message: any) => {
      console.log(channel);
      console.log(message);
    });
  }
}
