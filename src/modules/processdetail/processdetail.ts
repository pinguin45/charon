import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';
import {computedFrom, inject} from 'aurelia-framework';
import {IProcessEngineService} from '../../contracts';
import environment from '../../environment';
import {BpmnIo} from '../bpmn-io/bpmn-io';

@inject('ProcessEngineService')
export class Processdetail {

  private processEngineService: IProcessEngineService;
  private _process: IProcessDefEntity;
  private bpmn: BpmnIo;

  constructor(processEngineService: IProcessEngineService) {
    this.processEngineService = processEngineService;
  }

  private activate(routeParameters: {processId: string}): void {
    this.processEngineService.getProcessbyID(routeParameters.processId)
      .then((result: IProcessDefEntity) => {
      this._process = result;
    });
  }

  @computedFrom('_process')
  public get process(): IProcessDefEntity {
    return this._process;
  }

  public saveDiagram(): void {
    this.bpmn.getXML().then((xml: string) => {
      return this.processEngineService.updateProcessDef(this.process, xml);
    }).then((response: any) => {
      if (response.error) {
        alert(`Fehler: ${response.error}`);
      } else if (response.result) {
        alert('Gespeichert.');
      } else {
        alert(`Unbekannter Status: ${JSON.stringify(response)}`);
      }
    });
  }
}
