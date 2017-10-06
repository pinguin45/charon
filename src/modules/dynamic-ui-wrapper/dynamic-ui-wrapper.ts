import {bindable, inject} from 'aurelia-framework';
import {IDynamicUiService, IWidget} from '../../contracts';
import environment from '../../environment';

@inject('DynamicUiService')
export class DynamicUiWrapper {

  private dynamicUiService: IDynamicUiService;
  @bindable()
  private _currentWidget: IWidget;
  private declineButtonText: string = 'Abbrechen';
  private confirmButtonText: string = 'Weiter';
  public onButtonClick: (action: string) => void;

  constructor(dynamicUiService: IDynamicUiService) {
    this.dynamicUiService = dynamicUiService;
  }

  public handleButtonClick(action: string): void {
    if (!this._currentWidget) {
      return;
    }
    if (this.onButtonClick) {
      this.onButtonClick(action);
    }
    this.dynamicUiService.sendProceedAction(action, this._currentWidget);
    this._currentWidget = null;
  }

  public set currentWidget(widget: IWidget) {
    this._currentWidget = widget;
    if (this._currentWidget.type === 'confirm') {
      this.handleConfirmLayout(this._currentWidget);
    } else {
      this.confirmButtonText = 'Weiter';
      this.declineButtonText = 'Abbrechen';
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
