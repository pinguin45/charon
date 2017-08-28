import {Aurelia} from 'aurelia-framework';
import environment from './environment';

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .feature('modules/dynamic-ui')
    .feature('modules/processengine')
    .feature('modules/messagebus')
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
