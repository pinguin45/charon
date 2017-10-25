import {
  IConfirmWidgetConfig,
  IUserTaskConfig,
  UserTaskProceedAction,
  WidgetConfig,
  WidgetType,
} from '@process-engine/consumer_client';
import {bindable, inject} from 'aurelia-framework';
import {IDynamicUiService} from '../../contracts';
import environment from '../../environment';

@inject('DynamicUiService')
export class DynamicUiWrapper {

  private dynamicUiService: IDynamicUiService;
  @bindable()
  private _currentConfig: IUserTaskConfig;
  private declineButtonText: string = 'Abbrechen';
  private confirmButtonText: string = 'Weiter';
  public onButtonClick: (action: string) => void;

  constructor(dynamicUiService: IDynamicUiService) {
    this.dynamicUiService = dynamicUiService;
  }

  public handleButtonClick(action: string): void {
    if (!this._currentConfig) {
      return;
    }
    if (this.onButtonClick) {
      this.onButtonClick(action);
    }
    this.dynamicUiService.sendProceedAction(action, this._currentConfig);
    this._currentConfig = null;
  }

  public set currentConfig(userTaskConfig: IUserTaskConfig) {
    this._currentConfig = userTaskConfig;
    if (this._currentConfig.widgetType === WidgetType.confirm) {
      this.handleConfirmLayout();
    } else {
      this.confirmButtonText = 'Weiter';
      this.declineButtonText = 'Abbrechen';
    }
  }

  public get currentConfig(): IUserTaskConfig {
    return this._currentConfig;
  }

  public handleConfirmLayout(): void {
    const confirmWidget: IConfirmWidgetConfig = this.currentConfig.widgetConfig as IConfirmWidgetConfig;
    this.confirmButtonText = null;
    this.declineButtonText = null;
    for (const action of confirmWidget.actions) {
      if (action.action === UserTaskProceedAction.cancel) {
        this.declineButtonText = action.label;
      } else if (action.action === UserTaskProceedAction.proceed) {
        this.confirmButtonText = action.label;
      }
    }
  }
}
