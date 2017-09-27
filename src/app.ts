import {Router, RouterConfiguration} from 'aurelia-router';

export class App {

  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router): void {
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
      {
        route: 'start/:processId',
        title: 'Start Prozess',
        name: 'processstart',
        moduleId: 'modules/processstart/processstart',
      },
      {
        route: ['processinstances', 'processinstances/:page'],
        title: 'Processinstances',
        name: 'processinstances',
        moduleId: 'modules/processinstances/processinstances',
        nav: true,
      },
    ]);
  }
}
