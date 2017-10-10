import {IUserTaskEntity, IUserTaskMessageData} from '@process-engine-js/process_engine_contracts';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {
  FormFieldType,
  IConfirmWidget,
  IDropDownField,
  IDropDownFieldValue,
  IDynamicUiService,
  IFormField,
  IFormWidget,
  ILayout,
  IMessageBusService,
  IUserTaskEntityExtensions,
  IUserTaskFormField,
  IUserTaskProperty,
  IWidget,
  WidgetType,
} from '../../contracts';
import environment from '../../environment';

@inject('MessageBusService', EventAggregator)
export class DynamicUiService implements IDynamicUiService {

  private messageBusService: IMessageBusService;
  private eventAggregator: EventAggregator;

  constructor(messageBusService: IMessageBusService, eventAggregator: EventAggregator)  {
    this.messageBusService = messageBusService;
    this.eventAggregator = eventAggregator;
    this.messageBusService.registerMessageHandler(this.handleIncommingMessage.bind(this));
  }

  public sendProceedAction(action: string, widget: IWidget): void {
    const message: any = this.messageBusService.createMessage();
    const messageToken: any = this.getMessageToken(widget, action);
    message.data = {
      action: widget.type === 'confirm' ? 'proceed' : action,
      token: messageToken,
    };

    this.messageBusService.sendMessage(`/processengine/node/${widget.taskEntityId}`, message);
  }

  private getMessageToken(widget: IWidget, action: string): any {
    const messageToken: any = {};
    if (widget.type === 'form') {
      for (const field of (widget as IFormWidget).fields) {
        messageToken[field.id] = field.value;
      }
    }

    if (widget.type === 'confirm') {
      if (action === 'abort') {
        messageToken.key = 'decline';
      } else {
        messageToken.key = 'confirm';
      }
    }

    // TODO: handle other widget types
    return messageToken;
  }

  private handleIncommingMessage(channel: string, message: any): void {
    if (!message.data || message.data.action !== 'userTask') {
      return;
    }
    const task: IUserTaskMessageData = message.data.data;
    const widget: IWidget = this.mapUserTask(task.userTaskEntity);

    if (widget !== null) {
      this.eventAggregator.publish('render-dynamic-ui', widget);
    }
  }

  public mapUserTask(task: IUserTaskEntity): IWidget {
    const widgetType: WidgetType = this.getWidetType(task);
    let widget: IWidget = null;

    if (widgetType === 'form') {
      widget = this.mapFormWidget(task);
    } else if (widgetType === 'confirm') {
      widget = this.mapConfirmWidget(task);
    } else if (widgetType !== null) {
      widget = {
        taskEntityId: task.id,
        name: task.name,
        type: widgetType,
      };
    } else {
      throw new Error(`Unknown widget type ${task}`);
    }

    return widget;
  }

  private mapFormWidget(task: IUserTaskEntity): IFormWidget {
    const extensions: IUserTaskEntityExtensions = task.nodeDef.extensions;
    const fields: Array<IFormField> = [];

    for (const field of extensions.formFields) {
      const formField: IFormField = this.mapField(field);
      fields.push(formField);
    }

    const formWiget: IFormWidget = {
      taskEntityId: task.id,
      name: task.name,
      type: 'form',
      fields: fields,
    };

    return formWiget;
  }

  private mapConfirmWidget(task: IUserTaskEntity): IConfirmWidget {
    const extensions: IUserTaskEntityExtensions = task.nodeDef.extensions;
    const uiConfigProperty: IUserTaskProperty = extensions.properties.find((property: IUserTaskProperty): boolean =>  {
      return property.name === 'uiConfig';
    });

    // TODO cleanup
    let value: string = uiConfigProperty.value;
    if (value.startsWith('$')) {
      value = value.substring(1);
    }
    if (value.endsWith(';')) {
      value = value.substring(0, value.length - 1);
    }
    const uiConfig: any = JSON.parse(value);

    const layouts: Array<ILayout> = uiConfig.layout.map((layout: ILayout) => {
      const confirmLayout: ILayout = {
        key: layout.key,
        label: layout.label,
        isCancel: layout.isCancel || null,
      };

      return confirmLayout;
    });

    const confirmWidget: IConfirmWidget = {
      taskEntityId: task.id,
      name: task.name,
      type: 'confirm',
      message: uiConfig.message,
      layout: layouts,
      uiData: task.processToken.data,
    };

    return confirmWidget;
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

  private getWidetType(task: IUserTaskEntity): WidgetType {
    const extensions: IUserTaskEntityExtensions = task.nodeDef.extensions;
    const uiNameProp: IUserTaskProperty = extensions.properties.find((property: IUserTaskProperty) => {
      return property.name === 'uiName';
    });

    let result: WidgetType = null;
    if (uiNameProp.value !== undefined && uiNameProp.value !== null) {
      result = uiNameProp.value.toLowerCase() as WidgetType;
    }
    return result;
  }
}
