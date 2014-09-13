Angular Datepicker
==================


Angular datepicker is an angularjs directive that generates a datepicker calendar on your input element.


The Angularjs Datepicker is developed by [720kb](http://720kb.net).

##Requirements


AngularJS v1.2+

##Screen
![Angular datepicker calendar](http://i.imgur.com/44ut0ET.png)

###Browser support

 
Chrome ![ok](http://i.imgur.com/CK8qxk1.png)

Firefox ![ok](http://i.imgur.com/CK8qxk1.png)

Safari ![ok](http://i.imgur.com/CK8qxk1.png)

Opera ![ok](http://i.imgur.com/CK8qxk1.png)

IE ![mmm](http://i.imgur.com/iAIwqCL.png)


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
##Options
Angular datepicker allows you to use some options via `attribute` data

####Date format
You can use all the Angularjs `$date` filter date formats (that can be found [here](https://docs.angularjs.org/api/ng/filter/date))

```html
<datepicker date-format="{{pattern}}">
  <input ng-model="date" type="text"/>
</datepicker>
```
####Custom buttons
You can customize the calendar navigation buttons content, let's make an example while using [FontAwesome](http://fontawesome.io)

```html
<datepicker button-prev="<i class='fa fa-arrow-left'></i>" button-next="<i class='fa fa-arrow-right'></i>">
  <input ng-model="date" type="text"/>
</datepicker>
```
## Example

###[Live demo](https://720kb.github.io/angular-datepicker)


##Contributing

We will be much grateful if you help us making this project to grow up.
Feel free to contribute by forking, opening issues, pull requests etc.

## License

The MIT License (MIT)

Copyright (c) 2014 Filippo Oretti, Dario Andrei

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
