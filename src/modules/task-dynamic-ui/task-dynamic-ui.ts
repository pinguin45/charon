import {IUserTaskEntity} from '@process-engine/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthenticationStateEvent, IDynamicUiService, IProcessEngineService, IWidget} from '../../contracts/index';
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
  private _userTask: IUserTaskEntity;

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
  }

  public detached(): void {
    for (const subscription of this.subscriptions) {
      subscription.dispose();
    }
  }

  private finishTask(action: string): void {
    this.router.navigate('task-list');
  }

  private async refreshUserTask(): Promise<void> {
    try {
      this.userTask = await this.processEngineService.getUserTaskById(this.userTaskId);
    } catch (error) {
      console.error('cant refresh user task');
      throw error;
    }
  }

  private set userTask(task: IUserTaskEntity) {
    this._userTask = task;
    this.dynamicUiWrapper.currentWidget = this.dynamicUiService.mapUserTask(this._userTask);
  }

  @computedFrom('_userTask')
  private get userTask(): IUserTaskEntity {
    return this._userTask;
  }
}
