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
        route: ['task'],
        title: 'Task List',
        name: 'task-list',
        moduleId: 'modules/task-list/task-list',
        nav: true,
      },
      {
        route: ['task/:userTaskId'],
        title: 'Tasks Detail',
        name: 'task-detail',
        moduleId: 'modules/task-detail/task-detail',
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
    ]);
  }
}
