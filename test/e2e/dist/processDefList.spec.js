"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
describe('processDefList', function () {
    var defaultTimeout = 5000;
    var aureliaUrl = 'http://localhost:9000';
    protractor_1.browser.driver.manage().deleteAllCookies();
    protractor_1.browser.get(aureliaUrl);
    it('should work', function () {
        expect(protractor_1.browser.getCurrentUrl()).toContain('localhost');
    });
});
