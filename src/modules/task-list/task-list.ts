import {IUserTaskEntity} from '@process-engine-js/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {bindable, computedFrom, inject} from 'aurelia-framework';
import {AuthenticationStateEvent, IDynamicUiService, IPagination, IProcessEngineService} from '../../contracts/index';
import environment from '../../environment';
import {DynamicUiWrapper} from '../dynamic-ui-wrapper/dynamic-ui-wrapper';

@inject('ProcessEngineService', EventAggregator, 'DynamicUiService')
export class TaskList {

  private processEngineService: IProcessEngineService;
  private eventAggregator: EventAggregator;
  private dynamicUiService: IDynamicUiService;

  private subscriptions: Array<Subscription>;
  private userTasks: IPagination<IUserTaskEntity>;
  private getUserTasksIntervalId: number;
  private dynamicUiWrapper: DynamicUiWrapper;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator, dynamicUiService: IDynamicUiService) {
    this.processEngineService = processEngineService;
    this.eventAggregator = eventAggregator;
    this.dynamicUiService = dynamicUiService;
  }

  public getUserTasksFromService(offset: number): void {
    this.processEngineService.getUserTasks(100, offset)
      .then((result: IPagination<IUserTaskEntity>) => {
        this.userTasks = result;
      });
  }

  public attached(): void {
    this.getUserTasksFromService(0);
    this.getUserTasksIntervalId = window.setInterval(() => {
      this.getUserTasksFromService(0);
      // tslint:disable-next-line
    }, environment.processengine.poolingInterval);

    this.subscriptions = [
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGIN, this.refreshUserTaskList.bind(this)),
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGOUT, this.refreshUserTaskList.bind(this)),
    ];
  }

  public detached(): void {
    clearInterval(this.getUserTasksIntervalId);
    this.subscriptions.forEach((subscription: Subscription): void => {
      subscription.dispose();
    });
  }

  private refreshUserTaskList(): void {
    this.getUserTasksFromService(0);
  }

  public get tasks(): Array<IUserTaskEntity> {
    if (this.userTasks === undefined) {
      return [];
    }
    return this.userTasks.data.filter((entry: IUserTaskEntity): boolean => {
      return entry.state === 'wait';
    });
  }
}
