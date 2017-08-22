import {bindable} from 'aurelia-framework';
import {IFormWidget} from '../../contracts';

export class FormWidget {

  @bindable()
  private widget: IFormWidget;

  public getTokenData(): any {
    const formData: any = {};
    for (const field of this.widget.fields) {
      formData[field.id] = field.value;
    }
    return formData;
  }
}
