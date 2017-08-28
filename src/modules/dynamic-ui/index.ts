import {FrameworkConfiguration} from 'aurelia-framework';
import {DynamicUiService} from './dynamic-ui.service';

export function configure(config: FrameworkConfiguration): void {
  config.container.registerSingleton('DynamicUiService', DynamicUiService);
}
