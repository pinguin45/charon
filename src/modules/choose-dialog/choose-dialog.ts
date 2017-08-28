import {bindable} from 'aurelia-framework';
import {IChooseDialogOption} from '../../contracts';

export class ChooseDialog {

  @bindable()
  private options: Array<IChooseDialogOption>;
  @bindable()
  private onSelected: ((option: any) => void);

  public onSelect(selected: IChooseDialogOption): void {
    if (this.onSelected) {
      this.onSelected(selected.value);
    }
  }
}
