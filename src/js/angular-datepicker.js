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
          , defaultPrevButton = '<b class="datepicker-default-button">&lang;</b>'
          , defaultNextButton = '<b class="datepicker-default-button">&rang;</b>'
          , prevButton = attr.buttonPrev || defaultPrevButton
          , nextButton = attr.buttonNext || defaultNextButton
          , dateFormat = attr.dateFormat || 'mediumDate'
          , date = new Date()
          , isMouseOn = false
          , isMouseOnInput = false
          , datetime = $locale.DATETIME_FORMATS
          , htmlTemplate = '<div class="datepicker-calendar" tabindex="0" ng-blur="hideCalendar()">' +
          //motnh+year header
          '<div class="datepicker-calendar-header">' +
          '<div class="datepicker-calendar-header-left">' +
          '<a href="javascript:void(0)" ng-click="prevMonth()">' + prevButton + '</a>' +
          '</div>' +
          '<div class="datepicker-calendar-header-middle datepicker-calendar-month">' +
          '{{month}} <a href="javascript:void(0)" ng-click="showYearsPagination = !showYearsPagination"><span>{{year}} <i ng-if="!showYearsPagination">&dtrif;</i> <i ng-if="showYearsPagination">&urtri;</i> </span> </a>' +
          '</div>' +
          '<div class="datepicker-calendar-header-right">' +
          '<a href="javascript:void(0)" ng-click="nextMonth()">' + nextButton + '</a>' +
          '</div>' +
          '</div>' +
          //years pagination header
          '<div class="datepicker-calendar-header" ng-show="showYearsPagination">' +
          '<div class="datepicker-calendar-years-pagination">' +
          '<a ng-class="{\'datepicker-active\': y === year}" href="javascript:void(0)" ng-click="setNewYear(y)" ng-repeat="y in paginationYears">{{y}}</a>' +
          '</div>' +
          '<div class="datepicker-calendar-years-pagination-pages">' +
          '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[0])">' + prevButton + '</a>' +
          '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[paginationYears.length -1 ])">' + nextButton + '</a>' +
          '</div>' +
          '</div>' +
          //days column
          '<div class="datepicker-calendar-days-header">' + 
          '<div ng-repeat="d in daysInString"> {{d}} </div> ' +
          '</div>' +
          //days
          '<div class="datepicker-calendar-body">' +
          '<a ng-repeat="item in prevMonthDays" class="datepicker-calendar-day datepicker-disabled">{{item}}</a>' + 
          '<a ng-repeat="item in days" ng-click="setDatepickerDay(item)" ng-class="{\'datepicker-active\': day === item}" class="datepicker-calendar-day">{{item}}</a>' +
          '</div>' +
          '</div>' +
          '</div>';

        $scope.month = $filter('date')(date, 'MMMM');//December-November like
        $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
        $scope.day = Number($filter('date')(date, 'dd')); //01-31 like
        $scope.year = Number($filter('date')(date,'yyyy'));//2014 like
        $scope.months = datetime.MONTH;
        $scope.daysInString = ['0','1','2','3','4','5','6'].map(function(el) {

          return $filter('date')((new Date(new Date('06/08/2014').valueOf() + (86400000 * el))), 'EEE'); 
        });

        //create the calendar holder
        thisInput.after($compile(angular.element(htmlTemplate))($scope));

        //get the calendar as element
        theCalendar = element[0].children[1];
        //some tricky dirty events to fire if click is outside of the calendar and show/hide calendar when needed
        thisInput.bind('focus click', function bindingFunction() {

          isMouseOnInput = true;
          $scope.showCalendar();
        });

        thisInput.bind('blur focusout', function bindingFunction() {

          isMouseOnInput = false;
        });

        angular.element(theCalendar).bind('mouseenter', function () {
          
          isMouseOn = true;
        });
        
        angular.element(theCalendar).bind('mouseleave', function () {
          
          isMouseOn = false;
        });

        angular.element($window).bind('click', function () {

          if (!isMouseOn && !isMouseOnInput) {

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

          thisInput.val($filter('date')(new Date($scope.year + '/' + $scope.month + '/' + $scope.day ), dateFormat))
          .triggerHandler('input').triggerHandler('change');//just to be sure;
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
            , firstDayMonthNumber = Number($filter('date')(new Date($scope.year + '/' + $scope.month + '/' + 1),'d'))
            , prevMonthDays = []
            , howManyPreviousDays;

          $scope.days = [];

          for (i = 1; i <= limitDate; i += 1) {

            $scope.days.push(i);
          }

          //get previous month days is first day in month is not Sunday
          if (firstDayMonthNumber !== 7) {

            howManyPreviousDays =  7 - firstDayMonthNumber;
            //get previous month
            if (Number(month) <= 1) {

              month = 12;
            } else {

              month -= 1;
            }
            //return previous month days
            for (i = 1; i <= limitDate; i += 1) {

              prevMonthDays.push(i);
            }
            //attach previous month days
            $scope.prevMonthDays = prevMonthDays.slice(-howManyPreviousDays);
          }
        };

        $scope.setDatepickerDay = function setDatepickeDay(day) {

          $scope.day = Number(day);
          $scope.setInputValue();
          $scope.hideCalendar();
        };

        $scope.paginateYears = function paginateYears (startingYear) {
          
          $scope.paginationYears = [Number(startingYear)];

          $scope.paginationYears.splice(0,-9, $scope.paginationYears[0]++, $scope.paginationYears[0]++, $scope.paginationYears[0]++, $scope.paginationYears[0]++, $scope.paginationYears[0]++, $scope.paginationYears[0]++, $scope.paginationYears[0]++, $scope.paginationYears[0]++, $scope.paginationYears[0]++);
          $scope.paginationYears.splice(0,-10, $scope.paginationYears[0]--, $scope.paginationYears[0]--, $scope.paginationYears[0]--, $scope.paginationYears[0]--, $scope.paginationYears[0]--, $scope.paginationYears[0]--, $scope.paginationYears[0]--, $scope.paginationYears[0]--, $scope.paginationYears[0]--, $scope.paginationYears[0]--);
          $scope.paginationYears.sort();
        };

        $scope.paginateYears($scope.year);
        $scope.setDaysInMonth($scope.monthNumber, $scope.year);
      }
    };
  }]);
}(angular));
