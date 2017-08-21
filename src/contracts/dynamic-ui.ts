export type WidgetType = 'textbox' | 'checkbox' | 'dropdown' | 'label' | 'form';
export type FormFieldType = 'textbox' | 'checkbox' | 'dropdown';

export interface IWidget {
  uiName: string;
  type: WidgetType;
}

export interface IFormWidget extends IWidget {
  fields: Array<IFormField | IDropDownField>;
}

export interface IFormField {
  id: string;
  label: string;
  type: FormFieldType;
  defaultValue: string | boolean;
}

export interface IDropDownField extends IFormField {
  values: Array<string>;
}
