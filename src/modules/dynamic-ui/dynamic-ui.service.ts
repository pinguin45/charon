import {IUserTaskMessageData} from '@process-engine-js/process_engine_contracts';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {
  FormFieldType,
  IDropDownField,
  IDropDownFieldValue,
  IDynamicUiService,
  IFormField,
  IFormWidget,
  IMessageBusService,
  INanomsgService,
  IUserTaskEntityExtensions,
  IUserTaskFormField,
  IWidget,
  WidgetType,
} from '../../contracts';
import environment from '../../environment';

@inject('MessageBusService', EventAggregator, 'NanomsgService')
export class DynamicUiService implements IDynamicUiService {

  private messageBusService: IMessageBusService;
  private eventAggregator: EventAggregator;
  private nanomessage: INanomsgService;

  constructor(messageBusService: IMessageBusService, eventAggregator: EventAggregator, nanomessage: INanomsgService) {
    this.messageBusService = messageBusService;
    this.eventAggregator = eventAggregator;
    this.nanomessage = nanomessage;
    this.nanomessage.activate();
    // this.nanomessage.sendMessage();
    this.messageBusService.registerMessageHandler(this.handleIncommingMessage.bind(this));
  }

  public sendProceedAction(action: string, widget: IWidget): void {
    const message: any = this.messageBusService.createMessage();
    const messageToken: any = this.getMessageToken(widget);
    message.data = {
      action: 'proceed',
      token: messageToken,
    };
    this.messageBusService.sendMessage(`/processengine/node/${widget.taskEntityId}`, message);
  }

  private getMessageToken(widget: IWidget): any {
    const messageToken: any = {};
    if (widget.type === 'form') {
      for (const field of (widget as IFormWidget).fields) {
        messageToken[field.id] = field.value;
      }
    }
    // TODO: handle other widget types
    return messageToken;
  }

  private handleIncommingMessage(channel: string, message: any): void {
    if (message.data && message.data.action === 'userTask') {
      const task: IUserTaskMessageData = message.data.data;
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
      console.error('Unbekannter Widget Type: ', task);
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
