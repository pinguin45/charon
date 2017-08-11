import {inject} from 'aurelia-framework';
import {ProcessDef, IProcessEngineRepository, IProcessEngineService} from '../../contracts';

@inject('ProcessEngineRepository')
export class ProcessEngineService implements IProcessEngineService {

  private repository: IProcessEngineRepository;

  constructor(repository: IProcessEngineRepository) {
    this.repository = repository;
  }

  getProcesses(): Promise<Array<ProcessDef>> {
    return this.repository.getProcesses();
  }
}
