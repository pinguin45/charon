import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';
import {inject} from 'aurelia-framework';
import {IPagination, IProcessEngineService} from '../../contracts';
import environment from '../../environment';

@inject('ProcessEngineService')
export class Processlist {

  private offset: number;
  private processEngineService: IProcessEngineService;
  private _processes: IPagination<IProcessDefEntity>;
  private getProcessesIntervalId: number;

  constructor(processEngineService: IProcessEngineService) {
    this.processEngineService = processEngineService;
  }

  public getProcessesFromService(offset: number): void {
    this.processEngineService.getProcesses(environment.processlist.pageLimit, offset)
      .then((result: IPagination<IProcessDefEntity>) => {
        this._processes = result;
      });
  }

  private activate(routeParameters: {page: number}): void {
    const page: number = routeParameters.page || 1;
    this.offset = (page - 1) * environment.processlist.pageLimit;
    this.getProcessesFromService(this.offset);
  }

  private attached(): void {
    this.getProcessesFromService(this.offset);
    this.getProcessesIntervalId = window.setInterval(() => {
      this.getProcessesFromService(this._processes.offset);
      // tslint:disable-next-line
    }, environment.processengine.poolingInterval);
  }

  private detached(): void {
    clearInterval(this.getProcessesIntervalId);
  }

  public get limit(): number {
    if (this._processes === undefined) {
      return 0;
    }
    return this._processes.limit;
  }

  public get maxPages(): number {
    if (this._processes === undefined) {
      return 0;
    }
    return Math.ceil(this._processes.count / this._processes.limit);
  }

  public get currentPage(): number {
    if (this._processes === undefined) {
      return 0;
    }
    return this._processes.offset / this._processes.limit + 1;
  }

  public get processes(): Array<IProcessDefEntity> {
    if (this._processes === undefined) {
      return [];
    }
    return this._processes.data;
  }

  public startProcess(process: IProcessDefEntity): void {
    this.processEngineService.startProcess(process);
  }
}
