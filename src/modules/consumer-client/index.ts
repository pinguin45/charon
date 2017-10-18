import {ConsumerClient} from '@process-engine/consumer_client';
import {FrameworkConfiguration} from 'aurelia-framework';

export async function configure(config: FrameworkConfiguration): Promise<void> {

  const consumerClient = new ConsumerClient();
  consumerClient.config = config;
  await consumerClient.initialize();

  config.container.registerInstance('ConsumerClient', consumerClient);
}
