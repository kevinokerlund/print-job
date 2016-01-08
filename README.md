div-printer.js
==============

This small JavaScript library prints a single HTML container.

Features
--------

* No popup windows or iFrames
* No moving and replacing HTML
* Launch multiple print jobs at once
* Launch actions based on printing events (e.g. when print dialog closes)

Getting Started
---------------

1. <a href="https://raw.githubusercontent.com/Kevin-Okerlund/div-printer.js/master/src/div-printer.js" target="_blank">Acquire div-printer.js</a>

Documentation
-------------

#####`new DivPrinter([selector])`

Creates a new instance of DivPrinter. This does not cause a printing job to occur. A selector is passed to the
DivPrinter constructor. This returns the first element for the selector it finds. Using an `id` as a selector is
encouraged as using classnames as selectors can result in obtaining the incorrect element. It is often beneficial to
store the instance in a variable.

```javascript
var printContent = new DivPrinter('#mainContent');
```

---

#####`.print()`

Calls `window.print()`. Before it calls the window method, printing classes are added to the element to print, as well
as parent elements. These printing classes are `@media print` styles and will be invoked during print.

```javascript
printContent.print();
```

---

#####`.beforePrint([function])`

Adds a function to be called immediately when the `window.print` method is called. Each instance of DivPrinter has its
own beforePrint Queue. Each time `.print()` is called, any functions that have been added to the instance will be
removed from the stack after the function executes.

```javascript
printContent.beforePrint(function() {
  console.log('Before Print Job');
});
```

---

#####`.afterPrint([function])`

Adds a function to be called immediately when the print dialog (preview) window is closed. Each instance of DivPrinter
has its own afterPrint Queue. Each time `.print()` is called, any functions that have been added to the instance will be
removed from the stack after the function executes.

```javascript
printContent.afterPrint(function() {
  console.log('After Print Job')
});
```

Full Example
------------

```javascript
var mainContent = new DivPrinter('#mainContent')
  .beforePrint(function() {
    console.log('Before Print Job')
  })
  .afterPrint(function() {
    console.log('After Print Job')
  })
  .print();
```

Browser Support
---------------

* Chrome
* Firefox
* Safari

**NOTE:** div-printer.js is not tested on mobile browsers.

Issues
------

Discovered a bug? Please create an issue here on GitHub.

https://github.com/Kevin-Okerlund/div-printer.js/issues

Versioning
----------

Releases will be numbered with the following format:

`<major>.<minor>.<patch>` Example: 2.1.5

The following guidelines alter the version:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

Developers
----------

ToDo...
