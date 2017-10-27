import {IFormWidgetBooleanField} from '@process-engine/consumer_client';
import {bindable} from 'aurelia-framework';

export class DynamicUiCheckboxElement {

  @bindable()
  public field: IFormWidgetBooleanField;

  public activate(field: IFormWidgetBooleanField): void {
    this.field = field;
    if (this.field.value === undefined || this.field.value === null) {
      this.field.value = Boolean(this.field.defaultValue);
    }
  }
}
