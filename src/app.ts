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
        route: 'dynamicuiwrapper',
        title: 'Dynamic UI Wrapper',
        name: 'dynamic-ui-wrapper',
        moduleId: 'modules/dynamic-ui-wrapper/dynamic-ui-wrapper',
        nav: true,
      },
    ]);
  }
}
