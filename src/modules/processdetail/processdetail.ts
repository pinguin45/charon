import {computedFrom, inject} from 'aurelia-framework';
import environment from '../../environment';

export class Processdetail {

  private activate(routeParameters: {processId: string}): void {
    console.log(routeParameters.processId);
  }
}
