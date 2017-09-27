import {INodeInstanceEntity} from '@process-engine-js/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {AuthenticationStateEvent, IPagination, IProcessEngineService} from '../../contracts/index';
import environment from '../../environment';

@inject('ProcessEngineService', EventAggregator)
export class Processinstances {

  private processEngineService: IProcessEngineService;
  private eventAggregator: EventAggregator;

  private offset: number;
  private _instances: IPagination<INodeInstanceEntity>;
  private getProcessesIntervalId: number;
  private subscriptions: Array<Subscription>;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator) {
    this.processEngineService = processEngineService;
    this.eventAggregator = eventAggregator;
  }

  public getInstancesfromService(offset: number): void {
    this.processEngineService.getInstances('6b11329d-870f-4996-b5eb-015897234605')
      .then((result: any) => {
        this._instances = result;
      });
  }

  public activate(routeParameters: {page: number}): void {
    const page: number = routeParameters.page || 1;
    this.offset = (page - 1) * environment.processlist.pageLimit;
    this.getInstancesfromService(this.offset);
  }

  public attached(): void {
    this.getInstancesfromService(this.offset);
    this.getProcessesIntervalId = window.setInterval(() => {
      this.getInstancesfromService(this.offset);
      // tslint:disable-next-line
    }, environment.processengine.poolingInterval);

    this.subscriptions = [
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGIN, this.refreshProcesslist.bind(this)),
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGOUT, this.refreshProcesslist.bind(this)),
    ];
  }

  public detached(): void {
    clearInterval(this.getProcessesIntervalId);
    this.subscriptions.forEach((x: Subscription) => x.dispose);
  }

  private refreshProcesslist(): void {
    this.getInstancesfromService(this.offset);
  }

  public get limit(): number {
    if (this._instances === undefined) {
      return 0;
    }
    return this._instances.limit;
  }

  public get maxPages(): number {
    if (this._instances === undefined) {
      return 0;
    }
    return Math.ceil(this._instances.count / this._instances.limit);
  }

  public get currentPage(): number {
    if (this._instances === undefined) {
      return 0;
    }
    return this.offset / this._instances.limit + 1;
  }

  public get instances(): Array<INodeInstanceEntity> {
    if (this._instances === undefined) {
      return [];
    }
    console.log(this._instances);
    // console.log(this._instances.data);
    return this._instances.data;
  }
}
