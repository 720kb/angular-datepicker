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
          , defaultPrevButton = 'Prev'
          , defaultNextButton = 'Next'
          , prevButton = attr.buttonPrev || defaultPrevButton
          , nextButton = attr.buttonNext || defaultNextButton
          , dateFormat = attr.dateFormat || 'mediumDate'
          , date = new Date()
          , mouseLeaveTimer
          , datetime = $locale.DATETIME_FORMATS
          , htmlTemplate = '<div class="datepicker-calendar">' +
          //motnh+year header
          '<div class="datepicker-calendar-header">' +
          '<div class="datepicker-calendar-header-left">' +
          '<a href="javascript:void(0)" ng-click="prevMonth()">' + prevButton + '</a>' +
          '</div>' +
          '<div class="datepicker-calendar-header-middle datepicker-calendar-month">' +
          '{{month}} <a href="javascript:void(0)" ng-click="showYearsPagination = !showYearsPagination"><span>{{year}} &dtrif;</span> </a>' +
          '</div>' +
          '<div class="datepicker-calendar-header-right">' +
          '<a href="javascript:void(0)" ng-click="nextMonth()">' + nextButton + '</a>' +
          '</div>' +
          '</div>' +
          //years pagination header
          '<div class="datepicker-calendar-header" ng-show="showYearsPagination">' +
          '<div class="datepicker-calendar-header-left">' +
          '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[0])">' + prevButton + '</a>' +
          '</div>' +
          '<div class="datepicker-calendar-header-middle datepicker-calendar-years-pagination">' +
          '<a ng-class="{\'datepicker-active\': y === year}" href="javascript:void(0)" ng-click="setNewYear(y)" ng-repeat="y in paginationYears">{{y}}</a>' +
          '</div>' +
          '<div class="datepicker-calendar-header-right">' +
          '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[paginationYears.length -1 ])">' + nextButton + '</a>' +
          '</div>' +
          '</div>' +
          //days
          '<div class="datepicker-calendar-body">' +
          '<a ng-repeat="item in days" ng-click="setDatepickerDay(item)" ng-class="{\'datepicker-active\': day === item}" class="datepicker-calendar-day">{{item}}</a>' +
          '</div>' +
          '</div>' +
          '</div>';

        $scope.month = $filter('date')(date, 'MMMM');//December-November like
        $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
        $scope.day = Number($filter('date')(date, 'dd')); //01-31 like
        $scope.year = $filter('date')(date,'yyyy');//2014 like
        $scope.months = datetime.MONTH;

        //create the calendar holder
        thisInput.after($compile(angular.element(htmlTemplate))($scope));

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

        $scope.setNewYear = function setNewYear (year) {

          $scope.year = Number(year);
          $scope.paginateYears(year);
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

          thisInput.val($filter('date')(new Date($scope.year + ' ' + $scope.month + ' ' + $scope.day ), dateFormat))
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

          $scope.day = Number(day);
          $scope.setInputValue();
          $scope.hideCalendar();
        };

        $scope.paginateYears = function paginateYears (startingYear) {
          
          $scope.paginationYears = [Number(startingYear)];

          $scope.paginationYears.splice(0,-2, $scope.paginationYears[0]++, $scope.paginationYears[0]++);
          $scope.paginationYears.splice(0,-2, $scope.paginationYears[0]--, $scope.paginationYears[0]--);
          $scope.paginationYears.sort();
        };

        $scope.paginateYears($scope.year);
        $scope.setDaysInMonth($scope.monthNumber, $scope.year);
      }
    };
  }]);
}(angular));
