import {autoinject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import environment from '../../environment';
import {ProcessDef, ProcessDefPagination, IProcessEngineRepository} from '../../contracts';

@autoinject
export class ProcessEngineRepository implements IProcessEngineRepository {

  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getProcesses(): Promise<Array<ProcessDef>> {
    return this.http
      .fetch(environment.processengine.routes.processes, {method: 'get'})
      .then((response: Response) => {
        return response.json();
      }).then((list: ProcessDefPagination) => {
        return list.data;
      });
  }
}
