import {ConsumerClient, IUserTaskConfig, UserTaskProceedAction} from '@process-engine/consumer_client';
import {IUserTaskEntity, IUserTaskMessageData} from '@process-engine/process_engine_contracts';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {IDynamicUiService} from '../../contracts';
import environment from '../../environment';

@inject(EventAggregator, 'ConsumerClient')
export class DynamicUiService implements IDynamicUiService {

  private consumerClient: ConsumerClient;
  private eventAggregator: EventAggregator;

  constructor(eventAggregator: EventAggregator, consumerClient: ConsumerClient) {
    this.consumerClient = consumerClient;
    this.eventAggregator = eventAggregator;
    this.messageBusService.registerMessageHandler((channel: string, message: any): void => {
      this.handleIncommingMessage(channel, message);
    });
  }

  public sendProceedAction(action: UserTaskProceedAction, userTaskConfig: IUserTaskConfig): void {
    this.consumerClient.proceedUserTask(userTaskConfig, action);
  }

  public getUserTaskConfig(userTaskId: string): Promise<IUserTaskConfig> {
    return this.consumerClient.getUserTaskConfig(userTaskId);
  }

  private async handleIncommingMessage(channel: string, message: any): Promise<void> {
    if (!message.data || message.data.action !== 'userTask') {
      if (message.data.action === 'endEvent') {
        this.eventAggregator.publish('closed-process', message);
      }
      return;
    }

    const task: IUserTaskMessageData = message.data.data;
    const config: IUserTaskConfig = await this.consumerClient.getUserTaskConfig(task.userTaskEntity.id);

    if (config !== null) {
      this.eventAggregator.publish('render-dynamic-ui', config);
    }
  }
}
