import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';

export interface IProcessEngineRepository {
  getProcesses(limit: number, offset: number): Promise<IPagination<IProcessDefEntity>>;
  startProcess(process: IProcessDefEntity): Promise<any>;
  deleteProcessDef(processId: string): Promise<void>;
  getInstances(processKey: string): Promise<Array<IProcessDefEntity>>;
  getProcessbyID(processKey: string): Promise<IProcessDefEntity>;
  updateProcessDef(processDef: IProcessDefEntity, xml: string): Promise<any>;
  getIdentity(): Promise<any>;
}

export interface IProcessEngineService {
  getProcesses(limit: number, offset: number): Promise<IPagination<IProcessDefEntity>>;
  startProcess(process: IProcessDefEntity): Promise<any>;
  deleteProcessDef(processId: string): Promise<void>;
  getInstances(processKey: string): Promise<Array<IProcessDefEntity>>;
  getProcessbyID(processKey: string): Promise<IProcessDefEntity>;
  updateProcessDef(processDef: IProcessDefEntity, xml: string): Promise<any>;
  getIdentity(): Promise<any>;
}

export interface IPagination<T> {
  count: number;
  offset: number;
  limit: number;
  data: Array<T>;
}

export interface IMessageBusService {
  createMessage(): any;
  sendMessage(channel: string, message: any): Promise<any>;
  registerMessageHandler(handler: (channel: string, message: any) => void): void;
  removeMessageHandler(handler: (channel: string, message: any) => void): void;
}

export interface INanomsgService {
  createMessage(): any;
  sendMessage(channel: string, message: any): Promise<any>;
  registerMessageHandler(handler: (channel: string, message: any) => void): void;
  removeMessageHandler(handler: (channel: string, message: any) => void): void;
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
