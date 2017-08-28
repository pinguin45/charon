import {bindable} from 'aurelia-framework';
import {IFormWidget} from '../../contracts';

export class FormWidget {

  @bindable()
  private widget: IFormWidget;
}
