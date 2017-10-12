import {IQueryClause} from '@essential-projects/core_contracts';
import {IProcessDefEntity, IUserTaskEntity} from '@process-engine/process_engine_contracts';
import {HttpClient, Interceptor} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {IAuthenticationService, IPagination, IProcessEngineRepository, IProcessEntity} from '../../contracts';
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

  public async getProcesses(limit: number, offset: number): Promise<IPagination<IProcessDefEntity>> {
    const url: string = `${environment.processengine.routes.processes}?limit=${limit}&offset=${offset}`;
    const response: Response = await this.http.fetch(url, { method: 'get' });
    const pagination: IPagination<IProcessDefEntity> = await response.json();
    return pagination;
  }

  public async getIdentity(): Promise<any> {
    const url: string = `${environment.processengine.routes.iam}/getidentity`;
    const response: Response = await this.http.fetch(url, { method: 'get' });

    const result: any = response.json();
    const responseFailed: boolean = result.error || !result.result;

    if (responseFailed) {
      throw new Error(result.error);
    }
    return result;
  }

  public async deleteProcessDef(processId: string): Promise<void> {
    const url: string = environment.processengine.routes.processes + '/' + processId;
    const response: Response = await this.http.fetch(url, { method: 'delete' });

    const result: any = response.json();
    const responseFailed: boolean = result.error || !result.result;

    if (responseFailed) {
      throw new Error(result.error);
    }
  }

  public async startProcess(process: IProcessDefEntity): Promise<any> {
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

    const response: Response = await this.http.fetch(environment.processengine.routes.startProcess, options);
    return response.json();
  }

  public async updateProcessDef(processDef: IProcessDefEntity, xml: string): Promise<any> {
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
    const response: Response = await this.http.fetch(url, options);
    return response.json();
  }

  public async getInstances(processKey: string): Promise<Array<IProcessEntity>> {
    const query: IQueryClause = {
      attribute: 'processDef',
      operator: '=',
      value: processKey,
    };
    const url: string = environment.processengine.routes.processInstances + '?query=' + JSON.stringify(query);

    const response: Response = await this.http.fetch(url, {method: 'get'});
    const responseBody: IPagination<IProcessEntity> = await response.json();
    return responseBody.data;
  }

  public async getProcessbyID(processKey: string): Promise<IProcessDefEntity> {
    const url: string = environment.processengine.routes.processes + '/' + processKey;
    const response: Response = await this.http.fetch(url, {method: 'get'});
    const processDefEntity: IProcessDefEntity  = await response.json();
    return processDefEntity;
  }

  public async getUserTasks(limit: number, offset: number): Promise<IPagination<IUserTaskEntity>> {
    const url: string = environment.processengine.routes.userTasks + '?expandCollection=["process.processDef", "nodeDef"]&limit="ALL"';
    const response: Response = await this.http.fetch(url, {method: 'get'});
    const pagination: IPagination<IUserTaskEntity> = await response.json();
    return pagination;
  }

  public async getUserTaskById(userTaskId: string): Promise<IUserTaskEntity> {
    const url: string = environment.processengine.routes.userTasks + '/' + userTaskId + '?expandEntity=["process.processDef", "nodeDef"]';
    const response: Response = await this.http.fetch(url, {method: 'get'});
    const userTaskEntity: IUserTaskEntity = await response.json();
    return userTaskEntity;
  }
}
