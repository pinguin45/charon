import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {bindable, computedFrom, inject} from 'aurelia-framework';
import {IProcessEngineService} from '../../contracts';
import environment from '../../environment';
import {BpmnIo} from '../bpmn-io/bpmn-io';

@inject('ProcessEngineService', EventAggregator)
export class Processdetail {
  private test: string = 'DASISTEINTEST';
  private processEngineService: IProcessEngineService;
  private _process: IProcessDefEntity;
  private bpmn: BpmnIo;
  private xmlChangedSubscription: Subscription;
  private eventAggregator: EventAggregator;

  public reader: FileReader = new FileReader();
  @bindable() public uri: string;
  @bindable() public name: string;

  @bindable() public selectedFiles: FileList;

  constructor(processEngineService: IProcessEngineService, eventAggregator: EventAggregator) {
    this.eventAggregator = eventAggregator;
    this.processEngineService = processEngineService;
    this.reader.onload = (x: any): void => {
      this.bpmn.xml = x.target.result;
    };
  }

  public bind(): void {
   this.xmlChangedSubscription = this.eventAggregator.subscribe(environment.events.xmlChanged, () => {
     console.log('message received');
      this.bpmn.getXML().then((xml: any) => {
        this.uri = 'data:application/bpmn20-xml;charset=UTF-8,' + encodeURI(xml);
        this.name = 'xml.xml';
      });
    });
  }

  public unbind(): void {
    this.xmlChangedSubscription.dispose();
  }

  public activate(routeParameters: {processId: string}): void {
    this.processEngineService.getProcessbyID(routeParameters.processId)
      .then((result: IProcessDefEntity) => {
      this._process = result;
    });
  }

  @computedFrom('_process')
  public get process(): IProcessDefEntity {
    return this._process;
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

  public selectedFilesChanged(): void {
    this.reader.readAsText(this.selectedFiles[0]);
  }

  public exportDiagram(): void {
    // this.bpmn.getXML().then((xml: any) => {
    //   this.uri = 'data:application/bpmn20-xml;charset=UTF-8,' + encodeURI(xml);
    //   this.name = 'xml.xml';


    //   console.log(this.uri);

      // ${'#idexport'}.addClass('active').attr({
      //   'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodeURI(xml),
      //   'download': 'xml.xml',
      // });
      // this.reader.readAsDataURL(xml);
    // });
  }

}
