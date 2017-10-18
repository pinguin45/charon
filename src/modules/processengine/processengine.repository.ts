import {IQueryClause} from '@essential-projects/core_contracts';
import {IProcessDefEntity, IUserTaskEntity} from '@process-engine/process_engine_contracts';
import {HttpClient, Interceptor} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import {IAuthenticationService, IIdentity, IPagination, IProcessEngineRepository, IProcessEntity} from '../../contracts';
import environment from '../../environment';
import {throwOnErrorResponse} from '../../resources/http-repository-tools';

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

  public async getProcessDefs(limit: number, offset: number): Promise<IPagination<IProcessDefEntity>> {
    const url: string = `${environment.processengine.routes.processes}?limit=${limit}&offset=${offset}`;
    const response: Response = await this.http.fetch(url, { method: 'get' });

    return throwOnErrorResponse<IPagination<IProcessDefEntity>>(response);
  }

  public async getProcessDefById(processDefId: string): Promise<IProcessDefEntity> {
    const url: string = `${environment.processengine.routes.processes}/${processDefId}`;
    const response: Response = await this.http.fetch(url, {method: 'get'});

    return throwOnErrorResponse<IProcessDefEntity>(response);
  }

  public async getIdentity(): Promise<any> {
    const url: string = `${environment.processengine.routes.iam}/getidentity`;
    const response: Response = await this.http.fetch(url, { method: 'get' });

    return throwOnErrorResponse<IIdentity>(response);
  }

  public async deleteProcessDef(processId: string): Promise<void> {
    const url: string = `${environment.processengine.routes.processes}/${processId}`;
    const response: Response = await this.http.fetch(url, { method: 'delete' });

    return throwOnErrorResponse<void>(response);
  }

  public async startProcess(process: IProcessDefEntity): Promise<string> {
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

    return throwOnErrorResponse<string>(response);
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
    const url: string = `${environment.processengine.routes.processes}/${processDef.id}/updateBpmn`;
    const response: Response = await this.http.fetch(url, options);

    return throwOnErrorResponse<any>(response);
  }

  public async getUserTasks(limit: number, offset: number): Promise<IPagination<IUserTaskEntity>> {
    const query: IQueryClause = {
      attribute: 'state',
      operator: '=',
      value: 'wait',
    };
    const parameters: string = `expandCollection=["process.processDef", "nodeDef"]&limit=${limit}&offset=${offset}`;
    const url: string = `${environment.processengine.routes.userTasks}?${parameters}&query=${JSON.stringify(query)}`;
    const response: Response = await this.http.fetch(url, {method: 'get'});

    return throwOnErrorResponse<IPagination<IUserTaskEntity>>(response);
  }

  public async getUserTasksByProcessDefId(processDefId: string): Promise<IPagination<IUserTaskEntity>> {
    const query: IQueryClause = {
      attribute: 'process.processDef.id',
      operator: '=',
      value: processDefId,
    };
    const parameters: string = `expandCollection=["process.processDef", "nodeDef"]&limit="ALL"`;
    const url: string = `${environment.processengine.routes.userTasks}?${parameters}&query=${JSON.stringify(query)}`;

    const response: Response = await this.http.fetch(url, {method: 'get'});
    return throwOnErrorResponse<IPagination<IUserTaskEntity>>(response);
  }

  public async getUserTasksByProcessId(processId: string): Promise<IPagination<IUserTaskEntity>> {
    const query: IQueryClause = {
      attribute: 'process.id',
      operator: '=',
      value: processId,
    };
    const parameters: string = `expandCollection=["process.processDef", "nodeDef"]&limit="ALL"`;
    const url: string = `${environment.processengine.routes.userTasks}?${parameters}&query=${JSON.stringify(query)}`;

    const response: Response = await this.http.fetch(url, {method: 'get'});
    return throwOnErrorResponse<IPagination<IUserTaskEntity>>(response);
  }

  public async getUserTaskById(userTaskId: string): Promise<IUserTaskEntity> {
    const url: string = `${environment.processengine.routes.userTasks}/${userTaskId}?expandEntity=["process.processDef", "nodeDef"]`;
    const response: Response = await this.http.fetch(url, {method: 'get'});

    return throwOnErrorResponse<IUserTaskEntity>(response);
  }

  public async getProcesses(limit: number, offset: number): Promise<IPagination<IProcessEntity>> {
    const url: string = `${environment.processengine.routes.processInstances}/?limit=${limit}&offset=${offset}`;
    const response: Response = await this.http.fetch(url, {method: 'get'});

    return throwOnErrorResponse<IPagination<IProcessEntity>>(response);
  }

  public async getProcessById(processId: string): Promise<IProcessEntity> {
    const url: string = `${environment.processengine.routes.processInstances}/${processId}`;
    const response: Response = await this.http.fetch(url, {method: 'get'});

    return throwOnErrorResponse<IProcessEntity>(response);
  }

  public async getProcessesByProcessDefId(processDefId: string): Promise<IPagination<IProcessEntity>> {
    const query: IQueryClause = {
      attribute: 'processDef.id',
      operator: '=',
      value: processDefId,
    };
    const url: string = `${environment.processengine.routes.processInstances}?query=${JSON.stringify(query)}`;

    const response: Response = await this.http.fetch(url, {method: 'get'});
    return throwOnErrorResponse<IPagination<IProcessEntity>>(response);
  }
}
