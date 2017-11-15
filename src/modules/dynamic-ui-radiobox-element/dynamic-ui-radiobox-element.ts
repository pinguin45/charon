import {IFormWidgetEnumField} from '@process-engine/consumer_client';
import {bindable} from 'aurelia-framework';

export class DynamicUiRadioboxElement {

  @bindable()
  public field: IFormWidgetEnumField;

  public activate(field: IFormWidgetEnumField): void {
    this.field = field;
    if (this.field.value === undefined || this.field.value === null || this.field.value === '') {
      this.field.value = this.field.defaultValue;
    }
  }
}
