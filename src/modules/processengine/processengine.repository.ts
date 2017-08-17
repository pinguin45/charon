import {IQueryClause} from '@process-engine-js/core_contracts';
import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';
import {HttpClient} from 'aurelia-fetch-client';
import {autoinject} from 'aurelia-framework';
import {IPagination, IProcessEngineRepository} from '../../contracts';
import environment from '../../environment';

@autoinject
export class ProcessEngineRepository implements IProcessEngineRepository {

  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public getProcesses(limit: number, offset: number): Promise<IPagination<IProcessDefEntity>> {
    const url: string = environment.processengine.routes.processes + '?limit=' + limit + '&offset=' + offset;
    return this.http
      .fetch(url, {method: 'get'})
      .then((response: Response) => {
        return response.json();
      }).then((list: IPagination<IProcessDefEntity>) => {
        return list;
      });
  }

  public startProcess(process: IProcessDefEntity): Promise<any> {
    const options: RequestInit = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        msg: {
          key: process.key,
        },
      }),
    };

    return this.http
      .fetch(environment.processengine.routes.startProcess, options)
      .then((response: Response) => {
        return response.json();
      });
  }

  public updateProcessDef(processDef: IProcessDefEntity, xml: string): Promise<any> {
    const options: RequestInit = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          xml: xml,
      }),
    };
    const url: string = environment.processengine.routes.processes + '/' + processDef.id + '/updateBpmn';
    return this.http
      .fetch(url, options)
      .then((response: Response) => {
        return response.json();
      });
  }

  public getInstances(processKey: string): Promise<Array<IProcessDefEntity>> {
    const query: IQueryClause = {
      attribute: 'processDef',
      operator: '=',
      value: processKey,
    };
    const url: string = environment.processengine.routes.processInstances + '?query=' + JSON.stringify(query);
    return this.http
      .fetch(url, {method: 'get'})
      .then((response: Response) => {
        return response.json();
      }).then((list: IPagination<IProcessDefEntity>) => {
        return list.data;
      });
  }

  public getProcessbyID(processKey: string): Promise<IProcessDefEntity> {
    const url: string = environment.processengine.routes.processes + '/' + processKey;
    return this.http
      .fetch(url, {method: 'get'})
      .then((response: Response) => {
        return response.json();
      }).then((processDef: IProcessDefEntity) => {
        return processDef;
      });
  }
}
