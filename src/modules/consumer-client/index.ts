import {ConsumerClient, ITokenRepository} from '@process-engine/consumer_client';
import {FrameworkConfiguration} from 'aurelia-framework';

export async function configure(config: FrameworkConfiguration, tokenRepository: ITokenRepository): Promise<void> {

  const consumerClient: ConsumerClient = new ConsumerClient();
  consumerClient.config = config;
  await consumerClient.initialize(tokenRepository);

  config.container.registerInstance('ConsumerClient', consumerClient);
}
