/*global angular*/

(function (window, angular) {
  'use strict';

angular.module('720kb.datepicker', [])
.directive('datepicker',['$window', '$compile', '$locale', '$timeout', '$filter', function ($window, $compile, $locale, $timeout, $filter) {

	return {
		'restrict':'E',
		'scope':{},
		'link':function ($scope, element, attrs) {
			//get child input
			var thisInput = angular.element(element[0].children[0])
				,	theCalendar
				, inputWidth = thisInput[0].offsetWidth
				, inputOffsetLeft = thisInput[0].offsetLeft 
				, inputOffsetRight = thisInput[0].offsetRight 
				, inputOffsetTop = thisInput[0].offsetTop
				, date = new Date() 
				, mouseLeaveTimer
				, datetime = $locale.DATETIME_FORMATS;

			$scope.month = $filter('date')(date, 'MMMM');//December-November like
			$scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
			$scope.day = $filter('date')(date, 'dd'); //01-31 like
			$scope.year = $filter('date')(date,'yyyy');//2014 like
			$scope.months = datetime.MONTH;

			//create the calendar holder
			thisInput.after($compile(angular.element(
				'<div class="datepicker-calendar">'
				//year header
				+'<div class="datepicker-calendar-header">'
				+'<div class="datepicker-calendar-header-left">'
				+'<button ng-click="prevMonth()">prev</button>'
				+'</div>'
				+'<div class="datepicker-calendar-header-middle">'
				+'{{month}}'
				+'</div>'
				+'<div class="datepicker-calendar-header-right">'
				+'<button ng-click="nextMonth()">next</button>'
				+'</div>'
				+'</div>'
				//month header
				+'<div class="datepicker-calendar-header">'
				+'<div class="datepicker-calendar-header-left">'
				+'<button ng-click="prevYear()">prev</button>'
				+'</div>'
				+'<div class="datepicker-calendar-header-middle">'
				+'{{year}}'
				+'</div>'
				+'<div class="datepicker-calendar-header-right">'
				+'<button ng-click="nextYear()">next</button>'
				+'</div>'
				+'</div>'
				//days
				+'<div class="datepicker-calendar-body">'
				+'<a ng-repeat="item in days" ng-click="setDatepickerDay(item)" ng-class="{\'datepicker-active\': dateDay === item}" class="datepicker-calendar-day">{{item}}</a>'
				+'</div>'
				+'</div>'
				+'</div>'
				))($scope));

			//get the calendar as element
			theCalendar = element[0].children[1];
			//show	calendar		
			thisInput.bind('focus click', function () {

				$scope.showCalendar();
			});
			//input should not be changed by hand
			thisInput.bind('keypress keydown keyup', function (e) {

				e.preventDefault();
			});

			//calendar mouse leave
			angular.element(theCalendar).bind('mouseleave', function () {
				
				mouseLeaveTimer = $timeout(function () {

					$scope.hideCalendar();
				},380);
			});

			//calendar mouse leave
			angular.element(theCalendar).bind('mouseover', function () {
				
				if (!!mouseLeaveTimer) {

					$timeout.cancel(mouseLeaveTimer);
				}
			});

			$scope.nextMonth = function () {
				
				if ($scope.monthNumber === 12) {

					$scope.monthNumber = 1;
					//its happy new year
					$scope.nextYear();
				} else {

					$scope.monthNumber += 1;
				}
				//set next month
				$scope.month = $filter('date')(new Date($scope.year + '/' + $scope.monthNumber + '/' + $scope.day), 'MMMM');
				//reinit days
			  $scope.setDaysInMonth($scope.monthNumber, $scope.year);
			};

			$scope.prevMonth = function () {
				
				if ($scope.monthNumber === 1) {

					$scope.monthNumber = 12;
					//its happy new year
					$scope.prevYear();
				} else {

					$scope.monthNumber -= 1;
				}
				//set next month
				$scope.month = $filter('date')(new Date($scope.year + '/' + $scope.monthNumber + '/' + $scope.day), 'MMMM');
				//reinit days
			  $scope.setDaysInMonth($scope.monthNumber, $scope.year);
			};

			$scope.nextYear = function () {
	
				$scope.year = Number($scope.year) + 1; 
			};

			$scope.prevYear = function () {
	
				$scope.year = Number($scope.year) - 1; 
			};

			$scope.setInputValue = function () {
				
				thisInput.val($filter('date')(new Date($scope.year + ' ' + $scope.month + ' ' + $scope.day )))
				.triggerHandler('input').triggerHandler('change')//just to be sure;
			};

			$scope.showCalendar = function () {

				$scope.hideCalendar();
				theCalendar.classList.add('datepicker-open');
			};

			$scope.hideCalendar = function () {

				theCalendar.classList.remove('datepicker-open');
			};

			$scope.setDaysInMonth = function(month, year) {
				
				$scope.days = [];
				
				for (var i = 1; i <= new Date(year, month, 0).getDate(); i ++) {

					$scope.days.push(i);
				};
			};

			$scope.setDatepickerDay = function (day) {

				$scope.day = day; 
				$scope.setInputValue();
				$scope.hideCalendar();
			};

			$scope.setDaysInMonth($scope.monthNumber, $scope.year);
		}
	}
}]);
}(window, angular));