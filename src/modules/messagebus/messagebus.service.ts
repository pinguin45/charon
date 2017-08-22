import {IUserTaskMessageData} from '@process-engine-js/process_engine_contracts';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {
  FormFieldType,
  IDropDownField,
  IDropDownFieldValue,
  IFormField,
  IFormWidget,
  IMessageBusService,
  IUserTaskEntityExtensions,
  IUserTaskFormField,
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

  public sendProceed(taskEntityId: string, messageToken: any): void {
    console.log('proceed: ', taskEntityId, messageToken);
    this.fayeClient.publish(`/processengine/node/${taskEntityId}`, {
      data: {
        action: 'proceed',
        token: messageToken,
      },
    });
  }

  private handleIncommingMessage(channel: string, message: any): void {
    if (message.data && message.data.action === 'userTask') {
      const task: IUserTaskMessageData = message.data.data;

      console.log('incomming task: ', task);
      this.handleUserTask(task);
    }
  }

  private handleUserTask(task: IUserTaskMessageData): void {
    const widgetType: WidgetType = this.getWidetType(task);
    let widget: IWidget;

    if (widgetType === 'form') {
      widget = this.mapFormWidget(task);
    } else if (widgetType !== null) {
      widget = {
        taskEntityId: task.userTaskEntity.id,
        name: task.userTaskEntity.name,
        type: widgetType,
      };
    } else {
      alert(`Unbekannter Widget Typ ${task.uiName}`);
      return;
    }

    this.eventAggregator.publish('render-dynamic-ui', widget);
  }

  private mapFormWidget(task: IUserTaskMessageData): IFormWidget {
    const extensions: IUserTaskEntityExtensions = task.userTaskEntity.nodeDef.extensions;
    const fields: Array<IFormField> = [];

    for (const field of extensions.formFields) {
      const formField: IFormField = this.mapField(field);
      fields.push(formField);
    }

    const formWiget: IFormWidget = {
      taskEntityId: task.userTaskEntity.id,
      name: task.userTaskEntity.name,
      type: 'form',
      fields: fields,
    };

    return formWiget;
  }

  private mapField(field: IUserTaskFormField): IFormField {
    const type: FormFieldType = this.mapFieldType(field.type);
    if (type === null) {
      return null;
    }

    const formField: any = {
      id: field.id,
      label: field.label,
      defaultValue: field.defaultValue || '',
      value: field.defaultValue || '',
      type: type,
    };

    if (formField.type === 'dropdown') {
      const values: Array<IDropDownFieldValue> = [];
      for (const value of field.formValues) {
        values.push(value);
      }
      (formField as IDropDownField).values = values;
    } else if (formField.type === 'checkbox') {
      formField.value = formField.value === 'true';
      formField.defaultValue = formField.defaultValue === 'true';
    }
    return formField;
  }

  private mapFieldType(type: string): FormFieldType {
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
    return task.uiName ? task.uiName.toLowerCase() as WidgetType : null;
  }
}
