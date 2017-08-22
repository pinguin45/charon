import {EventAggregator} from 'aurelia-event-aggregator';
import {bindable, inject} from 'aurelia-framework';
import {IMessageBusService, IWidget} from '../../contracts';
import environment from '../../environment';

@inject(EventAggregator, 'MessageBusService')
export class DynamicUiWrapper {

  private messageBusService: IMessageBusService;
  private eventAggregator: EventAggregator;
  @bindable()
  private _currentWidget: IWidget;

  constructor(eventAggregator: EventAggregator, messageBusService: IMessageBusService) {
    this.eventAggregator = eventAggregator;
    this.messageBusService = messageBusService;

    eventAggregator.subscribe('render-dynamic-ui', (message: any) => {
      this._currentWidget = message;
    });
  }

  public handleButtonClick(action: string): void {
    if (this._currentWidget) {
      this.messageBusService.sendProceedAction(action, this._currentWidget);
      this._currentWidget = null;
    }
  }

  public get currentWidget(): IWidget {
    return this._currentWidget;
  }
}
