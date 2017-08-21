import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';

export interface IProcessEngineRepository {
  getProcesses(limit: number, offset: number): Promise<IPagination<IProcessDefEntity>>;
  startProcess(process: IProcessDefEntity): Promise<any>;
  getInstances(processKey: string): Promise<Array<IProcessDefEntity>>;
  getProcessbyID(processKey: string): Promise<IProcessDefEntity>;
  updateProcessDef(processDef: IProcessDefEntity, xml: string): Promise<any>;
}

export interface IProcessEngineService {
  getProcesses(limit: number, offset: number): Promise<IPagination<IProcessDefEntity>>;
  startProcess(process: IProcessDefEntity): Promise<any>;
  getInstances(processKey: string): Promise<Array<IProcessDefEntity>>;
  getProcessbyID(processKey: string): Promise<IProcessDefEntity>;
  updateProcessDef(processDef: IProcessDefEntity, xml: string): Promise<any>;
}

export interface IPagination<T> {
  count: number;
  offset: number;
  limit: number;
  data: Array<T>;
}

export interface IMessageBusService {
  procced(taskEntityId: string, messageToken: any): void;
}

// process engine does not provide an interface
export interface IUserTaskEntityExtensions {
  formFields: Array<IUserTaskFormField>;
}

export interface IUserTaskFormField {
  id: string;
  label: string;
  type: 'long' | 'boolean' | 'date' | 'enum' | 'string' | 'custom_type';
  defaultValue?: string | boolean;
  formValues: Array<IUserTaskFormFieldValue>;
}

export interface IUserTaskFormFieldValue {
  id: string;
  name: string;
}
