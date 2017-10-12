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

@inject('ProcessEngineService', EventAggregator, 'MessageBusService')
export class Processinstances {

  private processEngineService: IProcessEngineService;
  private messageBusService: IMessageBusService;
  private eventAggregator: EventAggregator;

  private instances: Array<IProcessEntity>;
  private getProcessesIntervalId: number;
  private subscriptions: Array<Subscription>;
  private status: Array<string> = [];
  private selectedState: HTMLSelectElement;
  private allInstances: Array<IProcessEntity>;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator, messageBusService: IMessageBusService) {
    this.processEngineService = processEngineService;
    this.messageBusService = messageBusService;
    this.eventAggregator = eventAggregator;
  }

  public async getInstancesFromService(): Promise<void> {
    this.allInstances = await this.processEngineService.getInstances();

    for (const instance of this.allInstances) {
      if (!this.status.includes(instance.status)) {
        this.status.push(instance.status);
      }
    }

    if (!this.instances) {
      this.instances = this.allInstances;
    }
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
    this.getInstancesFromService();
    this.getProcessesIntervalId = window.setInterval(async() => {
      await this.getInstancesFromService();
      this.updateList();
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
    this.getInstancesFromService();
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

}
