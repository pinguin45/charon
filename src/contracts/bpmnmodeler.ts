export interface IBpmnModelerConstructor {
  new(options: {
    additionalModules?: Array<IDependencyHook>,
    container?: string,
  }): IBpmnModeler;
}

export interface IDependencyHook {
  __depends__: Array<string>;
  __init__: Array<string>;
  [index: string]: [string, any] | Array<string>;
}

export interface IBpmnModeler {
  moddle: {
    toXML(definitions: any, unknown: any, callback: (error: Error, result: String) => void): void;
  };
  definitions: any;
  attachTo(wrapper: HTMLElement): void;
  importXML(xml: string,
            errorHandler: (err: Error) => void): void;
}

export interface IEventBus {
  on(events: Array<string> | string,
     priority: number,
     callback: Function,
     callbackScope?: any): void;
  on(events: Array<string> | string,
     callback: Function,
     callbackScope?: any): void;

  once(events: Array<string> | string,
       priority: number,
       callback: Function,
       callbackScope: any): void;
  once(events: Array<string> | string,
       callback: Function,
       callbackScope: any): void;

  off(event: string,
      callback?: Function): void;

  fire(name: string,
       data?: any): any;
  fire(eventObject: { type: string }, // tslint:disable-line
       data?: any): any;
}

export interface IModdleElement {
  id: string;
  get: any;
  $type: string;
  $attrs?: any;
  $parent?: IModdleElement;
}

export interface IShape {
  businessObject: IModdleElement;
  id: string;
  type: string;
  label: IShape;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ICanvas {
  getRootElement(): IShape;
}
