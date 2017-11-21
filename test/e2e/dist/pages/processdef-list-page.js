"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var ProcessDefListPage = (function () {
    function ProcessDefListPage() {
        this.processDefs = protractor_1.element.all(protractor_1.by.id('processDef'));
    }
    return ProcessDefListPage;
}());
exports.ProcessDefListPage = ProcessDefListPage;
