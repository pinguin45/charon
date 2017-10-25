import {ConsumerClient, IPagination} from '@process-engine/consumer_client';
import {IProcessDefEntity} from '@process-engine/process_engine_contracts';
import {IUserTaskEntity} from '@process-engine/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
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

  constructor(eventAggregator: EventAggregator, consumerClient: ConsumerClient, router: Router) {
    this.eventAggregator = eventAggregator;
    this.consumerClient = consumerClient;
    this.router = router;

    this.consumerClient.once('renderUserTask', (userTaskConfig: IUserTaskEntity) => {
      this.router.navigate(`/task/${userTaskConfig.id}/dynamic-ui`);
    });
  }

  public async getProcessesFromService(offset: number): Promise<void> {
    this._processes = await this.consumerClient.getProcessDefList(environment.processlist.pageLimit, offset);
  }

  public activate(routeParameters: {page: number}): void {
    const page: number = routeParameters.page || 1;
    this.offset = (page - 1) * environment.processlist.pageLimit;
    this.getProcessesFromService(this.offset);
  }

  public attached(): void {
    this.getProcessesIntervalId = window.setInterval(() => {
      this.getProcessesFromService(this.offset);
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
    this.getProcessesFromService(this.offset);
  }

  public get limit(): number {
    if (this._processes === undefined) {
      return 0;
    }
    return this._processes.limit;
  }

  public get maxPages(): number {
    if (this._processes === undefined) {
      return 0;
    }
    return Math.ceil(this._processes.count / this._processes.limit);
  }

  public get currentPage(): number {
    if (this._processes === undefined) {
      return 0;
    }
    return this.offset / this._processes.limit + 1;
  }

  public get processes(): Array<IProcessDefEntity> {
    if (this._processes === undefined) {
      return [];
    }
    return this._processes.data;
  }

  public createProcess(): void {
    this.consumerClient.startProcessByKey('CreateProcessDef');
  }

}
