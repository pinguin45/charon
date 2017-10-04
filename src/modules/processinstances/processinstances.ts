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
  private processId: string;
  private instances: IPagination<INodeInstanceEntity>;
  private getProcessesIntervalId: number;
  private subscriptions: Array<Subscription>;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator) {
    this.processEngineService = processEngineService;
    this.eventAggregator = eventAggregator;
  }

  public getInstancesfromService(offset: number): void {
    this.processEngineService.getInstances(this.processId)
      .then((result: any) => {
        if (result < 1) {
          this.instances = null;
        } else {
          this.instances = result;
        }
      });
  }

  public activate(routeParameters: {processId: string}): void {
    this.processId = routeParameters.processId;
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

}
