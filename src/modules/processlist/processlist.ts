import {inject, computedFrom} from 'aurelia-framework';
import {ProcessDef, IProcessEngineService} from '../../contracts';

@inject('ProcessEngineService')
export class Processlist {

  private processEngineService: IProcessEngineService;
  private _processes: Array<ProcessDef> = [];

  constructor(processEngineService: IProcessEngineService) {
    this.processEngineService = processEngineService;
    this.processEngineService.getProcesses()
      .then((result: Array<ProcessDef>) => {
        this._processes = result;
      });
  }

  @computedFrom('_processes')
  public get processes(): Array<ProcessDef> {
    return this._processes;
  }

}
