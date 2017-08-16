import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';
import {computedFrom, inject} from 'aurelia-framework';
import {IProcessEngineService} from '../../contracts';
import environment from '../../environment';

@inject('ProcessEngineService')
export class Processdetail {

  private processEngineService: IProcessEngineService;
  private _process: Array<IProcessDefEntity> = [];

  constructor(processEngineService: IProcessEngineService) {
    this.processEngineService = processEngineService;
  }

  private activate(routeParameters: {processId: string}): void {
    this.processEngineService.getProcessbyID(routeParameters.processId)
      .then((result: Array<IProcessDefEntity>) => {
      this._process = result;
    });
  }
}
