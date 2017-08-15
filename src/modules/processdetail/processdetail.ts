import {computedFrom, inject} from 'aurelia-framework';
import environment from '../../environment';

export class Processlist {

  private activate(routeParameters: {processId: string}): void {
    console.log(routeParameters.processId);
  }
}
