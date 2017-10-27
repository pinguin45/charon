import {Aurelia} from 'aurelia-framework';
import environment from './environment';
import {TokenRepository} from './modules/token-repository/token.repository';

export function configure(aurelia: Aurelia): void {

  const tokenRepository: TokenRepository = new TokenRepository();
  aurelia.container.registerInstance('TokenRepository', tokenRepository);

  aurelia.use
    .standardConfiguration()
    .feature('modules/dynamic-ui')
    .feature('modules/processengine')
    .feature('modules/authentication')
    .feature('modules/consumer-client', tokenRepository)
    .feature('resources')
    .plugin('aurelia-bootstrap');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
