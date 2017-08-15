import {IBpmnModeler, IBpmnModelerConstructor} from '../../contracts';

import * as x from '@process-engine-js/bpmn-js-custom-bundle';
import {startdiagram} from './bpmn-xml';

export class BpmnIo {

  private attached(): void {
    // bundle exposes the viewer / modeler via the BpmnJS variable
    const BpmnModeler: IBpmnModelerConstructor = x;
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
