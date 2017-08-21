export class DynamicUiTextboxElement {
  private label: string;
  private defaultValue: string;
  private id: string;
  private placeholder: string;

  private activate(model: any): void {
    this.label = model.label;
    this.defaultValue = model.defaultValue;
    this.id = model.id;
    this.placeholder = model.placeholder;
  }
}
