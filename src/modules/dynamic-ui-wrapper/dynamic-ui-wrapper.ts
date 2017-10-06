import {bindable, inject} from 'aurelia-framework';
import {IDynamicUiService, IWidget} from '../../contracts';
import environment from '../../environment';

@inject('DynamicUiService')
export class DynamicUiWrapper {

  private dynamicUiService: IDynamicUiService;
  @bindable()
  private _currentWidget: IWidget;
  public onButtonClick: (action: string) => void;

  constructor(dynamicUiService: IDynamicUiService) {
    this.dynamicUiService = dynamicUiService;
  }

  public handleButtonClick(action: string): void {
    if (this._currentWidget) {
      if (this.onButtonClick) {
        this.onButtonClick(action);
      }
      this.dynamicUiService.sendProceedAction(action, this._currentWidget);
      this._currentWidget = null;
    }
  }

  public set currentWidget(widget: IWidget) {
    this._currentWidget = widget;
  }

  public get currentWidget(): IWidget {
    return this._currentWidget;
  }
}
