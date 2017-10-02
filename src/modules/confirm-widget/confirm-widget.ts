import {bindable} from 'aurelia-framework';
import * as $ from 'jquery';
import * as Mustache from 'mustache';

export class ConfirmWidget {

  @bindable()
  private widget: any;

  private activate(widget: any): void {
    this.widget = widget;
  }

  private attached(widget: any): void {
    const template: any = $('#template').html();
    Mustache.parse(template);   // optional, speeds up future uses
    const rendered: any = Mustache.render(template, this.widget.uiData);
    $('#target').html(rendered);
  }

}
