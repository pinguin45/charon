import {IUserTaskConfig} from '@process-engine/consumer_client';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthenticationStateEvent, IDynamicUiService, IProcessEngineService} from '../../contracts/index';
import {DynamicUiWrapper} from '../dynamic-ui-wrapper/dynamic-ui-wrapper';

@inject('ProcessEngineService', EventAggregator, 'DynamicUiService', Router)
export class TaskDynamicUi {

  private processEngineService: IProcessEngineService;
  private eventAggregator: EventAggregator;
  private dynamicUiService: IDynamicUiService;
  private router: Router;

  private subscriptions: Array<Subscription>;
  private userTaskId: string;
  private dynamicUiWrapper: DynamicUiWrapper;
  private _userTask: IUserTaskConfig;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator, dynamicUiService: IDynamicUiService, router: Router) {
    this.processEngineService = processEngineService;
    this.eventAggregator = eventAggregator;
    this.dynamicUiService = dynamicUiService;
    this.router = router;
  }

  private activate(routeParameters: {userTaskId: string}): void {
    this.userTaskId = routeParameters.userTaskId;
    this.refreshUserTask();
  }

  public attached(): void {
    this.subscriptions = [
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGIN, () => {
        this.refreshUserTask();
      }),
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGOUT, () => {
        this.refreshUserTask();
      }),
    ];
    this.dynamicUiWrapper.onButtonClick = (action: string): void => {
      this.finishTask(action);
    };
    this.trySettingWidget();
  }

  public detached(): void {
    for (const subscription of this.subscriptions) {
      subscription.dispose();
    }
  }

  private finishTask(action: string): void {
    this.router.navigate('task');
  }

  private async refreshUserTask(): Promise<void> {
    try {
      this.userTask = await this.dynamicUiService.getUserTaskConfig(this.userTaskId);
    } catch (error) {
      console.error('cant refresh user task', error);
      throw error;
    }
  }

  private async trySettingWidget(): Promise<void> {
    if (!this.dynamicUiWrapper) {
      return;
    }
    if (!this._userTask) {
      return;
    }
    this.dynamicUiWrapper.currentConfig = this._userTask;
  }

  private set userTask(task: IUserTaskConfig) {
    this._userTask = task;
    this.trySettingWidget();
  }

  @computedFrom('_userTask')
  private get userTask(): IUserTaskConfig {
    return this._userTask;
  }
}
