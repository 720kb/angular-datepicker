/*global angular, navigator*/
(function withAngular(angular, navigator) {
  'use strict';

  var A_DAY_IN_MILLISECONDS = 86400000
    , isMobile = (function isMobile() {

      if (navigator.userAgent &&
        (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i))) {

        return true;
      }
    }())
    , generateMonthAndYearHeader = function generateMonthAndYearHeader(prevButton, nextButton) {

      if (isMobile) {

        return [
          '<div class="_720kb-datepicker-calendar-header">',
            '<div class="_720kb-datepicker-calendar-header-middle _720kb-datepicker-mobile-item _720kb-datepicker-calendar-month">',
              '<select ng-model="month" title="{{ dateMonthTitle }}" ng-change="selectedMonthHandle(month)">',
                '<option ng-repeat="item in months" ng-selected="item === month" ng-disabled=\'!isSelectableMaxDate(item + " " + day + ", " + year) || !isSelectableMinDate(item + " " + day + ", " + year)\' ng-value="$index + 1" value="$index + 1">',
                  '{{ item }}',
                '</option>',
              '</select>',
            '</div>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-header">',
            '<div class="_720kb-datepicker-calendar-header-middle _720kb-datepicker-mobile-item _720kb-datepicker-calendar-month">',
              '<select ng-model="mobileYear" title="{{ dateYearTitle }}" ng-change="setNewYear(mobileYear)">',
                '<option ng-repeat="item in paginationYears" ng-selected="year === item" ng-value="item" ng-disabled="!isSelectableMinYear(item) || !isSelectableMaxYear(item)">',
                  '{{ item }}',
                '</option>',
              '</select>',
            '</div>',
          '</div>'
        ];
      }

      return [
        '<div class="_720kb-datepicker-calendar-header">',
          '<div class="_720kb-datepicker-calendar-header-left">',
            '<a href="javascript:void(0)" ng-click="prevMonth()" title="{{ buttonPrevTitle }}">',
              prevButton,
            '</a>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-header-middle _720kb-datepicker-calendar-month">',
            '{{month}}&nbsp;',
            '<a href="javascript:void(0)" ng-click="paginateYears(year); showYearsPagination = !showYearsPagination;">',
              '<span>',
                '{{year}}',
                '<i ng-class="{\'_720kb-datepicker-calendar-header-closed-pagination\': !showYearsPagination, \'_720kb-datepicker-calendar-header-opened-pagination\': showYearsPagination}"></i>',
              '</span>',
            '</a>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-header-right">',
          '<a class="_720kb-datepicker-calendar-month-button" href="javascript:void(0)" ng-click="nextMonth()" title="{{ buttonNextTitle }}">',
            nextButton,
          '</a>',
          '</div>',
        '</div>'
      ];
    }
    , generateYearsPaginationHeader = function generateYearsPaginationHeader(prevButton, nextButton) {

      return [
        '<div class="_720kb-datepicker-calendar-header" ng-show="showYearsPagination">',
          '<div class="_720kb-datepicker-calendar-years-pagination">',
            '<a ng-class="{\'_720kb-datepicker-active\': y === year, \'_720kb-datepicker-disabled\': !isSelectableMaxYear(y) || !isSelectableMinYear(y)}" href="javascript:void(0)" ng-click="setNewYear(y)" ng-repeat="y in paginationYears">',
              '{{y}}',
            '</a>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-years-pagination-pages">',
            '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[0])" ng-class="{\'_720kb-datepicker-item-hidden\': paginationYearsPrevDisabled}">',
              prevButton,
            '</a>',
            '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[paginationYears.length -1 ])" ng-class="{\'_720kb-datepicker-item-hidden\': paginationYearsNextDisabled}">',
              nextButton,
            '</a>',
          '</div>',
        '</div>'
      ];
    }
    , generateDaysColumns = function generateDaysColumns() {

      return [
      '<div class="_720kb-datepicker-calendar-days-header">',
        '<div ng-repeat="d in daysInString">',
          '{{d}}',
        '</div>',
      '</div>'
      ];
    }
    , generateDays = function generateDays() {

      return [
        '<div class="_720kb-datepicker-calendar-body">',
          '<a href="javascript:void(0)" ng-repeat="px in prevMonthDays" class="_720kb-datepicker-calendar-day _720kb-datepicker-disabled">',
            '{{px}}',
          '</a>',
          '<a href="javascript:void(0)" ng-repeat="item in days" ng-click="setDatepickerDay(item)" ng-class="{\'_720kb-datepicker-active\': day === item, \'_720kb-datepicker-disabled\': !isSelectableMinDate(year + \'/\' + monthNumber + \'/\' + item ) || !isSelectableMaxDate(year + \'/\' + monthNumber + \'/\' + item) || !isSelectableDate(monthNumber, year, item)}" class="_720kb-datepicker-calendar-day">',
            '{{item}}',
          '</a>',
          '<a href="javascript:void(0)" ng-repeat="nx in nextMonthDays" class="_720kb-datepicker-calendar-day _720kb-datepicker-disabled">',
            '{{nx}}',
          '</a>',
        '</div>'
      ];
    }
    , generateHtmlTemplate = function generateHtmlTemplate(prevButton, nextButton) {

      var toReturn = [
        '<div class="_720kb-datepicker-calendar" ng-blur="hideCalendar()">',
        '</div>'
      ]
      , monthAndYearHeader = generateMonthAndYearHeader(prevButton, nextButton)
      , yearsPaginationHeader = generateYearsPaginationHeader(prevButton, nextButton)
      , daysColumns = generateDaysColumns()
      , days = generateDays()
      , iterator = function iterator(aRow) {

        toReturn.splice(toReturn.length - 1, 0, aRow);
      };

      monthAndYearHeader.forEach(iterator);
      yearsPaginationHeader.forEach(iterator);
      daysColumns.forEach(iterator);
      days.forEach(iterator);

      return toReturn.join('');
    }
    , datepickerDirective = function datepickerDirective($window, $compile, $locale, $filter, $interpolate) {

      var linkingFunction = function linkingFunction($scope, element, attr) {

        //get child input
        var selector = attr.selector
          , thisInput = angular.element(selector ? element[0].querySelector('.' + selector) : element[0].children[0])
          , theCalendar
          , defaultPrevButton = '<b class="_720kb-datepicker-default-button">&lang;</b>'
          , defaultNextButton = '<b class="_720kb-datepicker-default-button">&rang;</b>'
          , prevButton = attr.buttonPrev || defaultPrevButton
          , nextButton = attr.buttonNext || defaultNextButton
          , dateFormat = attr.dateFormat
          //, dateMinLimit
          //, dateMaxLimit
          , dateDisabledDates = $scope.$eval($scope.dateDisabledDates)
          , date = new Date()
          //, currentDay = $filter('date')(date, 'd')
          , currentMonthNumber = $filter('date')(date, 'M')
          //, currentYear = $filter('date')(date, 'yyyy')
          , isMouseOn = false
          , isMouseOnInput = false
          , datetime = $locale.DATETIME_FORMATS
          , pageDatepickers
          , htmlTemplate = generateHtmlTemplate(prevButton, nextButton)
          , resetToMinDate = function resetToMinDate() {

            $scope.month = $filter('date')(new Date($scope.dateMinLimit), 'MMMM');
            $scope.monthNumber = Number($filter('date')(new Date($scope.dateMinLimit), 'MM'));
            $scope.day = Number($filter('date')(new Date($scope.dateMinLimit), 'dd'));
            $scope.year = Number($filter('date')(new Date($scope.dateMinLimit), 'yyyy'));
          }
          , resetToMaxDate = function resetToMaxDate() {

            $scope.month = $filter('date')(new Date($scope.dateMaxLimit), 'MMMM');
            $scope.monthNumber = Number($filter('date')(new Date($scope.dateMaxLimit), 'MM'));
            $scope.day = Number($filter('date')(new Date($scope.dateMaxLimit), 'dd'));
            $scope.year = Number($filter('date')(new Date($scope.dateMaxLimit), 'yyyy'));
          }
          , prevYear = function prevYear() {

            $scope.year = Number($scope.year) - 1;
          }
          , nextYear = function nextYear() {

            $scope.year = Number($scope.year) + 1;
          }
          , setInputValue = function setInputValue() {

            if ($scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day) &&
                $scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

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
          }
          , classHelper = {
            'add': function add(ele, klass) {
              var classes;

              if (ele.className.indexOf(klass) > -1) {

                return;
              }

              classes = ele.className.split(' ');
              classes.push(klass);
              ele.className = classes.join(' ');
            },
            'remove': function remove(ele, klass) {
              var i
                , classes;

              if (ele.className.indexOf(klass) === -1) {

                return;
              }

              classes = ele.className.split(' ');
              for (i = 0; i < classes.length; i += 1) {

                if (classes[i] === klass) {

                  classes = classes.slice(0, i).concat(classes.slice(i + 1));
                  break;
                }
              }
              ele.className = classes.join(' ');
            }
          }
          , showCalendar = function showCalendar() {
            //lets hide all the latest instances of datepicker
            pageDatepickers = $window.document.getElementsByClassName('_720kb-datepicker-calendar');

            angular.forEach(pageDatepickers, function forEachDatepickerPages(value, key) {
              if (pageDatepickers[key].classList) {

                pageDatepickers[key].classList.remove('_720kb-datepicker-open');
              } else {

                classHelper.remove(pageDatepickers[key], '_720kb-datepicker-open');
              }
            });

            if (theCalendar.classList) {

              theCalendar.classList.add('_720kb-datepicker-open');
            } else {

              classHelper.add(theCalendar, '_720kb-datepicker-open');
            }
          }
          , setDaysInMonth = function setDaysInMonth(month, year) {

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
            if (firstDayMonthNumber === 0) {

              //no need for it
              $scope.prevMonthDays = [];
            } else {

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
          }
          , unregisterDataSetWatcher = $scope.$watch('dateSet', function dateSetWatcher(newValue) {

            if (newValue) {

              date = new Date(newValue);
              $scope.month = $filter('date')(date, 'MMMM');//december-November like
              $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
              $scope.day = Number($filter('date')(date, 'dd')); //01-31 like
              $scope.year = Number($filter('date')(date, 'yyyy'));//2014 like
              setDaysInMonth($scope.monthNumber, $scope.year);
              if ($scope.dateSetHidden !== 'true') {

                setInputValue();
              }
            }
          });

        $scope.nextMonth = function nextMonth() {

          if ($scope.monthNumber === 12) {

            $scope.monthNumber = 1;
            //its happy new year
            nextYear();
          } else {

            $scope.monthNumber += 1;
          }
          //set next month
          $scope.month = $filter('date')(new Date($scope.year, $scope.monthNumber - 1), 'MMMM');
          //reinit days
          setDaysInMonth($scope.monthNumber, $scope.year);

          //check if max date is ok
          if ($scope.dateMaxLimit &&
            currentMonthNumber > $scope.monthNumber) {

            if (!$scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

              resetToMaxDate();
            }
          }
          //deactivate selected day
          $scope.day = undefined;
        };

        $scope.prevMonth = function managePrevMonth() {

          if ($scope.monthNumber === 1) {

            $scope.monthNumber = 12;
            //its happy new year
            prevYear();
          } else {

            $scope.monthNumber -= 1;
          }
          //set next month
          $scope.month = $filter('date')(new Date($scope.year, $scope.monthNumber - 1), 'MMMM');
          //reinit days
          setDaysInMonth($scope.monthNumber, $scope.year);
          //check if min date is ok
          if ($scope.dateMinLimit) {

            if (!$scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

              resetToMinDate();
            }
          }
          //deactivate selected day
          $scope.day = undefined;
        };

        $scope.selectedMonthHandle = function manageSelectedMonthHandle(selectedMonthNumber) {

          $scope.monthNumber = Number($filter('date')(new Date(selectedMonthNumber + '/01/2000'), 'MM'));
          setDaysInMonth($scope.monthNumber, $scope.year);
          setInputValue();
        };

        $scope.setNewYear = function setNewYear(year) {

          //deactivate selected day
          if (!isMobile) {
            $scope.day = undefined;
          }

          if ($scope.dateMaxLimit &&
            $scope.year < Number(year)) {

            if (!$scope.isSelectableMaxYear(year)) {

              return;
            }
          } else if ($scope.dateMinLimit &&
            $scope.year > Number(year)) {

            if (!$scope.isSelectableMinYear(year)) {

              return;
            }
          }

          $scope.year = Number(year);
          setDaysInMonth($scope.monthNumber, $scope.year);
          $scope.paginateYears(year);
          $scope.showYearsPagination = false;
        };

        $scope.hideCalendar = function hideCalendar() {
          if (theCalendar.classList){
            theCalendar.classList.remove('_720kb-datepicker-open');
          } else {

            classHelper.remove(theCalendar, '_720kb-datepicker-open');
          }
        };

        $scope.setDatepickerDay = function setDatepickerDay(day) {

          if ($scope.isSelectableDate($scope.monthNumber, $scope.year, day) &&
              $scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + day) &&
              $scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + day)) {

            $scope.day = Number(day);
            setInputValue();

            if (attr.hasOwnProperty('dateRefocus')) {
              thisInput[0].focus();
            }

            $scope.hideCalendar();
          }
        };

        $scope.paginateYears = function paginateYears(startingYear) {
          var i
           , theNewYears = []
           , daysToPrepend = 10
           , daysToAppend = 10;

          $scope.paginationYears = [];
          if (isMobile) {

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
          //date typing in input date-typer
          if ($scope.dateTyper === 'true') {

            thisInput.on('keyup blur', function onTyping() {

              if (thisInput[0].value &&
                thisInput[0].value.length &&
                thisInput[0].value.length > 0) {

                try {

                  date = new Date(thisInput[0].value.toString());

                  if (date.getFullYear() &&
                   date.getDay() &&
                   !isNaN(date.getMonth()) &&
                   $scope.isSelectableDate(date) &&
                   $scope.isSelectableMaxDate(date) &&
                   $scope.isSelectableMinDate(date)) {

                    $scope.$apply(function applyTyping() {

                      $scope.month = $filter('date')(date, 'MMMM');//december-November like
                      $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
                      $scope.day = Number($filter('date')(date, 'dd')); //01-31 like

                      if (date.getFullYear().toString().length === 4) {
                        $scope.year = Number($filter('date')(date, 'yyyy'));//2014 like
                      }
                      setDaysInMonth($scope.monthNumber, $scope.year);
                    });
                  }
                } catch (e) {

                  return e;
                }
              }
            });
          }
          //check range dates
          if ($scope.dateMaxLimit &&
            theNewYears &&
            theNewYears.length &&
            !$scope.isSelectableMaxYear(Number(theNewYears[theNewYears.length - 1]) + 1)) {

            $scope.paginationYearsNextDisabled = true;
          } else {

            $scope.paginationYearsNextDisabled = false;
          }

          if ($scope.dateMinLimit &&
            theNewYears &&
            theNewYears.length &&
            !$scope.isSelectableMinYear(Number(theNewYears[0]) - 1)) {

            $scope.paginationYearsPrevDisabled = true;
          } else {

            $scope.paginationYearsPrevDisabled = false;
          }

          $scope.paginationYears = theNewYears;
        };

        $scope.isSelectableDate = function isSelectableDate(monthNumber, year, day) {
          var i = 0;

          if (dateDisabledDates &&
            dateDisabledDates.length > 0) {

            for (i; i <= dateDisabledDates.length; i += 1) {

              if (new Date(dateDisabledDates[i]).getTime() === new Date(monthNumber + '/' + day + '/' + year).getTime()) {

                return false;
              }
            }
          }
          return true;
        };

        $scope.isSelectableMinDate = function isSelectableMinDate(aDate) {
          //if current date
          if (!!$scope.dateMinLimit &&
             !!new Date($scope.dateMinLimit) &&
             new Date(aDate).getTime() < new Date($scope.dateMinLimit).getTime()) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMaxDate = function isSelectableMaxDate(aDate) {
          //if current date
          if (!!$scope.dateMaxLimit &&
             !!new Date($scope.dateMaxLimit) &&
             new Date(aDate).getTime() > new Date($scope.dateMaxLimit).getTime()) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMaxYear = function isSelectableMaxYear(year) {
          if (!!$scope.dateMaxLimit &&
            year > new Date($scope.dateMaxLimit).getFullYear()) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMinYear = function isSelectableMinYear(year) {
          if (!!$scope.dateMinLimit &&
            year < new Date($scope.dateMinLimit).getFullYear()) {

            return false;
          }

          return true;
        };

        // respect previously configured interpolation symbols.
        htmlTemplate = htmlTemplate.replace(/{{/g, $interpolate.startSymbol()).replace(/}}/g, $interpolate.endSymbol());
        $scope.dateMonthTitle = $scope.dateMonthTitle || 'Select month';
        $scope.dateYearTitle = $scope.dateYearTitle || 'Select year';
        $scope.buttonNextTitle = $scope.buttonNextTitle || 'Next';
        $scope.buttonPrevTitle = $scope.buttonPrevTitle || 'Prev';

        $scope.month = $filter('date')(date, 'MMMM');//december-November like
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
        thisInput.on('focus click', function onFocusAndClick() {

          isMouseOnInput = true;
          showCalendar();
        });

        thisInput.on('focusout blur', function onBlurAndFocusOut() {

          isMouseOnInput = false;
        });

        angular.element(theCalendar).on('mouseenter', function onMouseEnter() {

          isMouseOn = true;
        });

        angular.element(theCalendar).on('mouseleave', function onMouseLeave() {

          isMouseOn = false;
        });

        angular.element(theCalendar).on('focusin', function onCalendarFocus() {

          isMouseOn = true;
        });

        angular.element($window).on('click focus', function onClickOnWindow() {

          if (!isMouseOn &&
            !isMouseOnInput && theCalendar) {

            $scope.hideCalendar();
          }
        });

        //check always if given range of dates is ok
        if ($scope.dateMinLimit &&
          !$scope.isSelectableMinYear($scope.year)) {

          resetToMinDate();
        }

        if ($scope.dateMaxLimit &&
          !$scope.isSelectableMaxYear($scope.year)) {

          resetToMaxDate();
        }

        $scope.paginateYears($scope.year);
        setDaysInMonth($scope.monthNumber, $scope.year);

        $scope.$on('$destroy', function unregisterListener() {

          unregisterDataSetWatcher();
          thisInput.off('focus click focusout blur');
          angular.element(theCalendar).off('mouseenter mouseleave focusin');
          angular.element($window).off('click focus');
        });

        if (attr.hasOwnProperty('visibleOnLoad')) {
          showCalendar();
        }
      };

      return {
        'restrict': 'AEC',
        'scope': {
          'dateSet': '@',
          'dateMinLimit': '@',
          'dateMaxLimit': '@',
          'dateMonthTitle': '@',
          'dateYearTitle': '@',
          'buttonNextTitle': '@',
          'buttonPrevTitle': '@',
          'dateDisabledDates': '@',
          'dateSetHidden': '@',
          'dateTyper': '@'
        },
        'link': linkingFunction
      };
    };

  angular.module('720kb.datepicker', [])
               .directive('datepicker', ['$window', '$compile', '$locale', '$filter', '$interpolate', datepickerDirective]);
}(angular, navigator));
