import {FrameworkConfiguration} from 'aurelia-framework';
import {NanomsgService} from './nanomsg.service';

export function configure(config: FrameworkConfiguration): void {
  config.container.registerSingleton('NanomsgService', NanomsgService);
}
