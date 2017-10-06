import {IUserTaskEntity} from '@process-engine-js/process_engine_contracts';

export type WidgetType = 'textbox' | 'checkbox' | 'dropdown' | 'label' | 'form' | 'confirm';
export type FormFieldType = 'textbox' | 'checkbox' | 'dropdown';

export interface IDynamicUiService {
  sendProceedAction(action: string, widget: IWidget): void;
  mapUserTask(task: IUserTaskEntity): IWidget;
}

export interface IWidget {
  taskEntityId: string;
  name: string;
  type: WidgetType;
}

export interface IFormWidget extends IWidget {
  fields: Array<IFormField | IDropDownField>;
}

export interface IConfirmWidget extends IWidget {
  message: string;
  layout: Array<ILayout>;
  uiData: any;
}

export interface IFormField {
  id: string;
  label: string;
  type: FormFieldType;
  defaultValue: string | boolean;
  value: string | boolean;
}

export interface ILayout {
  key: string;
  label: string;
  isCancel?: boolean;
}

export interface IDropDownField extends IFormField {
  values: Array<IDropDownFieldValue>;
}

export interface IDropDownFieldValue {
  id: string;
  name: string;
}
