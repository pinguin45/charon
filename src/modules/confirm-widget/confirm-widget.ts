import {bindable} from 'aurelia-framework';
import * as Mustache from 'mustache';

export class ConfirmWidget {

  @bindable()
  private widget: any;
  private template: HTMLElement;
  private target: HTMLLabelElement;

  private activate(widget: any): void {
    this.widget = widget;
  }

  private attached(widget: any): void {
    const template: any = this.template.innerHTML;
    Mustache.parse(template);   // optional, speeds up future uses
    const rendered: any = Mustache.render(template, this.widget.uiData);
    this.target.innerHTML = rendered;
  }

}
