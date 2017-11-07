import {INodeInstanceEntity} from '@process-engine/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {inject, observable} from 'aurelia-framework';
import {
  AuthenticationStateEvent,
  IPagination,
  IProcessEngineService,
  IProcessEntity,
} from '../../contracts/index';
import environment from '../../environment';

interface IProcessListRouteParameters {
  processDefId?: string;
}

@inject('ProcessEngineService', EventAggregator)
export class ProcessList {

  private processEngineService: IProcessEngineService;
  private eventAggregator: EventAggregator;
  private selectedState: HTMLSelectElement;
  private getProcessesIntervalId: number;
  private getProcesses: () => Promise<IPagination<IProcessEntity>>;
  private subscriptions: Array<Subscription>;
  private processes: IPagination<IProcessEntity>;
  private instances: Array<IProcessEntity>;
  private status: Array<string> = [];

  @observable public currentPage: number = 0;
  public pageSize: number = 10;
  public totalItems: number;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator) {
    this.processEngineService = processEngineService;
    this.eventAggregator = eventAggregator;
  }

  public currentPageChanged(newValue: number, oldValue: number): void {
    if (oldValue !== undefined && oldValue !== null) {
      this.updateProcesses();
    }
  }

  public activate(routeParameters: IProcessListRouteParameters): void {
    if (!routeParameters.processDefId) {
      this.getProcesses = this.getAllProcesses;
    } else {
      this.getProcesses = (): Promise<IPagination<IProcessEntity>> => {
        return this.getProcessesForProcessDef(routeParameters.processDefId);
      };
    }
    this.updateProcesses();

  }

  public async updateProcesses(): Promise<void> {
    this.processes = await this.getProcesses();

    for (const instance of this.allInstances) {
      if (!this.status.includes(instance.status)) {
        this.status.push(instance.status);
      }
    }

    if (!this.instances) {
      this.instances = this.allInstances;
    }
    this.totalItems = this.instances.length;
  }

  public updateList(): void {
    if (this.selectedState.value === 'all') {
      this.instances = this.allInstances;
      return;
    }
    this.instances = this.allInstances.filter((entry: IProcessEntity): boolean => {
      return entry.status === this.selectedState.value;
    });
  }

  public attached(): void {
    this.getProcessesIntervalId = window.setInterval(async() => {
      await this.updateProcesses();
      this.updateList();
    }, environment.processengine.poolingInterval);

    this.subscriptions = [
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGIN, () => {
        this.updateProcesses();
      }),
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGOUT, () => {
        this.updateProcesses();
      }),
    ];
  }

  public detached(): void {
    clearInterval(this.getProcessesIntervalId);
    for (const subscription of this.subscriptions) {
      subscription.dispose();
    }
  }

  public get shownProcesses(): Array<IProcessEntity> {
    return this.instances.slice((this.currentPage - 1) * this.pageSize, this.pageSize * this.currentPage);
  }

  public get allInstances(): Array<IProcessEntity> {
    return this.processes.data;
  }

  public doCancel(instanceId: string): void {
    //
  }

  private async getAllProcesses(): Promise<IPagination<IProcessEntity>> {
    return this.processEngineService.getProcesses();
  }

  private async getProcessesForProcessDef(processDefId: string): Promise<IPagination<IProcessEntity>> {
    return this.processEngineService.getProcessesByProcessDefId(processDefId);
  }
}
