import {inject} from 'aurelia-framework';
import {IProcessEngineRepository, IProcessEngineService, ProcessDef} from '../../contracts';

@inject('ProcessEngineRepository')
export class ProcessEngineService implements IProcessEngineService {

  private repository: IProcessEngineRepository;

  constructor(repository: IProcessEngineRepository) {
    this.repository = repository;
  }

  public getProcesses(): Promise<Array<ProcessDef>> {
    return this.repository.getProcesses();
  }

  public startProcess(process: ProcessDef): Promise<any> {
    return this.repository.startProcess(process);
  }
}
