/*global angular*/

(function (angular) {
  'use strict';

  angular.module('720kb', [
    'ngRoute',
    '720kb.datepicker',
    'hljs'
  ]).config(['hljsServiceProvider', function (hljsServiceProvider) {

  	hljsServiceProvider.setOptions({
      // replace tab with 4 spaces
      tabReplace: ''
    });
  }]);
}(angular));
