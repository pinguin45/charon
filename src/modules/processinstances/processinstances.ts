import {INodeInstanceEntity} from '@process-engine-js/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {
  AuthenticationStateEvent,
  IMessage,
  IMessageBusService,
  IPagination,
  IProcessEngineService,
  MessageAction,
  MessageEventType,
} from '../../contracts/index';
import environment from '../../environment';

@inject('ProcessEngineService', EventAggregator, 'MessageBusService')
export class Processinstances {

  private processEngineService: IProcessEngineService;
  private messageBusService: IMessageBusService;
  private eventAggregator: EventAggregator;

  private offset: number;
  private processId: string;
  private instances: IPagination<INodeInstanceEntity>;
  private getProcessesIntervalId: number;
  private subscriptions: Array<Subscription>;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator, messageBusService: IMessageBusService) {
    this.processEngineService = processEngineService;
    this.messageBusService = messageBusService;
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
    }, environment.processengine.poolingInterval);

    this.subscriptions = [
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGIN, this.refreshProcesslist.bind(this)),
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGOUT, this.refreshProcesslist.bind(this)),
    ];
  }

  public detached(): void {
    clearInterval(this.getProcessesIntervalId);
    for (const subscription of this.subscriptions) {
      subscription.dispose();
    }
  }

  private refreshProcesslist(): void {
    this.getInstancesfromService(this.offset);
  }

  public doCancel(instanceId: string): void {
    const msg: IMessage = this.messageBusService.createMessage();
    msg.action = MessageAction.event;
    msg.context = {
      participantId: instanceId,
    };
    msg.eventType = MessageEventType.cancel;

    this.messageBusService.sendMessage(`/processengine/node/${this.instances[0].processDef.id}`, msg);
  }

}
