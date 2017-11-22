import {ConsumerClient, IPagination, IProcessDefEntity, IUserTaskConfig} from '@process-engine/consumer_client';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {inject, observable} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthenticationStateEvent} from '../../contracts/index';
import environment from '../../environment';

@inject(EventAggregator, 'ConsumerClient', Router)
export class ProcessDefList {
  private consumerClient: ConsumerClient;
  private eventAggregator: EventAggregator;
  private router: Router;

  private offset: number;
  private _processes: IPagination<IProcessDefEntity>;
  private getProcessesIntervalId: number;
  private subscriptions: Array<Subscription>;

  @observable public currentPage: number = 1;
  public pageSize: number = 10;
  public totalItems: number;

  constructor(eventAggregator: EventAggregator, consumerClient: ConsumerClient, router: Router) {
    this.eventAggregator = eventAggregator;
    this.consumerClient = consumerClient;
    this.router = router;

    this.refreshProcesslist();
  }

  public currentPageChanged(newValue: number, oldValue: number): void {
    if (oldValue !== undefined && oldValue !== null) {
      this.refreshProcesslist();
    }
  }

  public async getProcessesFromService(): Promise<void> {
    const processCount: IPagination<IProcessDefEntity> = await this.consumerClient.getProcessDefList(0, 0);
    this.totalItems = processCount.count;
    this._processes = await this.consumerClient.getProcessDefList(this.pageSize, this.pageSize * (this.currentPage - 1));
  }

  public attached(): void {
    this.getProcessesIntervalId = window.setInterval(() => {
      this.getProcessesFromService();
      // tslint:disable-next-line
    }, environment.processengine.poolingInterval);

    this.subscriptions = [
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGIN, () => {
        this.refreshProcesslist();
      }),
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGOUT, () => {
        this.refreshProcesslist();
      }),
    ];
  }

  public detached(): void {
    clearInterval(this.getProcessesIntervalId);
    for (const subscription of this.subscriptions) {
      subscription.dispose();
    }
  }

  private refreshProcesslist(): void {
    this.getProcessesFromService();
  }

  public get processes(): Array<IProcessDefEntity> {
    if (this._processes === undefined) {
      return [];
    }
    return this._processes.data;
  }

  public async createProcess(): Promise<void> {
    const processInstanceId: string = await this.consumerClient.startProcessByKey('CreateProcessDef');

    const renderUserTaskCallback: any = (userTaskConfig: IUserTaskConfig): void => {
      if (userTaskConfig.userTaskEntity.process.id === processInstanceId) {
        this.router.navigate(`/task/${userTaskConfig.id}/dynamic-ui`);
        this.consumerClient.off('renderUserTask', renderUserTaskCallback);
      }
    };

    this.consumerClient.on('renderUserTask', renderUserTaskCallback);
  }

}
