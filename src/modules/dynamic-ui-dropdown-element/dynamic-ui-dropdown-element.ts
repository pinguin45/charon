export class DynamicUiDropdownElement {
  private label: string;
  private defaultValue: string;
  private id: string;
  private values: Array<{name: string, label: string}>;

  private activate(model: any): void {
    this.label = model.label;
    this.defaultValue = model.defaultValue;
    this.id = model.id;
    this.values = model.values;
  }
}
