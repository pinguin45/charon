import * as bundle from '@process-engine-js/bpmn-js-custom-bundle';
import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';
import {bindable} from 'aurelia-framework';
import {IChooseDialogOption} from '../../contracts';
import environment from '../../environment';

export class ImportProcessButton {

  private reader: FileReader = new FileReader();
  private model: any;

  @bindable()
  private desiredProcessImportKey: string;
  @bindable()
  private callback: (moddle: any, xml: string) => void;
  @bindable()
  private selectedFiles: FileList;

  private chooseOptions: Array<IChooseDialogOption>;
  private currentImportModdle: any;
  private processes: Array<any>;
  private fileInput: HTMLInputElement;

  constructor() {
    this.model = new bundle.moddle({
      camunda: bundle.camundaModdleDescriptor,
    });
    this.reader.onload = (x: any): void => {
      this.onXmlSelected(x.target.result);
    };
  }

  private detached(): void {
    this.cleanup();
  }

  private onXmlSelected(xml: string): void {
    const reader: bundle.moddleXml.Reader = new bundle.moddleXml.Reader(this.model);
    const rootHandler: any = reader.handler('bpmn:Definitions');

    reader.fromXML(xml, rootHandler, (err: Error, bpmn: any, context: any) => {

      if (err) {
        alert(`Datei konnte nicht importiert werden: ${err}`);
      } else {
        if (context.warnings.length) {
          alert(`Es gab Warnungen beim importieren: ${JSON.stringify(context.warnings)}.`);
        }

        this.currentImportModdle = bpmn;
        this.processes = this.getDefinedProcessesInModdle();

        if (this.processes.length === 0) {
          alert('Es wurden keine Prozesse im Diagram gefunden.');
          this.abortImport();
        } else if (this.processes.length === 1) {
          this.onProcessModdleSelected(this.processes[0]);
        } else {
          this.chooseOptions = [];
          for (const process of this.processes) {
            this.chooseOptions.push({
              title: `${process.name} (${process.id})`,
              value: process,
            });
          }
        }
      }
    });
  }

  private getDefinedProcessesInModdle(): Array<any> {
    const processes: Array<any> = [];

    for (const rootElement of this.currentImportModdle.rootElements) {
      if (rootElement.$type === 'bpmn:Process') {
        processes.push(rootElement);
      }
    }

    return processes;
  }

  /**
   * Renames the given moddle of a process to fit the process.
   */
  private renameProcessModdle(targetProcess: any): void {
    targetProcess.id = this.desiredProcessImportKey;

    let duplicates: number = 0;
    for (const process of this.processes) {
      if (process !== targetProcess && targetProcess.id === process.id) {
        process.id = `${process.id}-${duplicates}`;
        duplicates++;
      }
    }
  }

  public selectedFilesChanged(): void {
    if (this.selectedFiles !== null && this.selectedFiles.length > 0) {
      this.reader.readAsText(this.selectedFiles[0]);
    }
  }

  public onProcessModdleSelected(processModdle: any): void {
    this.renameProcessModdle(processModdle);
    this.finishImport();
  }

  private cleanup(): void {
    this.chooseOptions = null;
    this.currentImportModdle = null;
    this.selectedFiles = null;
    this.processes = null;
    this.fileInput.value = null;
  }

  private finishImport(): void {
    const writer: any = new bundle.moddleXml.Writer({});
    const xml: string = writer.toXML(this.currentImportModdle);
    if (this.callback) {
      this.callback(this.currentImportModdle, xml);
    }
    this.cleanup();
  }

  public abortImport(): void {
    this.cleanup();
  }
}
