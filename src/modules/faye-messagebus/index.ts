import {FrameworkConfiguration} from 'aurelia-framework';
import {MessageBusService} from './messagebus.service';

export function configure(config: FrameworkConfiguration): void {
  config.container.registerSingleton('MessageBusService', MessageBusService);
}
