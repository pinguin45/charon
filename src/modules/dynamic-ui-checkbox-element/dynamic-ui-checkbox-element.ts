import {bindable} from 'aurelia-framework';

export class DynamicUiCheckboxElement {

  @bindable()
  private model: any;

  private activate(model: any): void {
    this.model = model;
  }
}
