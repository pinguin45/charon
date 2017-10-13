import {IUserTaskEntity} from '@process-engine/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {bindable, computedFrom, inject} from 'aurelia-framework';
import {AuthenticationStateEvent, IDynamicUiService, IPagination, IProcessEngineService} from '../../contracts/index';
import environment from '../../environment';
import {DynamicUiWrapper} from '../dynamic-ui-wrapper/dynamic-ui-wrapper';

interface ITaskListRouteParameters {
  processDefId?: string;
  processId?: string;
}

@inject('ProcessEngineService', EventAggregator, 'DynamicUiService')
export class TaskList {

  private processEngineService: IProcessEngineService;
  private eventAggregator: EventAggregator;
  private dynamicUiService: IDynamicUiService;

  private subscriptions: Array<Subscription>;
  private userTasks: IPagination<IUserTaskEntity>;
  private getUserTasksIntervalId: number;
  private dynamicUiWrapper: DynamicUiWrapper;
  private getUserTasks: () => Promise<IPagination<IUserTaskEntity>>;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator, dynamicUiService: IDynamicUiService) {
    this.processEngineService = processEngineService;
    this.eventAggregator = eventAggregator;
    this.dynamicUiService = dynamicUiService;
  }

  private async updateUserTasks(): Promise<void> {
    this.userTasks = await this.getUserTasks();
  }

  public activate(routeParameters: ITaskListRouteParameters): void {
    if (routeParameters.processDefId) {
      this.getUserTasks = (): Promise<IPagination<IUserTaskEntity>> => {
        return this.getUserTasksForProcessDef(routeParameters.processDefId);
      };
    } else if (routeParameters.processId) {
      this.getUserTasks = (): Promise<IPagination<IUserTaskEntity>> => {
        return this.getUserTasksForProcess(routeParameters.processId);
      };
    } else {
      this.getUserTasks = this.getAllUserTasks;
    }
  }

  public attached(): void {
    this.updateUserTasks();
    this.getUserTasksIntervalId = window.setInterval(() => {
      this.updateUserTasks();
    }, environment.processengine.poolingInterval);

    this.subscriptions = [
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGIN, () => {
        this.updateUserTasks();
      }),
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGOUT, () => {
        this.updateUserTasks();
      }),
    ];
  }

  public detached(): void {
    clearInterval(this.getUserTasksIntervalId);
    for (const subscription of this.subscriptions) {
      subscription.dispose();
    }
  }

  public get tasks(): Array<IUserTaskEntity> {
    if (this.userTasks === undefined) {
      return [];
    }
    return this.userTasks.data.filter((entry: IUserTaskEntity): boolean => {
      return entry.state === 'wait';
    });
  }

  private async getAllUserTasks(): Promise<IPagination<IUserTaskEntity>> {
    return this.processEngineService.getUserTasks(100, 0);
  }

  private async getUserTasksForProcessDef(processDefId: string): Promise<IPagination<IUserTaskEntity>> {
    return this.processEngineService.getUserTasksByProcessDefId(processDefId);
  }

  private async getUserTasksForProcess(processId: string): Promise<IPagination<IUserTaskEntity>> {
    return this.processEngineService.getUserTasksByProcessId(processId);
  }
}
