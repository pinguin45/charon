import { Router, RouterConfiguration } from 'aurelia-router';
import { Client, NodeAdapter, Scheduler } from 'faye';

export class App {

  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router): void {
    console.log(Client);
    this.router = router;
    config.title = 'Aurelia';
    config.map([
      {
        route: ['', 'processlist', 'processlist/:page'],
        title: 'Process Liste',
        name: 'processlist',
        moduleId: 'modules/processlist/processlist',
        nav: true,
      },
      {
        route: 'processdetail/:processId',
        title: 'Process Details',
        name: 'processdetail',
        moduleId: 'modules/processdetail/processdetail',
      },
    ]);
  }
}
