"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var processdef_list_page_1 = require("./pages/processdef-list-page");
describe('processDefList', function () {
    var defaultTimeout = 5000;
    var aureliaUrl = 'http://localhost:9000';
    protractor_1.browser.driver.manage().deleteAllCookies();
    protractor_1.browser.get(aureliaUrl);
    it('should display process definitions', function () {
        var processDefListPage = new processdef_list_page_1.ProcessDefListPage();
        protractor_1.browser.sleep(1000);
        expect(processDefListPage.processDefs.count()).toBeGreaterThan(0);
    });
});
