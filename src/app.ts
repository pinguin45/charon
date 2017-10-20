import {Router, RouterConfiguration} from 'aurelia-router';

export class App {

  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Charon';
    config.map([
      {
        route: ['', 'processdef', 'processdef/:page'],
        title: 'ProcessDef List',
        name: 'processdef-list',
        moduleId: 'modules/processdef-list/processdef-list',
        nav: true,
      },
      {
        route: ['task', 'task/:page', 'processdef/:processDefId/task', 'processdef/:processDefId/task/:page', 'process/:processId/task'],
        title: 'Task List',
        name: 'task-list',
        moduleId: 'modules/task-list/task-list',
        nav: true,
      },
      {
        route: ['process', 'process/:page', 'processdef/:processDefId/process', 'processdef/:processDefId/process/:page'],
        title: 'Process List',
        name: 'process-list',
        moduleId: 'modules/process-list/process-list',
        nav: true,
      },
      {
        route: ['task/:userTaskId/dynamic-ui'],
        title: 'Task Dynamic UI',
        name: 'task-dynamic-ui',
        moduleId: 'modules/task-dynamic-ui/task-dynamic-ui',
      },
      {
        route: ['processdef/:processDefId/detail'],
        title: 'ProcessDef Detail',
        name: 'processdef-detail',
        moduleId: 'modules/processdef-detail/processdef-detail',
      },
      {
        route: 'processdef/:processDefId/start',
        title: 'ProcessDef Start',
        name: 'processdef-start',
        moduleId: 'modules/processdef-start/processdef-start',
      },
    ]);
  }
}
