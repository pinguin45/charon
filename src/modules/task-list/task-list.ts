import {IUserTaskEntity} from '@process-engine/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {bindable, computedFrom, inject} from 'aurelia-framework';
import {AuthenticationStateEvent, IDynamicUiService, IPagination, IProcessEngineService} from '../../contracts/index';
import environment from '../../environment';
import {DynamicUiWrapper} from '../dynamic-ui-wrapper/dynamic-ui-wrapper';

interface ITaskListRouteParameters {
  page?: number;
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
  private offset: number;

  private route: string = 'task';

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator, dynamicUiService: IDynamicUiService) {
    this.processEngineService = processEngineService;
    this.eventAggregator = eventAggregator;
    this.dynamicUiService = dynamicUiService;
  }

  private async updateUserTasks(): Promise<void> {
    this.userTasks = await this.getUserTasks();
  }

  public activate(routeParameters: ITaskListRouteParameters): void {
    const page: number = routeParameters.page || 1;
    this.offset = (page - 1) * environment.processlist.pageLimit;

    if (routeParameters.processDefId) {
      this.route = `processdef/${routeParameters.processDefId}/task`;
      this.getUserTasks = (): Promise<IPagination<IUserTaskEntity>> => {
        return this.getUserTasksForProcessDef(routeParameters.processDefId, this.offset);
      };
    } else if (routeParameters.processId) {
      this.route = `process/${routeParameters.processDefId}/task`;
      this.getUserTasks = (): Promise<IPagination<IUserTaskEntity>> => {
        return this.getUserTasksForProcess(routeParameters.processId, this.offset);
      };
    } else {
      this.route = 'task';
      this.getUserTasks = (): Promise<IPagination<IUserTaskEntity>> => {
        return this.getAllUserTasks(this.offset);
      };
    }
    this.updateUserTasks();
  }

  public attached(): void {
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

  private async getAllUserTasks(offset: number): Promise<IPagination<IUserTaskEntity>> {
    return this.processEngineService.getUserTasks(environment.processlist.pageLimit, offset);
  }

  private async getUserTasksForProcessDef(processDefId: string, offset: number): Promise<IPagination<IUserTaskEntity>> {
    return this.processEngineService.getUserTasksByProcessDefId(processDefId, environment.processlist.pageLimit, offset);
  }

  private async getUserTasksForProcess(processId: string, offset: number): Promise<IPagination<IUserTaskEntity>> {
    return this.processEngineService.getUserTasksByProcessId(processId, environment.processlist.pageLimit, offset);
  }

  public get limit(): number {
    if (this.userTasks === undefined) {
      return 0;
    }
    return this.userTasks.limit;
  }

  public get maxPages(): number {
    if (this.userTasks === undefined) {
      return 0;
    }
    return Math.ceil(this.userTasks.count / this.userTasks.limit);
  }

  public get currentPage(): number {
    if (this.userTasks === undefined) {
      return 0;
    }
    return this.offset / this.userTasks.limit + 1;
  }

}
