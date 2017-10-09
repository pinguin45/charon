import {IQueryClause} from '@process-engine-js/core_contracts';
import {IProcessDefEntity, IUserTaskEntity} from '@process-engine-js/process_engine_contracts';
import {HttpClient, Interceptor} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {IAuthenticationService, IPagination, IProcessEngineRepository} from '../../contracts';
import environment from '../../environment';

@inject(HttpClient, 'AuthenticationService')
export class ProcessEngineRepository implements IProcessEngineRepository {

  private http: HttpClient;
  private authenticationService: IAuthenticationService;

  constructor(http: HttpClient, authenticationService: IAuthenticationService) {
    this.http = http;
    this.authenticationService = authenticationService;
    if (http.defaults === null || http.defaults === undefined) {
      http.defaults = {};
    }
    this.http = http.configure((config: any): void => {
      config.withInterceptor({
        request(request: Request): Request {
          if (authenticationService.hasToken()) {
            request.headers.set('Authorization', `Bearer ${authenticationService.getToken()}`);
          }
          return request;
        },
      });
    });
  }

  public getProcesses(limit: number, offset: number): Promise<IPagination<IProcessDefEntity>> {
    const url: string = `${environment.processengine.routes.processes}?limit=${limit}&offset=${offset}`;
    return this.http
      .fetch(url, {method: 'get'})
      .then((response: Response) => {
        return response.json();
      });
  }

  public getIdentity(): Promise<any> {
    return this.http
      .fetch(environment.processengine.routes.getIdentity, {method: 'get'})
      .then((response: Response) => {
        return response.json();
      })
      .then((result: any) => {
        const responseFailed: boolean = result.error || !result.result;
        if (responseFailed) {
          throw new Error(result.error);
        }
      });
  }

  public deleteProcessDef(processId: string): Promise<void> {
    const url: string = environment.processengine.routes.processes + '/' + processId;
    return this.http
      .fetch(url, {
        method: 'delete',
      })
      .then((response: Response) => {
        return response.json();
      }).then((result: any) => {
        const responseFailed: boolean = result.error || !result.result;
        if (responseFailed) {
          throw new Error(result.error);
        }
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
      });
  }

  public getUserTasks(limit: number, offset: number): Promise<IPagination<IUserTaskEntity>> {
    const url: string = environment.processengine.routes.userTasks + '?expandCollection=["process.processDef", "nodeDef"]';
    return this.http
      .fetch(url, {method: 'get'})
      .then((response: Response) => {
        return response.json();
      });
  }

  public getUserTaskById(userTaskId: string): Promise<IUserTaskEntity> {
    const url: string = environment.processengine.routes.userTasks + '/' + userTaskId + '?expandEntity=["process.processDef", "nodeDef"]';
    return this.http
      .fetch(url, {method: 'get'})
      .then((response: Response) => {
        return response.json();
      });
  }
}
