/*global angular*/

(function withAngular(angular) {

  'use strict';

  angular.module('720kb.datepicker', [])
  .directive('datepicker',['$window', '$compile', '$locale', '$filter', function manageDirective($window, $compile, $locale, $filter) {

    var A_DAY_IN_MILLISECONDS = 86400000;
    return {
      'restrict': 'E',
      'scope': {
        'dateSet': '@'
      },
      'link': function linkingFunction($scope, element, attr) {
        //get child input
        var thisInput = angular.element(element[0].children[0])
          , theCalendar
          , defaultPrevButton = '<b class="datepicker-default-button">&lang;</b>'
          , defaultNextButton = '<b class="datepicker-default-button">&rang;</b>'
          , prevButton = attr.buttonPrev || defaultPrevButton
          , nextButton = attr.buttonNext || defaultNextButton
          , dateFormat = attr.dateFormat || 'mediumDate'
          , dateMinLimit = attr.dateMinLimit || undefined
          , dateMaxLimit = attr.dateMaxLimit || undefined
          , date = new Date()
          , isMouseOn = false
          , isMouseOnInput = false
          , datetime = $locale.DATETIME_FORMATS
          , htmlTemplate = '<div class="datepicker-calendar" tabindex="0" ng-blur="hideCalendar()">' +
          //motnh+year header
          '<div class="datepicker-calendar-header">' +
          '<div class="datepicker-calendar-header-left">' +
          '<a href="javascript:void(0)" ng-click="prevMonth()" ng-class="{hidden: !isPrevMonth}">' + prevButton + '</a>' +
          '</div>' +
          '<div class="datepicker-calendar-header-middle datepicker-calendar-month">' +
          '{{month}} <a href="javascript:void(0)" ng-click="showYearsPagination = !showYearsPagination"><span>{{year}} <i ng-if="!showYearsPagination">&dtrif;</i> <i ng-if="showYearsPagination">&urtri;</i> </span> </a>' +
          '</div>' +
          '<div class="datepicker-calendar-header-right">' +
          '<a href="javascript:void(0)" ng-click="nextMonth()" ng-class="{hidden: !isNextMonth}">' + nextButton + '</a>' +
          '</div>' +
          '</div>' +
          //years pagination header
          '<div class="datepicker-calendar-header" ng-show="showYearsPagination">' +
          '<div class="datepicker-calendar-years-pagination">' +
          '<a ng-class="{\'datepicker-active\': y === year, \'datepicker-disabled\': !isSelectableMaxYear(y) || !isSelectableMinYear(y)}" href="javascript:void(0)" ng-click="setNewYear(y)" ng-repeat="y in paginationYears">{{y}}</a>' +
          '</div>' +
          '<div class="datepicker-calendar-years-pagination-pages">' +
          '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[0])" ng-class="{hidden: !isPrevYear}">' + prevButton + '</a>' +
          '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[paginationYears.length -1 ])" ng-class="{hidden: !isNextYear}">' + nextButton + '</a>' +
          '</div>' +
          '</div>' +
          //days column
          '<div class="datepicker-calendar-days-header">' +
          '<div ng-repeat="d in daysInString"> {{d}} </div> ' +
          '</div>' +
          //days
          '<div class="datepicker-calendar-body">' +
          '<a ng-repeat="px in prevMonthDays" class="datepicker-calendar-day datepicker-disabled">{{px}}</a>' +
          '<a ng-repeat="item in days" ng-click="setDatepickerDay(item)" ng-class="{\'datepicker-active\': day === item, \'datepicker-disabled\': !isSelectableMinDate(year + \'/\' + monthNumber + \'/\' + item ) || !isSelectableMaxDate(year + \'/\' + monthNumber + \'/\' + item)}" class="datepicker-calendar-day">{{item}}</a>' +
          '<a ng-repeat="nx in nextMonthDays" class="datepicker-calendar-day datepicker-disabled">{{nx}}</a>' +
          '</div>' +
          '</div>' +
          '</div>';

        $scope.$watch('dateSet', function(value) {
          if (value) {
            date = new Date(value);
            $scope.month = $filter('date')(date, 'MMMM');//December-November like
            $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
            $scope.day = Number($filter('date')(date, 'dd')); //01-31 like
            $scope.year = Number($filter('date')(date,'yyyy'));//2014 like
          }
        });

        // If max date is before today or min date is after today, start there
        if ( !!dateMaxLimit && new Date(dateMaxLimit) && new Date(dateMaxLimit) < date ) {
          date = new Date(dateMaxLimit);
        } else if ( !!dateMinLimit && new Date(dateMinLimit) && new Date(dateMinLimit) > date ) {
          date = new Date(dateMinLimit);
        }

        $scope.month = $filter('date')(date, 'MMMM');//December-November like
        $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
        $scope.day = Number($filter('date')(date, 'dd')); //01-31 like
        $scope.year = Number($filter('date')(date,'yyyy'));//2014 like
        $scope.months = datetime.MONTH;
        $scope.daysInString = ['0','1','2','3','4','5','6'].map(function mappingFunc(el) {

          return $filter('date')(new Date(new Date('06/08/2014').valueOf() + A_DAY_IN_MILLISECONDS * el), 'EEE');
        });

        //create the calendar holder
        thisInput.after($compile(angular.element(htmlTemplate))($scope));

        //get the calendar as element
        theCalendar = element[0].children[1];
        //some tricky dirty events to fire if click is outside of the calendar and show/hide calendar when needed
        thisInput.bind('focus click', function onFocusAndClick() {

          isMouseOnInput = true;
          $scope.showCalendar();
        });

        thisInput.bind('blur focusout', function onBlurAndFocusOut() {

          isMouseOnInput = false;
        });

        angular.element(theCalendar).bind('mouseenter', function onMouseEnter() {

          isMouseOn = true;
        });

        angular.element(theCalendar).bind('mouseleave', function onMouseLeave() {

          isMouseOn = false;
        });

        angular.element($window).bind('click', function onClickOnWindow() {

          if (!isMouseOn &&
            !isMouseOnInput) {

            $scope.hideCalendar();
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
          $scope.checkNextPrevMonth();
        };

        $scope.setNewYear = function setNewYear (year) {

          $scope.year = Number(year);
          $scope.setDaysInMonth($scope.monthNumber, $scope.year);
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
          $scope.checkNextPrevMonth();
        };

        $scope.checkNextPrevMonth = function manageNextPrevMonth() {
          if (!!dateMaxLimit  && !!new Date(dateMaxLimit)) {
            if (new Date($scope.year, $scope.monthNumber, 0) < new Date(dateMaxLimit)) {
              $scope.isNextMonth = true;
            } else {
              $scope.isNextMonth = false;
            }
          }

          if (!!dateMaxLimit  && !!new Date(dateMaxLimit)) {
            if (new Date($scope.year, $scope.monthNumber, 1) <= new Date(dateMinLimit)) {
              $scope.isPrevMonth = true;
            } else {
              $scope.isPrevMonth = false;
            }
          }
        }; // checkNextPrevMonth

        $scope.nextYear = function manageNextYear() {

          $scope.year = Number($scope.year) + 1;
          $scope.setInputValue();
        };

        $scope.prevYear = function managePrevYear() {

          $scope.year = Number($scope.year) - 1;
          $scope.setInputValue();
        };

        $scope.setInputValue = function manageInputValue() {

          if ($scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)
              && $scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

            thisInput.val($filter('date')(new Date($scope.year + '/' + $scope.monthNumber + '/' + $scope.day), dateFormat))
            .triggerHandler('input').triggerHandler('change');//just to be sure;
          } else {

            return false;
          }
        };

        $scope.showCalendar = function manageShowCalendar() {

          theCalendar.classList.add('datepicker-open');
        };

        $scope.hideCalendar = function manageHideCalendar() {

          theCalendar.classList.remove('datepicker-open');
        };

        $scope.setDaysInMonth = function setDaysInMonth(month, year) {

          var i
            , limitDate = new Date(year, month, 0).getDate()
            , firstDayMonthNumber = new Date(year + '/' + month + '/' + 1).getDay()
            , lastDayMonthNumber = new Date(year + '/' + month + '/' + limitDate).getDay()
            , prevMonthDays = []
            , nextMonthDays = []
            , howManyNextDays
            , howManyPreviousDays
            , monthAlias;

          $scope.days = [];

          for (i = 1; i <= limitDate; i += 1) {

            $scope.days.push(i);
          }
          //get previous month days is first day in month is not Sunday
          if (firstDayMonthNumber !== 0) {

            howManyPreviousDays = firstDayMonthNumber;

            //get previous month
            if (Number(month) === 1) {

              monthAlias = 12;
            } else {

              monthAlias = month - 1;
            }
            //return previous month days
            for (i = 1; i <= new Date(year, monthAlias, 0).getDate(); i += 1) {

              prevMonthDays.push(i);
            }
            //attach previous month days
            $scope.prevMonthDays = prevMonthDays.slice(-howManyPreviousDays);
          } else {
            //no need for it
            $scope.prevMonthDays = [];
          }

          //get next month days is first day in month is not Sunday
          if (lastDayMonthNumber < 6) {

            howManyNextDays =  6 - lastDayMonthNumber;
            //get previous month

            //return next month days
            for (i = 1; i <= howManyNextDays; i += 1) {

              nextMonthDays.push(i);
            }
            //attach previous month days
            $scope.nextMonthDays = nextMonthDays;
          } else {
            //no need for it
            $scope.nextMonthDays = [];
          }
        };

        $scope.setDatepickerDay = function setDatepickeDay(day) {

          $scope.day = Number(day);
          $scope.setInputValue();
          $scope.hideCalendar();
        };

        $scope.paginateYears = function paginateYears (startingYear) {

          $scope.paginationYears = [];

          var yearsBefore, yearsAfter, i;

          if (!!dateMinLimit  && !!new Date(dateMinLimit)) {
            yearsBefore = Math.min(startingYear - new Date(dateMinLimit).getFullYear(), 10);
          } else {
            yearsBefore = 10;
          }

          if (!!dateMaxLimit  && !!new Date(dateMaxLimit)) {
            yearsAfter = Math.min(new Date(dateMaxLimit).getFullYear() - startingYear, 10);
          } else {
            yearsAfter = 10;
          }

          $scope.isNextYear = Boolean(yearsAfter);
          $scope.isPrevYear = Boolean(yearsBefore);

          for (i = yearsBefore/* Years */; i > 0; i -= 1) {
            $scope.paginationYears.push(startingYear - i);
          }

          $scope.paginationYears.push(startingYear);

          for (i = 1; i < yearsAfter/* Years */; i += 1) {
            $scope.paginationYears.push(startingYear + i);
          }
        };

        $scope.isSelectableMinDate = function isSelectableMinDate (date) {
          //if current date
          if (!!dateMinLimit &&
             !!new Date(dateMinLimit) &&
             (new Date(date).getTime() < new Date(dateMinLimit).getTime())) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMaxDate = function isSelectableMaxDate (date) {

          //if current date
          if (!!dateMaxLimit &&
             !!new Date(dateMaxLimit) &&
             (new Date(date).getTime() > new Date(dateMaxLimit).getTime())) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMaxYear = function isSelectableMaxYear (year) {

          if (!!dateMaxLimit
            && (year > new Date(dateMaxLimit).getFullYear())) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMinYear = function isSelectableMinYear (year) {

          if (!!dateMinLimit
            && (year < new Date(dateMinLimit).getFullYear())) {

            return false;
          }

          return true;
        };

        $scope.paginateYears($scope.year);
        $scope.setDaysInMonth($scope.monthNumber, $scope.year);
        $scope.checkNextPrevMonth();
      }
    };
  }]);
}(angular));
