import * as path from 'path';
import {browser} from 'protractor';

describe('processDefList', () => {

  const defaultTimeout: number = 5000;
  const aureliaUrl: string = 'http://localhost:9000';

  browser.driver.manage().deleteAllCookies();
  browser.get(aureliaUrl);

  it('should work', () => {
    expect(browser.getCurrentUrl()) .toContain('localhost');
  });

});
