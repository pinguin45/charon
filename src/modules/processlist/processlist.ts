import {autoinject, inject} from 'aurelia-framework';

@inject('ProcessEngineRepository')
export class Processlist {

  private repo;

  public constructor(repo: any) {
    this.repo = repo;
    repo.getProcesses().then((processes) => {
        console.log(processes);
    });
    // console.log(repo);
  }
}
