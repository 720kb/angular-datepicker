/*global angular navigator*/

(function withAngular(angular) {

  'use strict';

  angular.module('720kb.datepicker', [])
		.directive('datepicker', ['$window', '$compile', '$locale', '$filter', '$interpolate', function manageDirective($window, $compile, $locale, $filter, $interpolate) {

    var A_DAY_IN_MILLISECONDS = 86400000;
    return {
      'restrict': 'AEC',
      'scope': {
        'dateSet': '@',
        'dateMinLimit': '@',
        'dateMaxLimit': '@',
        'dateMonthTitle': '@',
        'dateYearTitle': '@',
        'buttonNextTitle': '@',
        'buttonPrevTitle': '@'
      },
      'link': function linkingFunction($scope, element, attr) {
        //get child input
        $scope.dateMonthTitle = $scope.dateMonthTitle || 'Select month';
        $scope.dateYearTitle = $scope.dateYearTitle || 'Select year';
        $scope.buttonNextTitle = $scope.buttonNextTitle || 'Next';
        $scope.buttonPrevTitle = $scope.buttonPrevTitle || 'Prev';

        var selector = attr.selector
          , thisInput = angular.element(selector ? element[0].querySelector('.' + selector) : element[0].children[0])
          , theCalendar
          , defaultPrevButton = '<b class="datepicker-default-button">&lang;</b>'
          , defaultNextButton = '<b class="datepicker-default-button">&rang;</b>'
          , prevButton = attr.buttonPrev || defaultPrevButton
          , nextButton = attr.buttonNext || defaultNextButton
          , dateFormat = attr.dateFormat
          , dateMinLimit
          , dateMaxLimit
          , date = new Date()
          , isMouseOn = false
          , isMouseOnInput = false
          , datetime = $locale.DATETIME_FORMATS
          , pageDatepickers
          , htmlTemplate = '<div class="_720kb-datepicker-calendar" ng-blur="hideCalendar()">' +
          //month+year header
          '<div class="_720kb-datepicker-calendar-header" ng-hide="isMobile()">' +
          '<div class="_720kb-datepicker-calendar-header-left">' +
          '<a href="javascript:void(0)" ng-click="prevMonth()" title="{{buttonPrevTitle}}">' + prevButton + '</a>' +
          '</div>' +
          '<div class="_720kb-datepicker-calendar-header-middle _720kb-datepicker-calendar-month">' +
          '{{month}} <a href="javascript:void(0)" ng-click="showYearsPagination = !showYearsPagination"><span>{{year}} <i ng-if="!showYearsPagination">&dtrif;</i> <i ng-if="showYearsPagination">&urtri;</i> </span> </a>' +
          '</div>' +
          '<div class="_720kb-datepicker-calendar-header-right">' +
          '<a href="javascript:void(0)" ng-click="nextMonth()" title="{{buttonNextTitle}}">' + nextButton + '</a>' +
          '</div>' +
          '</div>' +
          //Mobile month+year pagination
          '<div class="_720kb-datepicker-calendar-header" ng-show="isMobile()">' +
          '<div class="_720kb-datepicker-calendar-header-middle _720kb-datepicker-mobile-item _720kb-datepicker-calendar-month">' +
          '<select ng-model="month" title="{{dateMonthTitle}}" ng-change="selectedMonthHandle(month)">' +
          '<option ng-repeat="item in months" ng-selected="month === item" ng-disabled=\'!isSelectableMaxDate(item + " " + day + ", " + year) || !isSelectableMinDate(item + " " + day + ", " + year)\' ng-value="item">{{item}}</option>' +
          '</select>' +
          '</div>' +
          '</div>' +
          '<div class="_720kb-datepicker-calendar-header" ng-show="isMobile()">' +
          '<div class="_720kb-datepicker-calendar-header-middle _720kb-datepicker-mobile-item _720kb-datepicker-calendar-month">' +
          '<select ng-model="mobileYear" title="{{dateYearTitle}}" ng-change="setNewYear(mobileYear)">' +
          '<option ng-repeat="item in paginationYears" ng-selected="year === item" ng-value="item" ng-disabled="!isSelectableMinYear(item) || !isSelectableMaxYear(item)">{{item}}</option>' +
          '</select>' +
          '</div>' +
          '</div>' +
          //years pagination header
          '<div class="_720kb-datepicker-calendar-header" ng-show="showYearsPagination">' +
          '<div class="_720kb-datepicker-calendar-years-pagination">' +
          '<a ng-class="{\'_720kb-datepicker-active\': y === year, \'_720kb-datepicker-disabled\': !isSelectableMaxYear(y) || !isSelectableMinYear(y)}" href="javascript:void(0)" ng-click="setNewYear(y)" ng-repeat="y in paginationYears">{{y}}</a>' +
          '</div>' +
          '<div class="_720kb-datepicker-calendar-years-pagination-pages">' +
          '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[0])" ng-class="{\'_720kb-datepicker-item-hidden\': paginationYearsPrevDisabled}">' + prevButton + '</a>' +
          '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[paginationYears.length -1 ])" ng-class="{\'_720kb-datepicker-item-hidden\': paginationYearsNextDisabled}">' + nextButton + '</a>' +
          '</div>' +
          '</div>' +
          //days column
          '<div class="_720kb-datepicker-calendar-days-header">' +
          '<div ng-repeat="d in daysInString"> {{d}} </div> ' +
          '</div>' +
          //days
          '<div class="_720kb-datepicker-calendar-body">' +
          '<a href="javascript:void(0)" ng-repeat="px in prevMonthDays" class="_720kb-datepicker-calendar-day _720kb-datepicker-disabled">{{px}}</a>' +
          '<a href="javascript:void(0)" ng-repeat="item in days" ng-click="setDatepickerDay(item)" ng-class="{\'_720kb-datepicker-active\': day === item, \'_720kb-datepicker-disabled\': !isSelectableMinDate(year + \'/\' + monthNumber + \'/\' + item ) || !isSelectableMaxDate(year + \'/\' + monthNumber + \'/\' + item)}" class="_720kb-datepicker-calendar-day">{{item}}</a>' +
          '<a href="javascript:void(0)" ng-repeat="nx in nextMonthDays" class="_720kb-datepicker-calendar-day _720kb-datepicker-disabled">{{nx}}</a>' +
          '</div>' +
          '</div>' +
			'</div>';

        // Respect previously configured interpolation symbols.
        htmlTemplate = htmlTemplate.replace(/{{/g, $interpolate.startSymbol())
            .replace(/}}/g, $interpolate.endSymbol());

        $scope.$watch('dateSet', function dateSetWatcher(value) {

          if (value) {

            date = new Date(value);

            $scope.month = $filter('date')(date, 'MMMM');//December-November like
            $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
            $scope.day = Number($filter('date')(date, 'dd')); //01-31 like
            $scope.year = Number($filter('date')(date, 'yyyy'));//2014 like
						$scope.setDaysInMonth($scope.monthNumber, $scope.year);
            $scope.setInputValue();
          }
        });

        $scope.$watch('dateMinLimit', function dateMinLimitWatcher(value) {
          if (value) {

            dateMinLimit = value;
          }
        });

        $scope.$watch('dateMaxLimit', function dateMaxLimitWatcher(value) {
          if (value) {

            dateMaxLimit = value;
          }
        });

        $scope.month = $filter('date')(date, 'MMMM');//December-November like
        $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
        $scope.day = Number($filter('date')(date, 'dd')); //01-31 like
         if ($scope.dateMaxLimit) {
            $scope.year = Number($filter('date')(new Date($scope.dateMaxLimit), 'yyyy'));//2014 like
         } else {
            $scope.year = Number($filter('date')(date, 'yyyy'));//2014 like
         }
        $scope.months = datetime.MONTH;
        $scope.daysInString = ['0', '1', '2', '3', '4', '5', '6'].map(function mappingFunc(el) {

          return $filter('date')(new Date(new Date('06/08/2014').valueOf() + A_DAY_IN_MILLISECONDS * el), 'EEE');
        });

        //create the calendar holder
        thisInput.after($compile(angular.element(htmlTemplate))($scope));

        //get the calendar as element
        theCalendar = element[0].querySelector('._720kb-datepicker-calendar');
        //some tricky dirty events to fire if click is outside of the calendar and show/hide calendar when needed
        thisInput.bind('focus click', function onFocusAndClick() {

          isMouseOnInput = true;

          $scope.showCalendar();
        });

        thisInput.bind('focusout blur', function onBlurAndFocusOut() {

          isMouseOnInput = false;
        });

        angular.element(theCalendar).bind('mouseenter', function onMouseEnter() {

          isMouseOn = true;
        });

        angular.element(theCalendar).bind('mouseleave', function onMouseLeave() {

          isMouseOn = false;
        });

        angular.element(theCalendar).bind('focusin', function onCalendarFocus() {

          isMouseOn = true;
        });

        angular.element($window).bind('click focus', function onClickOnWindow() {

          if (!isMouseOn &&
            !isMouseOnInput && theCalendar) {

            $scope.hideCalendar();
          }
        });

        $scope.isMobile = function isMobile() {

          if (navigator.userAgent && (navigator.userAgent.match(/Android/i)
             || navigator.userAgent.match(/webOS/i)
             || navigator.userAgent.match(/iPhone/i)
             || navigator.userAgent.match(/iPad/i)
             || navigator.userAgent.match(/iPod/i)
             || navigator.userAgent.match(/BlackBerry/i)
             || navigator.userAgent.match(/Windows Phone/i))){

              return true;
          }
        };

        $scope.resetToMinDate = function manageResetToMinDate() {

          $scope.month = $filter('date')(new Date(dateMinLimit), 'MMMM');
          $scope.monthNumber = Number($filter('date')(new Date(dateMinLimit), 'MM'));
          $scope.day = Number($filter('date')(new Date(dateMinLimit), 'dd'));
          $scope.year = Number($filter('date')(new Date(dateMinLimit), 'yyyy'));
        };

        $scope.resetToMaxDate = function manageResetToMaxDate() {

          $scope.month = $filter('date')(new Date(dateMaxLimit), 'MMMM');
          $scope.monthNumber = Number($filter('date')(new Date(dateMaxLimit), 'MM'));
          $scope.day = Number($filter('date')(new Date(dateMaxLimit), 'dd'));
          $scope.year = Number($filter('date')(new Date(dateMaxLimit), 'yyyy'));
        };

        $scope.nextMonth = function manageNextMonth() {

          if ($scope.monthNumber === 12) {

            $scope.monthNumber = 1;
            //its happy new year
            $scope.nextYear();
          } else {

            $scope.monthNumber += 1;
          }
          //set next month
          $scope.month = $filter('date')(new Date($scope.year, $scope.monthNumber - 1), 'MMMM');
          //reinit days
          $scope.setDaysInMonth($scope.monthNumber, $scope.year);

          //check if max date is ok
          if (dateMaxLimit) {
            if (!$scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

              $scope.resetToMaxDate();
            }
          }
          //deactivate selected day
          $scope.day = undefined;
        };

        $scope.selectedMonthHandle = function manageSelectedMonthHandle (selectedMonth) {

          $scope.monthNumber = Number($filter('date')(new Date('01 ' + selectedMonth + ' 2000'), 'MM'));
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
          $scope.month = $filter('date')(new Date($scope.year, $scope.monthNumber - 1), 'MMMM');
          //reinit days
          $scope.setDaysInMonth($scope.monthNumber, $scope.year);
          //check if min date is ok
          if (dateMinLimit) {

            if (!$scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

              $scope.resetToMinDate();
            }
          }
          //deactivate selected day
          $scope.day = undefined;
        };

        $scope.setNewYear = function setNewYear (year) {

          //deactivate selected day
          $scope.day = undefined;

          if (dateMaxLimit && $scope.year < Number(year)) {

            if (!$scope.isSelectableMaxYear(year)) {

              return;
            }
          } else if (dateMinLimit && $scope.year > Number(year)) {

            if (!$scope.isSelectableMinYear(year)) {

              return;
            }
          }

          $scope.year = Number(year);
          $scope.setDaysInMonth($scope.monthNumber, $scope.year);
          $scope.paginateYears(year);
        };

        $scope.nextYear = function manageNextYear() {

          $scope.year = Number($scope.year) + 1;
        };

        $scope.prevYear = function managePrevYear() {

          $scope.year = Number($scope.year) - 1;
        };

        $scope.setInputValue = function manageInputValue() {

          if ($scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)
              && $scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

            var modelDate = new Date($scope.year + '/' + $scope.monthNumber + '/' + $scope.day);

            if (attr.dateFormat) {

              thisInput.val($filter('date')(modelDate, dateFormat));
            } else {

              thisInput.val(modelDate);
            }

            thisInput.triggerHandler('input');
            thisInput.triggerHandler('change');//just to be sure;
          } else {

            return false;
          }
        };

        $scope.classHelper = {
            'add': function add(ele, klass){
                if (ele.className.indexOf(klass) > -1){
                    return;
                }
                var classes = ele.className.split(' ');
                classes.push(klass);
                ele.className = classes.join(' ');
            },
            'remove': function remove(ele, klass){
                var i, classes;
                if (ele.className.indexOf(klass) === -1){
                  return;
                }
                classes = ele.className.split(' ');
                for (i = 0; i < classes.length; i += 1){
                  if (classes[i] === klass){
                        classes = classes.slice(0, i).concat(classes.slice(i + 1));
                        break;
                  }
                }
                ele.className = classes.join(' ');
            }
        };

        $scope.showCalendar = function manageShowCalendar() {
          //lets hide all the latest instances of datepicker
          pageDatepickers = $window.document.getElementsByClassName('_720kb-datepicker-calendar');

          angular.forEach(pageDatepickers, function forEachDatepickerPages(value, key) {
            if (pageDatepickers[key].classList) {
              pageDatepickers[key].classList.remove('_720kb-datepicker-open');
            } else {
              $scope.classHelper.remove(pageDatepickers[key], '_720kb-datepicker-open');
            }
          });

          if (theCalendar.classList) {
            theCalendar.classList.add('_720kb-datepicker-open');
          } else {
            $scope.classHelper.add(theCalendar, '_720kb-datepicker-open');
          }
        };

        $scope.hideCalendar = function manageHideCalendar() {
          if (theCalendar.classList){
            theCalendar.classList.remove('_720kb-datepicker-open');
          } else {
            $scope.classHelper.remove(theCalendar, '_720kb-datepicker-open');
          }
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

            howManyNextDays = 6 - lastDayMonthNumber;
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

           var i
              , theNewYears = []
              , daysToPrepend = 10, daysToAppend = 10;

           if ($scope.isMobile()) {
              daysToPrepend = 50;
              daysToAppend = 50;
              if ( $scope.dateMinLimit && $scope.dateMaxLimit) {
                 startingYear = new Date($scope.dateMaxLimit).getFullYear();
                 daysToPrepend = startingYear - new Date($scope.dateMinLimit).getFullYear();
                 daysToAppend = 1;
              }
           }

           for (i = daysToPrepend; i > 0; i -= 1) {

              theNewYears.push(Number(startingYear) - i);
           }

           for (i = 0; i < daysToAppend; i += 1) {

              theNewYears.push(Number(startingYear) + i);
           }

          //check range dates
          if (dateMaxLimit && theNewYears && theNewYears.length && !$scope.isSelectableMaxYear(Number(theNewYears[theNewYears.length - 1]) + 1)) {

            $scope.paginationYearsNextDisabled = true;
          } else {

            $scope.paginationYearsNextDisabled = false;
          }

          if (dateMinLimit && theNewYears && theNewYears.length && !$scope.isSelectableMinYear(Number(theNewYears[0]) - 1)) {

            $scope.paginationYearsPrevDisabled = true;
          } else {

            $scope.paginationYearsPrevDisabled = false;
          }

          $scope.paginationYears = theNewYears;
        };

        $scope.isSelectableMinDate = function isSelectableMinDate (aDate) {
          //if current date
          if (!!dateMinLimit &&
             !!new Date(dateMinLimit) &&
             new Date(aDate).getTime() < new Date(dateMinLimit).getTime()) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMaxDate = function isSelectableMaxDate (aDate) {

          //if current date
          if (!!dateMaxLimit &&
             !!new Date(dateMaxLimit) &&
             new Date(aDate).getTime() > new Date(dateMaxLimit).getTime()) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMaxYear = function isSelectableMaxYear (year) {

          if (!!dateMaxLimit &&
            year > new Date(dateMaxLimit).getFullYear()) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMinYear = function isSelectableMinYear (year) {

          if (!!dateMinLimit &&
            year < new Date(dateMinLimit).getFullYear()) {

            return false;
          }

          return true;
        };

        //check always if given range of dates is ok
        if (dateMinLimit && !$scope.isSelectableMinYear($scope.year)) {

          $scope.resetToMinDate();
        }

        if (dateMaxLimit && !$scope.isSelectableMaxYear($scope.year)) {

          $scope.resetToMaxDate();
        }

        $scope.paginateYears($scope.year);
        $scope.setDaysInMonth($scope.monthNumber, $scope.year);
      }
    };
  }]);
}(angular));
