import {ConsumerClient, IPagination} from '@process-engine/consumer_client';
import {IProcessDefEntity} from '@process-engine/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {BindingEngine, inject} from 'aurelia-framework';
import {AuthenticationStateEvent} from '../../contracts/index';
import environment from '../../environment';

@inject(EventAggregator, 'ConsumerClient', BindingEngine)
export class ProcessDefList {

  private eventAggregator: EventAggregator;
  private consumerClient: ConsumerClient;

  private offset: number;
  private _processes: IPagination<IProcessDefEntity>;
  private getProcessesIntervalId: number;
  private createProcess: string = environment.createProcess;
  private subscriptions: Array<Subscription>;
  public currentPage: number = 1;
  public pageSize: number = 10;
  public totalItems: number;

  private bindingEngine: BindingEngine;

  constructor(eventAggregator: EventAggregator, consumerClient: ConsumerClient, bindingEngine: BindingEngine) {
    this.eventAggregator = eventAggregator;
    this.consumerClient = consumerClient;
    this.bindingEngine = bindingEngine;

    this.refreshProcesslist();

    this.bindingEngine.propertyObserver(this, 'currentPage').subscribe((newValue: number, oldValue: number) => {
      this.refreshProcesslist();
    });
  }

  public async getProcessesFromService(): Promise<void> {
    const processCount: IPagination<IProcessDefEntity> = await this.consumerClient.getProcessDefList(0);
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
}
