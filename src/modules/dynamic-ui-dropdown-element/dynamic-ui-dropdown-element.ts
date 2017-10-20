import {IFormWidgetEnumField} from '@process-engine/consumer_client';
import {bindable} from 'aurelia-framework';

export class DynamicUiDropdownElement {

  @bindable()
  private field: IFormWidgetEnumField;

  private activate(field: IFormWidgetEnumField): void {
    this.field = field;
  }
}
