import {FormWidgetFieldType, IFormWidgetConfig, SpecificFormWidgetField} from '@process-engine/consumer_client';
import {bindable} from 'aurelia-framework';

export class FormWidget {

  @bindable()
  private widget: IFormWidgetConfig;

  public getFieldControl(field: any): string {
    switch (field.type) {
      case FormWidgetFieldType.enumeration:
      if (field.formProperties.length < 1) {
        return 'dropdown';
      } else {
        for (const entry of field.formProperties) {
          if (entry.name === 'uiName' && entry.value === 'RadioBox') {
            return 'radiobox';
          }
        }
      }
      case FormWidgetFieldType.string:
        return 'textbox';
      case FormWidgetFieldType.boolean:
        return 'checkbox';
      default:
        return null;
    }
  }
}
