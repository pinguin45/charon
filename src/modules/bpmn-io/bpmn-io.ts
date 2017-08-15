import {IBpmnModeler, IBpmnModelerConstructor} from '../../contracts';
import {startdiagram} from './bpmn-xml';

export class BpmnIo {

  private attached(): void {
    // bundle exposes the viewer / modeler via the BpmnJS variable
    const BpmnModeler: IBpmnModelerConstructor  = (window as any).BpmnJS;
    const modeler: IBpmnModeler = new BpmnModeler({
      container: '#canvas',
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
    });
    modeler.importXML(startdiagram, (err: Error) => {
      return 0;
    });
  }
}
