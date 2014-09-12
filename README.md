AngularJS Datepicker
==================


Angularjs Datepicker is a pure angularjs directive that generates a datepicker calendar on your input element.


The Angularjs Datepicker is developed by [720kb](http://720kb.net).

##Requirements


AngularJS v1.2+

##Screen
![Angularjs datepicker calendar](http://i.imgur.com/44ut0ET.png)

## Load


To use the directive, include the javascript and css files of Angularjs Datepicker in your web page:

```html
<!DOCTYPE HTML>
<html>
<head>
  <script src="src/js/angular-datepicker.js"></script>
  <link href="src/css/angular-datepicker.css" rel="stylesheet" type="text/css" />
</head>
<body ng-app="app">
 //.....
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
Angularjs datepicker allows you to use some options via `attribute`  data

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
<datepicker 
button-prev="<i class='fa fa-arrow-left'></i>" 
button-next="<i class='fa fa-arrow-right'></i>"> 
<input ng-model="date" type="text"/>
</datepicker>
```
## Example

###[Live demo](https://720kb.github.io/angularjs-datepicker)

<br></br>
<br></br>

## License

Copyright (C) 2010-2014 Almende B.V.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.