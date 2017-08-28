import {bindable} from 'aurelia-framework';

export class DynamicUiDropdownElement {

  @bindable()
  private model: any;

  private activate(model: any): void {
    this.model = model;
  }
}
