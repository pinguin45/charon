import {EventAggregator} from 'aurelia-event-aggregator';
import {bindable, inject} from 'aurelia-framework';
import {IMessageBusService, IWidget} from '../../contracts';
import environment from '../../environment';

@inject(EventAggregator, 'MessageBusService')
export class DynamicUiWrapper {

  private messageBusService: IMessageBusService;
  private eventAggregator: EventAggregator;
  @bindable()
  private currentWidget: IWidget;
  private dynamicUi: any;

  constructor(eventAggregator: EventAggregator, messageBusService: IMessageBusService) {
    this.eventAggregator = eventAggregator;
    this.messageBusService = messageBusService;

    eventAggregator.subscribe('render-dynamic-ui', (message: any) => {
      console.log(JSON.stringify(message));
      this.currentWidget = message;
    });
  }

  public proceed(): void {
    const tokenData: any = this.dynamicUi.getTokenData();
    this.messageBusService.sendProceed(this.currentWidget.taskEntityId, tokenData);
  }
}
