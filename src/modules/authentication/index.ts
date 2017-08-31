import {FrameworkConfiguration} from 'aurelia-framework';
import {AuthenticationRepository} from './authentication.repository';
import {AuthenticationService} from './authentication.service';

export function configure(config: FrameworkConfiguration): void {
  config.container.registerSingleton('AuthenticationRepository', AuthenticationRepository);
  config.container.registerSingleton('AuthenticationService', AuthenticationService);
}
