import {IFormWidgetBooleanField} from '@process-engine/consumer_client';
import {bindable} from 'aurelia-framework';

export class DynamicUiCheckboxElement {

  @bindable()
  private field: IFormWidgetBooleanField;

  private activate(field: IFormWidgetBooleanField): void {
    this.field = field;
  }
}
