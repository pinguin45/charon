import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';

export interface IProcessEngineRepository {
  getProcesses(): Promise<Array<IProcessDefEntity>>;
  startProcess(process: IProcessDefEntity): Promise<any>;
}

export interface IProcessEngineService {
  getProcesses(): Promise<Array<IProcessDefEntity>>;
  startProcess(process: IProcessDefEntity): Promise<any>;
}

export interface Pagination<T> {
  count: number;
  offset: number;
  limit: number;
  data: Array<T>;
}
