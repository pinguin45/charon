import {bindable} from 'aurelia-framework';

export class ConfirmWidget {

  @bindable()
  private widget: any;

  private activate(widget: any): void {
    this.widget = widget;
  }

}
