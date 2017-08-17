import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';
import {inject} from 'aurelia-framework';
import {IProcessEngineRepository, IProcessEngineService} from '../../contracts';

@inject('ProcessEngineRepository')
export class ProcessEngineService implements IProcessEngineService {

  private repository: IProcessEngineRepository;

  constructor(repository: IProcessEngineRepository) {
    this.repository = repository;
  }

  public getProcesses(): Promise<Array<IProcessDefEntity>> {
    return this.repository.getProcesses();
  }

  public startProcess(process: IProcessDefEntity): Promise<any> {
    return this.repository.startProcess(process);
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
}
