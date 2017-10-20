import {IFormWidgetStringField} from '@process-engine/consumer_client';
import {bindable} from 'aurelia-framework';

export class DynamicUiTextboxElement {

  @bindable()
  private field: IFormWidgetStringField;

  private activate(field: IFormWidgetStringField): void {
    this.field = field;
  }
}
