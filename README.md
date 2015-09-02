Angular Datepicker
==================

[![Join the chat at https://gitter.im/720kb/angular-datepicker](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/720kb/angular-datepicker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Angular datepicker is an angularjs directive that generates a datepicker calendar on your input element.

The Angularjs Datepicker is developed by [720kb](http://720kb.net).

##Requirements


AngularJS v1.2+

##Screen
![Angular datepicker calendar](http://i.imgur.com/44ut0ET.png)

###Browser support

![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
 ✔ | ✔ | IE9 + | ✔ | ✔ |


## Load

To use the directive, include the Angular Datepicker's javascript and css files in your web page:

```html
<!DOCTYPE HTML>
<html>
<head>
  <link href="src/css/angular-datepicker.css" rel="stylesheet" type="text/css" />
</head>
<body ng-app="app">
  //.....
  <script src="src/js/angular-datepicker.js"></script>
</body>
</html>
```

##Install

###Bower installation

```
$ bower install angularjs-datepicker --save
```

_then load the js files in your html_

###Add module dependency

Add the 720kb.datepicker module dependency

```js
angular.module('app', [
  '720kb.datepicker'
 ]);
```


Call the directive wherever you want in your html page

```html
<datepicker>
  <input ng-model="date" type="text"/>
</datepicker>
```
> By default the ng-model will show a Javascript Date() Object inside your input, you can use the options below to set your preferred date format to.

##Options
Angular datepicker allows you to use some options via `attribute` data

####Date format
You can use all the Angularjs `$date` filter date formats (that can be found [here](https://docs.angularjs.org/api/ng/filter/date))

```html
<datepicker date-format="{{pattern}}">
  <input ng-model="date" type="text"/>
</datepicker>
```

####Date limits
You can set date limits using `date-min-limit=""` and `date-max-limit=""` attribute data ( you can use all the accepted date formats by the javascript `new Date()`)

```html
<datepicker date-min-limit="2014/08/11" date-max-limit="2018/07/14">
  <input ng-model="date" type="text"/>
</datepicker>
```

####Default date
You can set date to be displayed by default with `date-set=""` attribute data ( you can use all the accepted date formats by the javascript `new Date()`)

```html
<datepicker date-set="2018/07/14">
  <input ng-model="date" type="text"/>
</datepicker>

<datepicker date-set="{{myModel.date}}">
  <input ng-model="myModel.date" type="text"/>
</datepicker>
```

####Default date hidden on start
You can set default date to be shown only in calendar and not in input field by using the `date-set-hidden="true"` option.

```html
<datepicker date-set="2018/07/14" date-set-hidden="true">
  <input ng-model="date" type="text"/>
</datepicker>
```

####Date disabled
You can disable specific dates using the **date-disabled-dates=""** attribute and an _Array_ of dates you want to disable.

```html
<datepicker date-disabled-dates="['2018/07/14', '2018/09/07']">
  <input ng-model="date" type="text"/>
</datepicker>
```


####Custom titles
You can set the titles for the month and year selectors with the **date-year-title=""** and **date-month-title=""** data attributes (default to is _"select month"_ and _"select year"_)

<datepicker date-month-title="selected year">
    <input ng-model="date"/>
</datepicker>

<datepicker date-year-title="selected title">
    <input ng-model="date"/>
</datepicker>

####Custom buttons
You can customize the calendar navigation buttons content, let's make an example while using [FontAwesome](http://fontawesome.io)

```html
<datepicker button-prev="<i class='fa fa-arrow-left'></i>" button-next="<i class='fa fa-arrow-right'></i>">
  <input ng-model="date" type="text"/>
</datepicker>
```
####Custom buttons titles for arrows
You can also set the titles for the left and right arrows with **button-next-title=""** for the right and **button-prev-title=""** for the left. By default they are labeled _"next"_ and _"prev"_.
<datepicker button-prev-title="previous month">
    <input ng-model="date"/>
</datepicker>

<datepicker button-next-title="next month">
    <input ng-model="date" type="text"/>
</datepicker>

####Input as grandchild
Sometimes you cannot put date input as a first child of datepicker. In this case you may use `selector=""` to point to the CSS class of the input. Below example with using Twitter Bootstrap and FontAwesome

```html
<datepicker date-format="yyyy-MM-dd" selector="form-control">
    <div class="input-group">
        <input placeholder="Choose a date"/>
        <span class="input-group-addon" style="cursor: pointer"><i class="fa fa-lg fa-calendar"></i></span>
    </div>
</datepicker>
```

## Example

###[Live demo](https://720kb.github.io/angular-datepicker)

##Theming
You can edit the default Css file `angular-datepicker.css` if you want to make a new theme for the datepicker.

Here is an example of a [Dark Theme](http://codepen.io/45kb/pen/bjslv) made using custom Css.

##Contributing

We will be much grateful if you help us making this project to grow up.
Feel free to contribute by forking, opening issues, pull requests etc.

## License

The MIT License (MIT)

Copyright (c) 2014 Filippo Oretti, Dario Andrei

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
