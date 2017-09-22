import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';
import {inject} from 'aurelia-framework';
import {IPagination, IProcessEngineRepository, IProcessEngineService} from '../../contracts';

@inject('ProcessEngineRepository')
export class ProcessEngineService implements IProcessEngineService {

  private repository: IProcessEngineRepository;

  constructor(repository: IProcessEngineRepository) {
    this.repository = repository;
  }

  public getProcesses(limit: number, offset: number): Promise<IPagination<IProcessDefEntity>> {
    return this.repository.getProcesses(limit, offset);
  }

  public startProcess(process: IProcessDefEntity, participantID: string): Promise<any> {
    return this.repository.startProcess(process, participantID);
  }

  public deleteProcessDef(processId: string): Promise<void> {
    return this.repository.deleteProcessDef(processId);
  }

  public getInstances(processKey: string): Promise<Array<IProcessDefEntity>> {
    return this.repository.getInstances(processKey);
  }

  public getProcessbyID(processKey: string): Promise<IProcessDefEntity> {
    return this.repository.getProcessbyID(processKey);
  }

  public updateProcessDef(processDef: IProcessDefEntity, xml: string): Promise<any> {
    return this.repository.updateProcessDef(processDef, xml);
  }

  public getIdentity(): Promise<any> {
    return this.repository.getIdentity();
  }
}
