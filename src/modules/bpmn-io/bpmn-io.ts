import * as bundle from '@process-engine/bpmn-js-custom-bundle';
import {bindable} from 'aurelia-framework';
import {IBpmnModeler, IBpmnModelerConstructor} from '../../contracts';
import environment from '../../environment';

export class BpmnIo {

  @bindable() public xml: string;
  private modeler: IBpmnModeler;

  public attached(): void {
    this.modeler = new bundle.modeler({
      container: '#canvas',
      propertiesPanel: {
        parent: '#js-properties-panel',
      },
      additionalModules: bundle.additionalModules,
      moddleExtensions: {
        camunda: bundle.camundaModdleDescriptor,
      },
    });

    if (this.xml !== undefined && this.xml !== null) {
      this.modeler.importXML(this.xml, (err: Error) => {
        return 0;
      });
    }
  }

  public xmlChanged(newValue: string, oldValue: string): void {
    if (this.modeler !== undefined && this.modeler !== null) {
      this.modeler.importXML(this.xml, (err: Error) => {
        return 0;
      });
    }
  }

  public getXML(): Promise<string> {
    return new Promise((resolve: Function, reject: Function): void => {
      this.modeler.moddle.toXML(this.modeler.definitions, null, (err: Error, result: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

}
