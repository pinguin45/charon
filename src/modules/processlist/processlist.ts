import {computedFrom, inject} from 'aurelia-framework';
import {IProcessEngineService, ProcessDef} from '../../contracts';
import environment from '../../environment';

@inject('ProcessEngineService')
export class Processlist {

  private processEngineService: IProcessEngineService;
  private _processes: Array<ProcessDef> = [];
  private getProcessesIntervalId: number;

  constructor(processEngineService: IProcessEngineService) {
    this.processEngineService = processEngineService;
  }

  public getProcessesFromService(): void {
    this.processEngineService.getProcesses()
      .then((result: Array<ProcessDef>) => {
        this._processes = result;
      });
  }

  public attached(): void {
    this.getProcessesFromService();
    this.getProcessesIntervalId = window.setInterval(() => {
      this.getProcessesFromService();
      // tslint:disable-next-line
    }, environment.processengine.poolingInterval);
  }

  public detached(): void {
    clearInterval(this.getProcessesIntervalId);
  }

  @computedFrom('_processes')
  public get processes(): Array<ProcessDef> {
    return this._processes;
  }

  public startProcess(process: ProcessDef): void {
    this.processEngineService.startProcess(process);
  }
}
