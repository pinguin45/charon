import {FrameworkConfiguration} from 'aurelia-framework';
import {SocketioService} from './socketio.service';

export function configure(config: FrameworkConfiguration): void {
  config.container.registerSingleton('SocketioService', SocketioService);
}
