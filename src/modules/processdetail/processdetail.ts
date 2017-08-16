import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';
import {computedFrom, inject} from 'aurelia-framework';
import {IProcessEngineService} from '../../contracts';
import environment from '../../environment';

@inject('ProcessEngineService')
export class Processdetail {

  private processEngineService: IProcessEngineService;
  private _process: IProcessDefEntity;

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

}
