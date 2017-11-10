import {bindable} from 'aurelia-framework';

export class ConfirmWidget {

  @bindable()
  private widget: any;
  private template: HTMLElement;
  private target: HTMLLabelElement;

  private activate(widget: any): void {
    this.widget = widget;
  }

}
