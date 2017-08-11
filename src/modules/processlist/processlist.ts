import {autoinject, inject} from 'aurelia-framework';
import {ProcessDef, IProcessEngineService} from '../../contracts';

@inject('ProcessEngineService')
export class Processlist {

  private processEngineService: IProcessEngineService;

  public constructor(processEngineService: IProcessEngineService) {
    this.processEngineService = processEngineService;
  }
}
