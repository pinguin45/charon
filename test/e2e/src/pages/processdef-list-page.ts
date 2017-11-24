import {by, element, ElementArrayFinder, ElementFinder} from 'protractor';

export class ProcessDefListPage {
  public processDefs: ElementArrayFinder = element.all(by.id('processDef'));
}
