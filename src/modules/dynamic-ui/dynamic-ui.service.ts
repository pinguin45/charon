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
    this.consumerClient.on('renderUserTask', (userTaskConfig: IUserTaskConfig) => {
      this.eventAggregator.publish('render-dynamic-ui', userTaskConfig);
    });
    this.consumerClient.on('endEvent', (message: any) => {
      this.eventAggregator.publish('closed-process', message);
    });
  }

  public sendProceedAction(action: UserTaskProceedAction, userTaskConfig: IUserTaskConfig): void {
    this.consumerClient.proceedUserTask(userTaskConfig, action);
  }

  public getUserTaskConfig(userTaskId: string): Promise<IUserTaskConfig> {
    return this.consumerClient.getUserTaskConfig(userTaskId);
  }
}
