import {ConsumerClient, IPagination} from '@process-engine/consumer_client';
import {IProcessDefEntity} from '@process-engine/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {AuthenticationStateEvent} from '../../contracts/index';
import environment from '../../environment';

@inject(EventAggregator, 'ConsumerClient')
export class ProcessDefList {

  private eventAggregator: EventAggregator;
  private consumerClient: ConsumerClient;

  private offset: number;
  private _processes: IPagination<IProcessDefEntity>;
  private getProcessesIntervalId: number;
  private createProcess: string = environment.createProcess;
  private subscriptions: Array<Subscription>;

  public currentPage: number = 0;
  public pageSize: number = 10;
  public totalItems: number;

  constructor(eventAggregator: EventAggregator, consumerClient: ConsumerClient) {
    this.eventAggregator = eventAggregator;
    this.consumerClient = consumerClient;
  }

  public async getProcessesFromService(): Promise<void> {
    this._processes = await this.consumerClient.getProcessDefList();
    this.totalItems = this._processes.count;
  }

  public activate(routeParameters: {page: number}): void {
    this.getProcessesFromService();
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

  public get shownProcessDefs(): Array<IProcessDefEntity> {
    return this.processes.slice((this.currentPage - 1) * this.pageSize, this.pageSize * this.currentPage);
  }

  public get limit(): number {
    if (this._processes === undefined) {
      return 0;
    }
    return this._processes.limit;
  }

  public get processes(): Array<IProcessDefEntity> {
    if (this._processes === undefined) {
      return [];
    }
    return this._processes.data;
  }
}
