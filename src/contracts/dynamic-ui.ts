export type WidgetType = 'textbox' | 'checkbox' | 'dropdown' | 'label' | 'form' | 'confirm';
export type FormFieldType = 'textbox' | 'checkbox' | 'dropdown';

export interface IDynamicUiService {
  sendProceedAction(action: string, widget: IWidget): void;
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
  layout: Array<ILayout>;
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
