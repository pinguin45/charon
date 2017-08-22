import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';
import {computedFrom, inject} from 'aurelia-framework';
import {IProcessEngineService} from '../../contracts';
import {DynamicUiWrapper} from '../dynamic-ui-wrapper/dynamic-ui-wrapper';

@inject('ProcessEngineService')
export class ProcessStart {

  private processEngineService: IProcessEngineService;
  private dynamicUiWrapper: DynamicUiWrapper;
  private _process: IProcessDefEntity;

  constructor(processEngineService: IProcessEngineService) {
    this.processEngineService = processEngineService;
  }

  private activate(routeParameters: {processId: string}): void {
    this.processEngineService.getProcessbyID(routeParameters.processId)
      .then((result: any) => {
        if (result && !result.error) {
          this._process = result;
        }
    });
  }

  public get process(): IProcessDefEntity {
    return this._process;
  }

  public startProcess(): void {
    this.processEngineService.startProcess(this.process);
  }
}
