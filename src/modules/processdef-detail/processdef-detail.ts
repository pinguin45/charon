import {IProcessDefEntity} from '@process-engine/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {bindable, computedFrom, inject} from 'aurelia-framework';
import {AuthenticationStateEvent, IChooseDialogOption, IProcessEngineService} from '../../contracts/index';
import environment from '../../environment';
import {BpmnIo} from '../bpmn-io/bpmn-io';

interface RouteParameters {
  processDefId: string;
}

@inject('ProcessEngineService', EventAggregator)
export class ProcessDefDetail {
  private processEngineService: IProcessEngineService;
  private eventAggregator: EventAggregator;
  private subscriptions: Array<Subscription>;
  private processId: string;
  private _process: IProcessDefEntity;
  private bpmn: BpmnIo;
  private exportButton: HTMLButtonElement;
  private exportSpinner: HTMLElement;

  @bindable() public uri: string;
  @bindable() public name: string;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator) {
    this.processEngineService = processEngineService;
    this.eventAggregator = eventAggregator;
  }

  public activate(routeParameters: RouteParameters): void {
    this.processId = routeParameters.processDefId;
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
    ];
  }

  public detached(): void {
    for (const subscription of this.subscriptions) {
      subscription.dispose();
    }
  }

  private refreshProcess(): void {
    this.processEngineService.getProcessDefById(this.processId)
      .then((result: any) => {
        if (result && !result.error) {
          this._process = result;
        } else {
          this._process = null;
        }
    });
  }

  public deleteProcess(): void {
    const deleteForReal: boolean = confirm('Soll der Prozess wirklich gelöscht werden?');
    if (!deleteForReal) {
      return;
    }
    this.processEngineService.deleteProcessDef(this.process.id)
      .then(() => {
        this._process = null;
      })
      .catch((error: Error) => {
        alert(error.message);
      });
  }

  @computedFrom('_process')
  public get process(): IProcessDefEntity {
    return this._process;
  }

  public onModdlelImported(moddle: any, xml: string): void {
    this.bpmn.xml = xml;
  }

  public saveDiagram(): void {
    this.bpmn.getXML().then((xml: string) => {
      return this.processEngineService.updateProcessDef(this.process, xml);
    }).then((response: any) => {
      if (response.error) {
        alert(`Fehler: ${response.error}`);
      } else if (response.result) {
        alert('Gespeichert.');
      } else {
        alert(`Unbekannter Status: ${JSON.stringify(response)}`);
      }
    });
  }

  public exportDiagram(): void {
    this.exportButton.setAttribute('disabled', '');
    this.exportSpinner.classList.remove('hidden');
    this.bpmn.getXML().then((xml: any) => {
      this.uri = 'data:application/bpmn20-xml;charset=UTF-8,' + encodeURI(xml);
      this.name = 'Diagram.xml';
      const atag: HTMLAnchorElement = document.createElement('a');
      atag.setAttribute('href', this.uri);
      atag.setAttribute('id', 'exportxml');
      atag.setAttribute('download', this.name);
      atag.setAttribute('hidden', 'true');
      const appendedATag: HTMLAnchorElement = document.body.appendChild(atag);
      appendedATag.click();
      appendedATag.parentNode.removeChild(appendedATag);
      this.exportButton.removeAttribute('disabled');
      this.exportSpinner.classList.add('hidden');
    });
  }

}
