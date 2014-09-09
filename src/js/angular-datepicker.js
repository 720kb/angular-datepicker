/*global angular*/

(function withAngular(angular) {

  angular.module('720kb.datepicker', [])
  .directive('datepicker',['$window', '$compile', '$locale', '$timeout', '$filter', function manageDirective($window, $compile, $locale, $timeout, $filter) {

    return {
      'restrict': 'E',
      'scope': {},
      'link': function linkingFunction($scope, element, attr) {
        //get child input
        var thisInput = angular.element(element[0].children[0])
          , theCalendar
          //, inputWidth = thisInput[0].offsetWidth
          //, inputOffsetLeft = thisInput[0].offsetLeft
          //, inputOffsetRight = thisInput[0].offsetRight
          //, inputOffsetTop = thisInput[0].offsetTop
          , defaultPrevButton = 'Prev'
          , defaultNextButton = 'Next'
          , prevButton = attr.buttonPrev || defaultPrevButton
          , nextButton = attr.buttonNext || defaultNextButton
          , date = new Date()
          , mouseLeaveTimer
          , datetime = $locale.DATETIME_FORMATS;

        $scope.month = $filter('date')(date, 'MMMM');//December-November like
        $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
        $scope.day = $filter('date')(date, 'dd'); //01-31 like
        $scope.year = $filter('date')(date,'yyyy');//2014 like
        $scope.months = datetime.MONTH;

        //create the calendar holder
        thisInput.after($compile(angular.element('<div class="datepicker-calendar">' +
          //year header
          '<div class="datepicker-calendar-header">' +
          '<div class="datepicker-calendar-header-left">' +
          '<a href="javascript:void(0)" ng-click="prevMonth()">' + prevButton + '</a>' +
          '</div>' +
          '<div class="datepicker-calendar-header-middle datepicker-calendar-month">' +
          '{{month}}' +
          '</div>' +
          '<div class="datepicker-calendar-header-right">' +
          '<a href="javascript:void(0)" ng-click="nextMonth()">' + nextButton + '</a>' +
          '</div>' +
          '</div>' +
          //month header
          '<div class="datepicker-calendar-header">' +
          '<div class="datepicker-calendar-header-left">' +
          '<a href="javascript:void(0)" ng-click="prevYear()">' + prevButton + '</a>' +
          '</div>' +
          '<div class="datepicker-calendar-header-middle">' +
          '{{year}}' +
          '</div>' +
          '<div class="datepicker-calendar-header-right">' +
          '<a href="javascript:void(0)" ng-click="nextYear()">' + nextButton + '</a>' +
          '</div>' +
          '</div>' +
          //days
          '<div class="datepicker-calendar-body">' +
          '<a ng-repeat="item in days" ng-click="setDatepickerDay(item)" ng-class="{\'datepicker-active\': dateDay === item}" class="datepicker-calendar-day">{{item}}</a>' +
          '</div>' +
          '</div>' +
          '</div>'
          ))($scope));

        //get the calendar as element
        theCalendar = element[0].children[1];
        //show  calendar
        thisInput.bind('focus click', function bindingFunction() {

          $scope.showCalendar();
        });

        //calendar mouse leave
        angular.element(theCalendar).bind('mouseleave', function onMouseLeave() {

          mouseLeaveTimer = $timeout(function doAfterTimeout() {

            $scope.hideCalendar();
          },180);
        });

        //calendar mouse leave
        angular.element(theCalendar).bind('mouseover', function onMouseOver() {

          if (mouseLeaveTimer) {

            $timeout.cancel(mouseLeaveTimer);
          }
        });

        $scope.nextMonth = function manageNextMonth() {

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
          $scope.setInputValue();
        };

        $scope.prevMonth = function managePrevMonth() {

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
          $scope.setInputValue();
        };

        $scope.nextYear = function manageNextYear() {

          $scope.year = Number($scope.year) + 1;
          $scope.setInputValue();
        };

        $scope.prevYear = function managePrevYear() {

          $scope.year = Number($scope.year) - 1;
          $scope.setInputValue();
        };

        $scope.setInputValue = function manageInputValue() {

          thisInput.val($filter('date')(new Date($scope.year + ' ' + $scope.month + ' ' + $scope.day )))
          .triggerHandler('input').triggerHandler('change');//just to be sure;
        };

        $scope.showCalendar = function manageShowCalendar() {

          $scope.hideCalendar();
          theCalendar.classList.add('datepicker-open');
        };

        $scope.hideCalendar = function manageHideCalendar() {

          theCalendar.classList.remove('datepicker-open');
        };

        $scope.setDaysInMonth = function setDaysInMonth(month, year) {

          $scope.days = [];

          for (var i = 1, limitDate = new Date(year, month, 0).getDate(); i <= limitDate; i += 1) {

            $scope.days.push(i);
          }
        };

        $scope.setDatepickerDay = function setDatepickeDay(day) {

          $scope.day = day;
          $scope.setInputValue();
          $scope.hideCalendar();
        };

        $scope.setDaysInMonth($scope.monthNumber, $scope.year);
      }
    };
  }]);
}(angular));
