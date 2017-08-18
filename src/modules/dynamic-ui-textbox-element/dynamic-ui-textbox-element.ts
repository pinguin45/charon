import {bindable} from 'aurelia-framework';

export class DynamicUiTextboxElement {
  @bindable() private label: string;
  @bindable() private defaultValue: string;
  @bindable() private id: string;
}
