import {FrameworkConfiguration} from 'aurelia-framework';
import {ProcessEngineRepository} from './processengine.repository';

export function configure(config: FrameworkConfiguration) {
    config.container.registerSingleton('ProcessEngineRepository', ProcessEngineRepository);
}
