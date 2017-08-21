import {bindable} from 'aurelia-framework';
import {IWidget} from '../../contracts';

export class DynamicUi {

  @bindable()
  private widget: IWidget;
}
