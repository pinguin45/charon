import {INodeInstanceEntity} from '@process-engine/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {
  AuthenticationStateEvent,
  IMessage,
  IMessageBusService,
  IPagination,
  IProcessEngineService,
  IProcessEntity,
  MessageAction,
  MessageEventType,
} from '../../contracts/index';
import environment from '../../environment';

interface IProcessListRouteParameters {
  page?: number;
  processDefId?: string;
}

@inject('ProcessEngineService', EventAggregator, 'MessageBusService')
export class ProcessList {

  private processEngineService: IProcessEngineService;
  private messageBusService: IMessageBusService;
  private eventAggregator: EventAggregator;
  private selectedState: HTMLSelectElement;
  private getProcessesIntervalId: number;
  private getProcesses: () => Promise<IPagination<IProcessEntity>>;
  private subscriptions: Array<Subscription>;
  private processes: IPagination<IProcessEntity>;
  private instances: Array<IProcessEntity>;
  private status: Array<string> = [];
  private offset: number;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator, messageBusService: IMessageBusService) {
    this.processEngineService = processEngineService;
    this.messageBusService = messageBusService;
    this.eventAggregator = eventAggregator;
  }

  public activate(routeParameters: IProcessListRouteParameters): void {
    const page: number = routeParameters.page || 1;
    this.offset = (page - 1) * environment.processlist.pageLimit;

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
    // this.updateList();
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

  public get allInstances(): Array<IProcessEntity> {
    return this.processes.data;
  }

  public doCancel(instanceId: string): void {
    const cancelMessage: IMessage = this.messageBusService.createMessage();
    cancelMessage.action = MessageAction.event;
    cancelMessage.context = {
      participantId: instanceId,
    };
    cancelMessage.eventType = MessageEventType.cancel;

    this.messageBusService.sendMessage(`/processengine/node/${this.instances[0].processDef.id}`, cancelMessage);
  }

  private async getAllProcesses(): Promise<IPagination<IProcessEntity>> {
    return this.processEngineService.getProcesses(environment.processlist.pageLimit, this.offset);
  }

  private async getProcessesForProcessDef(processDefId: string): Promise<IPagination<IProcessEntity>> {
    return this.processEngineService.getProcessesByProcessDefId(processDefId);
  }

  public get limit(): number {
    if (this.processes === undefined) {
      return 0;
    }
    return this.processes.limit;
  }

  public get maxPages(): number {
    if (this.processes === undefined) {
      return 0;
    }
    return Math.ceil(this.processes.count / this.processes.limit);
  }

  public get currentPage(): number {
    if (this.processes === undefined) {
      return 0;
    }
    return this.offset / this.processes.limit + 1;
  }
}
