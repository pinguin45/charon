import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {IMessageBusService} from '../../contracts';
import environment from '../../environment';

@inject(EventAggregator, 'MessageBusService')
export class DynamicUiWrapper {

  private messageBusService: IMessageBusService;
  private eventAggregator: EventAggregator;

  constructor(eventAggregator: EventAggregator, messageBusService: IMessageBusService) {
    this.eventAggregator = eventAggregator;
    this.messageBusService = messageBusService;

    eventAggregator.subscribe('render-dynamic-ui', (message: any) => {
      console.log(message);
    });
  }
}
