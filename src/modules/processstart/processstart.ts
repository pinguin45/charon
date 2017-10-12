import {IProcessDefEntity} from '@process-engine/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthenticationStateEvent, IProcessEngineService, IWidget} from '../../contracts/index';
import {DynamicUiWrapper} from '../dynamic-ui-wrapper/dynamic-ui-wrapper';

@inject('ProcessEngineService', EventAggregator, Router)
export class ProcessStart {

  private processEngineService: IProcessEngineService;
  private eventAggregator: EventAggregator;
  private dynamicUiWrapper: DynamicUiWrapper;
  private subscriptions: Array<Subscription>;
  private processId: string;
  private _process: IProcessDefEntity;
  private router: Router;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator, router: Router) {
    this.processEngineService = processEngineService;
    this.eventAggregator = eventAggregator;
    this.router = router;
  }

  private activate(routeParameters: {processId: string}): void {
    this.processId = routeParameters.processId;
    this.refreshProcess();
  }

  public attached(): void {
    this.subscriptions = [
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGIN, this.refreshProcess.bind(this)),
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGOUT, this.refreshProcess.bind(this)),
      this.eventAggregator.subscribe('render-dynamic-ui', (message: IWidget) => {
        this.dynamicUiWrapper.currentWidget = message;
      }),
      this.eventAggregator.subscribe('closed-process', (message: any) => {
        this.router.navigateToRoute('processlist', { page: 1 });
      }),
    ];
  }

  public detached(): void {
    this.subscriptions.forEach((subscription: Subscription): void => {
      subscription.dispose();
    });
  }

  private async refreshProcess(): Promise<void> {
    try {
      this._process = await this.processEngineService.getProcessbyID(this.processId);
      this.startProcess();
    } catch (error) {
      console.error('failed to refresh process');
      throw error;
    }
  }

  @computedFrom('_process')
  public get process(): IProcessDefEntity {
    return this._process;
  }

  public startProcess(): void {
    this.processEngineService.startProcess(this.process);
  }
}
