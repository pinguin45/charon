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

export interface IMessageBusService {
  createMessage(): any;
  sendMessage(channel: string, message: any): Promise<any>;
  registerMessageHandler(handler: (channel: string, message: any) => void): void;
  removeMessageHandler(handler: (channel: string, message: any) => void): void;
}

// process engine does not provide an interface
export interface IUserTaskEntityExtensions {
  formFields: Array<IUserTaskFormField>;
  properties: Array<IUserTaskProperty>;
}

export interface IUserTaskProperty {
  name: string;
  $type: string;
  value: string;
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

export enum MessageAction {
  event = 'event',
  abort = 'abort',
  proceed = 'proceed',
}

export enum MessageEventType {
  cancel = 'cancel',
  proceed = 'proceed',
  decline = 'decline',
}

export interface IMessage {
  action: MessageAction;
  context: {
    participantId: string,
  };
  eventType: MessageEventType;
}

export interface IErrorResponse {
  error: any;
}
