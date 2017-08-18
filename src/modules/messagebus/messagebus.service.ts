import {IUserTaskMessageData} from '@process-engine-js/process_engine_contracts';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {
  FormFieldType,
  IFormField,
  IFormWidget,
  IMessageBusService,
  IUserTaskEntityExtensions,
  IWidget,
  WidgetType,
} from '../../contracts';
import environment from '../../environment';

@inject(EventAggregator)
export class MessageBusService implements IMessageBusService {

  private eventAggregator: EventAggregator;
  private fayeClient: any;

  constructor(eventAggregator: EventAggregator) {
    this.eventAggregator = eventAggregator;
    this.fayeClient = new (<any> window).Faye.Client(environment.processengine.routes.messageBus);
    this.fayeClient.subscribe('/**').withChannel((channel: string, message: any) => {
      this.handleIncommingMessage(channel, message);
    });
  }

  private handleIncommingMessage(channel: string, message: any): void {
    if (message.data && message.data.action === 'userTask') {
      const task: IUserTaskMessageData = message.data.data;
      const widgetType: WidgetType = this.getWidetType(task);

      if (widgetType === 'form') {
        const extensions: IUserTaskEntityExtensions = task.userTaskEntity.nodeDef.extensions;
        const fields: Array<IFormField> = [];

        for (const field of extensions.formFields) {
          fields.push({
            id: field.id,
            label: field.label,
            type: this.mapTypeToFormType(field.type),
            defaultValue: '',
          });
        }

        const formWiget: IFormWidget = {
          uiName: task.uiName,
          type: widgetType,
          fields: fields,
        };

        this.eventAggregator.publish('render-dynamic-ui', formWiget);
      } else {
        const widget: IWidget = {
          uiName: task.uiName,
          type: widgetType,
        };
        this.eventAggregator.publish('render-dynamic-ui', widget);
      }
    }
  }

  private mapTypeToFormType(type: string): FormFieldType {
    if (type === 'string' || type === 'long' || type === 'date') {
      return 'textbox';
    } else if (type === 'boolean') {
      return 'checkbox';
    } else if (type === 'enum') {
      return 'dropdown';
    } else {
      return null;
    }
  }

  private getWidetType(task: IUserTaskMessageData): WidgetType {
    return task.uiName.toLowerCase() as WidgetType;
  }
}
