// import {computedFrom, inject } from 'aurelia-framework';
// import * as Modeler from 'bpmn-js';

// //@inject('ProcessEngineService')
// export class BPMNIO {

//     private modeler: Modeler;

//     constructor(modeler: Modeler) {
//         this.modeler = new Modeler({ container: '#canvas'});
//     }

//     // public importDiagram(): void {
//     //     Modeler.importXML(bpmnXML, {

//     //     });
//     // }

// }
import { IBpmnModeler, IBpmnModelerConstructor } from '../../contracts';
import { startdiagram } from './bpmn-xml';

export class BpmnIo {

    private attached(): void {
        // bundle exposes the viewer / modeler via the BpmnJS variable
        const BpmnModeler: IBpmnModelerConstructor  = (window as any).BpmnJS;
        const modeler: IBpmnModeler = new BpmnModeler({ container: '#canvas' });
        modeler.importXML(startdiagram, (err: Error) => {
        return 0;
        });
    }

}
