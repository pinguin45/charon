export class DynamicUiCheckboxElement {
  private label: string;
  private id: string;
  private _isChecked: boolean;

  private activate(model: any): void {
    this.label = model.label;
    this.id = model.id;
    this._isChecked = model.defaultValue;
  }

  public get isChecked(): boolean {
    return this._isChecked;
  }

  public set isChecked(defaultValue: boolean) {
    this._isChecked = defaultValue;
  }

}
