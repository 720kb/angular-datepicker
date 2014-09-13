/*global angular*/

(function withAngular(angular) {
  'use strict';

  angular.module('720kb', [
    'ngRoute',
    '720kb.datepicker',
    'hljs'
  ]).config(['hljsServiceProvider', function configurationFunction(hljsServiceProvider) {

    hljsServiceProvider.setOptions({
      // replace tab with 4 spaces
      'tabReplace': ''
    });
  }]);
}(angular));
