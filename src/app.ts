import {Router, RouterConfiguration} from 'aurelia-router';

export class App {

  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Aurelia';
    config.map([
      {
        route: ['', 'processlist', 'processlist/:page'],
        title: 'Process list',
        name: 'processlist',
        moduleId: 'modules/processlist/processlist',
        nav: true,
      },
      {
        route: ['task'],
        title: 'Task list',
        name: 'task-list',
        moduleId: 'modules/task-list/task-list',
        nav: true,
      },
      {
        route: ['task/:userTaskId'],
        title: 'Task details',
        name: 'task-detail',
        moduleId: 'modules/task-detail/task-detail',
      },
      {
        route: 'processdetail/:processId',
        title: 'Process details',
        name: 'processdetail',
        moduleId: 'modules/processdetail/processdetail',
      },
      {
        route: 'start/:processId',
        title: 'Start process',
        name: 'processstart',
        moduleId: 'modules/processstart/processstart',
      },
      {
        route: 'processinstances/:processId',
        title: 'Process instances',
        name: 'processinstances',
        moduleId: 'modules/processinstances/processinstances',
      },
      {
        route: 'instances',
        title: 'Instances',
        name: 'instances',
        moduleId: 'modules/instanceslist/instanceslist',
        nav: true,
      },
    ]);
  }
}
