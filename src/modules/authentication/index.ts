import {FrameworkConfiguration} from 'aurelia-framework';
import {AuthenticationRepository} from './authentication.repository';
import {AuthenticationService} from './authentication.service';

export async function configure(config: FrameworkConfiguration): Promise<void> {
  config.container.registerSingleton('AuthenticationRepository', AuthenticationRepository);
  config.container.registerSingleton('AuthenticationService', AuthenticationService);
  await config.container.get('AuthenticationService').initialize();
}
