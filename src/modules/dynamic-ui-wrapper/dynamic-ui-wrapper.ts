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

  constructor(eventAggregator: EventAggregator, messageBusService: IMessageBusService) {
    this.eventAggregator = eventAggregator;
    this.messageBusService = messageBusService;

    eventAggregator.subscribe('render-dynamic-ui', (message: any) => {
      this.currentWidget = message;
    });
  }

  public handleButtonClick(action: string): void {
    if (this.currentWidget) {
      this.messageBusService.sendProceedAction(action, this.currentWidget);
      this.currentWidget = null;
    }
  }
}
