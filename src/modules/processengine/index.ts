import {FrameworkConfiguration} from 'aurelia-framework';
import {ProcessEngineRepository} from './processengine.repository';
import {ProcessEngineService} from './processengine.service';

export function configure(config: FrameworkConfiguration) {
    config.container.registerSingleton('ProcessEngineRepository', ProcessEngineRepository);
    config.container.registerSingleton('ProcessEngineService', ProcessEngineService);
}
