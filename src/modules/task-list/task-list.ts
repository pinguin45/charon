import {
  IConfirmWidgetConfig,
  IConsumerClient,
  IUserTaskConfig,
  UserTaskProceedAction,
  WidgetConfig,
  WidgetType,
} from '@process-engine/consumer_client';
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

@inject(EventAggregator, 'ConsumerClient')
export class TaskList {

  private eventAggregator: EventAggregator;
  private consumerClient: IConsumerClient;

  private subscriptions: Array<Subscription>;
  private userTasks: IPagination<IUserTaskEntity>;
  private getUserTasksIntervalId: number;
  private dynamicUiWrapper: DynamicUiWrapper;
  private getUserTasks: () => Promise<IPagination<IUserTaskEntity>>;

  public currentPage: number = 0;
  public pageSize: number = 10;
  public totalItems: number;

  constructor(eventAggregator: EventAggregator, consumerClient: IConsumerClient) {
    this.eventAggregator = eventAggregator;
    this.consumerClient = consumerClient;
  }

  private async updateUserTasks(): Promise<void> {
    this.userTasks = await this.getUserTasks();

    this.totalItems = this.tasks.length;
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

  public get shownTasks(): Array<IUserTaskEntity> {
    return this.tasks.slice((this.currentPage - 1) * this.pageSize, this.pageSize * this.currentPage);
  }

  public get tasks(): Array<IUserTaskEntity> {
    if (this.userTasks === undefined) {
      return [];
    }
    return this.userTasks.data.filter((entry: IUserTaskEntity): boolean => {
      return entry.state === 'wait';
    });
  }

  private getAllUserTasks(): Promise<IPagination<IUserTaskEntity>> {
    return this.consumerClient.getUserTaskList();
  }

  private getUserTasksForProcessDef(processDefId: string): Promise<IPagination<IUserTaskEntity>> {
    return this.consumerClient.getUserTaskListByProcessDefId(processDefId);
  }

  private getUserTasksForProcess(processId: string): Promise<IPagination<IUserTaskEntity>> {
    return this.consumerClient.getUserTaskListByProcessInstanceId(processId);
  }
}
