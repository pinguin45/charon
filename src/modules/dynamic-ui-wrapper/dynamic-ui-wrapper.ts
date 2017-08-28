import {EventAggregator} from 'aurelia-event-aggregator';
import {bindable, inject} from 'aurelia-framework';
import {IDynamicUiService, IWidget} from '../../contracts';
import environment from '../../environment';

@inject(EventAggregator, 'DynamicUiService')
export class DynamicUiWrapper {

  private dynamicUiService: IDynamicUiService;
  private eventAggregator: EventAggregator;
  @bindable()
  private _currentWidget: IWidget;

  constructor(eventAggregator: EventAggregator, dynamicUiService: IDynamicUiService) {
    this.eventAggregator = eventAggregator;
    this.dynamicUiService = dynamicUiService;

    eventAggregator.subscribe('render-dynamic-ui', (message: any) => {
      this._currentWidget = message;
    });
  }

  public handleButtonClick(action: string): void {
    if (this._currentWidget) {
      this.dynamicUiService.sendProceedAction(action, this._currentWidget);
      this._currentWidget = null;
    }
  }

  public get currentWidget(): IWidget {
    return this._currentWidget;
  }
}
