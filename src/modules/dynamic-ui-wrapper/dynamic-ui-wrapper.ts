import {inject} from 'aurelia-framework';
import {IMessageBusService} from '../../contracts';
import environment from '../../environment';

@inject('MessageBusService')
export class DynamicUi {

  // private messageBusService: IMessageBusService;

  constructor(messageBusService: IMessageBusService) {
   // this.messageBusService = messageBusService;
    //console.log(this.messageBusService);
  }

}
