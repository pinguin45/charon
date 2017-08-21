import {bindable} from 'aurelia-framework';
import {IWidget} from '../../contracts';

export class DynamicUi {

  @bindable()
  private widget: IWidget;

  public go(): void {
    for (const field of this.widget.fields) {
      console.log(field.value);
    }

  }
}
