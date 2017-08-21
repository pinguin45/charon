import { IFormWidget } from '../../contracts';

export class DynamicUi {

  private formWidget: IFormWidget =
  {
    uiName: 'Form',
    type: 'form',
    fields: [
      {
        id: 'name',
        label: 'Name',
        type: 'textbox',
        defaultValue: '',
      },
      {
        id: 'key',
        label: 'Schlüssel',
        type: 'textbox',
        defaultValue: '',
      },
      {
        id: 'lol',
        label: 'save',
        type: 'dropdown',
        defaultValue: '',
        values: [
          'Test',
          'Test2',
        ],
      },
    ],
  };
}
