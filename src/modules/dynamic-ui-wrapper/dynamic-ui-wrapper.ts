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
  private declineButtonText: string = 'Abbrechen';
  private confirmButtonText: string = 'Weiter';

  constructor(eventAggregator: EventAggregator, dynamicUiService: IDynamicUiService) {
    this.eventAggregator = eventAggregator;
    this.dynamicUiService = dynamicUiService;

    eventAggregator.subscribe('render-dynamic-ui', (message: any) => {
      this._currentWidget = message;
      if (this._currentWidget.type === 'confirm') {
        this.handleConfirmLayout(this._currentWidget);
      } else {
        this.confirmButtonText = 'Weiter';
        this.declineButtonText = 'Abbrechen';
      }
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

  public handleConfirmLayout(currentWidget: any): void {
    this.confirmButtonText = null;
    this.declineButtonText = null;
    for (const layout of currentWidget.layout) {
      if (layout.key === 'decline') {
        this.declineButtonText = layout.label;
      } else if (layout.key === 'confirm') {
        this.confirmButtonText = layout.label;
      }
    }
  }
}
