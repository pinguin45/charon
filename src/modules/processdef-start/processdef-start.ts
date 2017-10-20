import {IUserTaskConfig} from '@process-engine/consumer_client';
import {IProcessDefEntity} from '@process-engine/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthenticationStateEvent, IProcessEngineService} from '../../contracts/index';
import {DynamicUiWrapper} from '../dynamic-ui-wrapper/dynamic-ui-wrapper';

@inject('ProcessEngineService', EventAggregator, Router)
export class ProcessDefStart {

  private processEngineService: IProcessEngineService;
  private eventAggregator: EventAggregator;
  private dynamicUiWrapper: DynamicUiWrapper;
  private subscriptions: Array<Subscription>;
  private processDefId: string;
  private _process: IProcessDefEntity;
  private router: Router;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator, router: Router) {
    this.processEngineService = processEngineService;
    this.eventAggregator = eventAggregator;
    this.router = router;
  }

  private activate(routeParameters: {processDefId: string}): void {
    this.processDefId = routeParameters.processDefId;
    this.refreshProcess();
  }

  public attached(): void {
    this.subscriptions = [
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGIN, () => {
        this.refreshProcess();
      }),
      this.eventAggregator.subscribe(AuthenticationStateEvent.LOGOUT, () => {
        this.refreshProcess();
      }),
      this.eventAggregator.subscribe('render-dynamic-ui', (message: IUserTaskConfig) => {
        this.dynamicUiWrapper.currentConfig = message;
      }),
      this.eventAggregator.subscribe('closed-process', (message: any) => {
        this.router.navigateToRoute('processdef-list', { page: 1 });
      }),
    ];
  }

  public detached(): void {
    for (const subscription of this.subscriptions) {
      subscription.dispose();
    }
  }

  private async refreshProcess(): Promise<void> {
    try {
      this._process = await this.processEngineService.getProcessDefById(this.processDefId);
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
