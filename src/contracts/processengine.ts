export interface Pagination<T> {
  count: number;
  offset: number;
  limit: number;
  data: Array<T>;
}

export interface ProcessDef {
  id: string;
  name: string;
  key: string;
  defID: string;
  xml: string;
  readonly?: boolean;
  version: string;
}

export interface ProcessDefPagination extends Pagination<ProcessDef> {
}
