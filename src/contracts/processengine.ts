import {IProcessDefEntity, IProcessEntity, IUserTaskEntity} from '@process-engine/process_engine_contracts';
export {IProcessDefEntity, IProcessEntity, IUserTaskEntity} from '@process-engine/process_engine_contracts';

export interface IProcessEngineRepository {
  getProcessDefs(limit: number, offset: number): Promise<IPagination<IProcessDefEntity>>;
  getProcessDefById(processDefId: string): Promise<IProcessDefEntity>;
  startProcess(process: IProcessDefEntity): Promise<string>;
  updateProcessDef(processDef: IProcessDefEntity, xml: string): Promise<any>;
  deleteProcessDef(processId: string): Promise<void>;
  getIdentity(): Promise<any>;
  getProcesses(): Promise<IPagination<IProcessEntity>>;
  getProcessesByProcessDefId(processDefId: string): Promise<IPagination<IProcessEntity>>;
  getProcessById(processId: string): Promise<IProcessEntity>;
  getUserTasks(limit: number, offset: number): Promise<IPagination<IUserTaskEntity>>;
  getUserTasksByProcessDefId(processDefId: string): Promise<IPagination<IUserTaskEntity>>;
  getUserTasksByProcessId(processId: string): Promise<IPagination<IUserTaskEntity>>;
  getUserTaskById(userTaskId: string): Promise<IUserTaskEntity>;
}

export interface IProcessEngineService {
  getProcessDefs(limit: number, offset: number): Promise<IPagination<IProcessDefEntity>>;
  getProcessDefById(processDefId: string): Promise<IProcessDefEntity>;
  startProcess(process: IProcessDefEntity): Promise<string>;
  updateProcessDef(processDef: IProcessDefEntity, xml: string): Promise<any>;
  deleteProcessDef(processId: string): Promise<void>;
  getIdentity(): Promise<any>;
  getProcesses(): Promise<IPagination<IProcessEntity>>;
  getProcessesByProcessDefId(processDefId: string): Promise<IPagination<IProcessEntity>>;
  getProcessById(processId: string): Promise<IProcessEntity>;
  getUserTasks(limit: number, offset: number): Promise<IPagination<IUserTaskEntity>>;
  getUserTasksByProcessDefId(processDefId: string): Promise<IPagination<IUserTaskEntity>>;
  getUserTasksByProcessId(processId: string): Promise<IPagination<IUserTaskEntity>>;
  getUserTaskById(userTaskId: string): Promise<IUserTaskEntity>;
}

export interface IPagination<T> {
  count: number;
  offset: number;
  limit: number;
  data: Array<T>;
}

export interface IErrorResponse {
  error: any;
}
