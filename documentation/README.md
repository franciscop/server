# Documentation

<!-- <div class="tableofcontents" data-headers="h2">
  <ul class="col three"></ul>
</div> -->

Find nodes from the HTML with a CSS selector:

```js
u('ul#demo li')
u(document.getElementById('demo'))
u(document.getElementsByClassName('demo'))
u([ document.getElementById('demo') ])
u( u('ul li') )
u('<a>')
u('li', context)
```


### Parameters

The first parameter can be:

- A text CSS selector
- A single HTML Node. This is specially useful in events where you can just pass `this`
- A NodeList or other similar objects that can be converted to an array
- An array of nodes*
- Another Umbrella instance
- An HTML fragment as a string
- Nothing

The second parameter is only for the CSS selector, which indicates a portion of the DOM where the selector is applied. For example, with `u('li', u('ul').first())` it will find all of the `li` from the first `ul`.


\* actually it can be an array of anything you want as in `["a", "b"]`, however this is not officially supported and might change at any moment

> You *should* use `u('#demo')` instead of `u(document.getElementById('demo'))`, internally it's optimized to do this in a fast way. That was only an example of what's possible.


### Return

An instance of Umbrella JS so you can chain it to any of the other methods.



### Examples

Select all of the list elements that are children of `ul`

```js
var lis = u('ul > li');    // Same as u('ul').children('li');
```

Find all of the headers from the page to create a Table of Contents:

```js
var headers = u('h1, h2, h3, h4, h5, h6');
```

Generate a link on the fly:

```js
var link = u('<a>').addClass('main').attr({ href: '/hello' });
```

You can use this to generate many kind of elements on the fly. For example, for a simple grocery list (using ES6 for simplicity):

```js
var fruits = ['apple', 'strawberry', 'pear', 'banana'];
var list = u('<ul>').append(fruit => `<li>${ fruit }</li>`, fruits);

u('body').append(list);
```


It plays well with other libraries, including jquery. For example, with [pagex.js](http://github.com/franciscop/pagex):

```js
// When we are on the page "/login"
page(/^login/, function(){

  function done(err, res){
    if (err) return alert("There was an error");
    window.location.href = "/user/" + res.id;
  };

  // Find the form and handle it through ajax when it's submitted
  u("form.login").ajax(done);
});
```



### Native methods

> This section is inspired by [Bliss.js' vanilla methods](http://blissfuljs.com/docs.html#vanilla)

There are many native methods and properties that you can use. These can be called straight in the `.first()` or `.last()` elements, a `.nodes` element or you can loop every element to call them. For example:

```js
// Single element from .nodes
u('h1').nodes[0].classList.add('vanilla');

// Single element
u('h1').first().classList.add('vanilla', 'test');

// Multiple elements. Note that the order is different from jquery
u('h2').each(function(el){
  el.classList.add('vanilla', 'test');
});
```

And for the arrays it's similar, you can call any array method on `u().nodes` since this is literally an array:

```js
u('h2').nodes.forEach();
var mapped = u('h2').nodes.map();
var filtered = u('h2').nodes.filter();
var good = u('h2').nodes.some();
```

However, there are also some advantages of using Umbrella's methods instead of native methods. For example, with `.addClass()` vs native `classList.add()`:

- **error prevention**: if nodes.length = 0, the single-element way will fail in the above implementation (since first() and nodes[0] are null)
- **cross-browser**: the classList.add() with multiple elements [is not compatible with IE10-11 & Android 4.3-](http://caniuse.com/#search=classList)
- **chainable**: `u('<div>').each(...).addClass(...);`
- **more flexibility**: there are many ways to specify multiple classes with addClass, and only one way to specify them on the native way. Imagine that you have an array of classes, with the native method this becomes a nightmare. This is what it means to be flexible:

```js
u('h2').addClass('vanilla', 'test');     // It accepts multiple parameters
u('h2').addClass(['vanilla', 'test']);   // Also accept an array
u('h2').addClass(['vanilla'], ['test']); // Or multiple arrays
u('h2').addClass('vanilla, test');       // Strings with space and/or comma
u('h2').addClass('vanilla', ['test'], 'one, more' ); // Or just whatever
```

So it's convenient that you know these limitations and act accordingly. Try to use native methods where it makes sense, then Umbrella's methods where it's better suited or then create your own methods when you need it.



## .length

You can check how many elements are matched with `.length`:

```js
// Check how many <a> are in the page
alert(u('a').length);
```

## .addClass()

Add html class(es) to all of the matched elements.

```js
.addClass('name1')
.addClass('name1 name2 nameN')
.addClass('name1,name2,nameN')
.addClass('name1', 'name2', 'nameN')
.addClass(['name1', 'name2', 'nameN'])
.addClass(['name1', 'name2'], ['name3'], ['nameN'])
.addClass(function(){ return 'name1'; })
.addClass(function(){ return 'name1'; }, function(){ return 'name2'; })
```

### Parameters

`name1`, `name2`, `nameN`: the class name (or variable containing it) to be added to all of the matched elements. It accepts many different types of parameters (see above).



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Add the class `main` to all the `<h2>` from the page:

```js
u("h2").addClass("main");
```

Add the class `toValidate` and `ajaxify` to all the `<form>` present in the page:

```js
u("form").addClass("toValidate", "ajaxify");
```



### Related

[.hasClass()](#hasclass) finds if the matched elements contain the class(es).

[.removeClass()](#removeclass) deletes class(es) from the matched elements.

[.toggleClass()](#toggleclass) adds or removes the class

## .after()

Add some html as a sibling after each of the matched elements.

```js
.after(html)

.after('<div>')
.after(u('<div>'))
.after(u('<div>').first()) // Same as document.createElement('div')
.after(u('<div></div><div></div>'))
.after(function(){})
.after(function(el){}, elements)
.after(function(el){}, 10)
```



### Parameters

`html = ""`:
  - Any of these elements:
    - **string** containing the html that is going to be inserted
    - **instance of Umbrella**
    - **HTML node**
    - **array** containing HTML nodes
  - A callback that returns any of the previous. It gets passed these parameters:
    - **el**: the current element from the elements parameter, {} if none is specified and i if elements is number
    - **i**: the index of the current element

`elements = [{}]` (optional): It can be any of the following:
  - An array of elements that will be passed to the callback. The callback is executed once per element, and all of them are added consecutively.
  - A css selector, so the function will be executed once per matched element.
  - A number, in which case the function will be executed that number of times



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Add a separator `<hr>` after each of the main titles h1:

```js
u("h1").after("<hr>");
```

Add three elements after the link. All of these methods are equivalent:

```js
// Add them all like a single string
u("a.main").after("<a>One</a><a>Two</a><a>Three</a>");

// Add them in a chain
u("a.main").after("<a>Three</a>").after("<a>Two</a>").after("<a>One</a>");

// Add them with a function parameter
var cb = function(txt){ return "<a>" + txt + "</a>" };
u("a.main").after(cb, ["One", "Two", "Three"]);

// Same as the previous one but with ES6
u("a.main").after(txt => `<a>${ txt }</a>`, ["One", "Two", "Three"]);
```

They all result in:

```html
<!-- previous data -->

<a class="main"></a>
<a>One</a>
<a>Two</a>
<a>Three</a>
```


You can also add some events to them by creating an html node:

```js
function greeting(){ alert("Hello world"); }

u("a.main").after(function(){
  return u('<a>').addClass('hi').on('click', greeting).html("Greetings!");
});
```



### Related

[.before()](#before) Add some html before each of the matched elements.

[.append()](#append) Add some html as a child at the end of each of the matched elements

[.prepend()](#prepend) Add some html as a child at the beginning of each of the matched elements.

## .ajax()

Make all of the matched forms to be submitted by ajax with the same action, method and values when the user submits the form.

> Note: this method does NOT submit the form, it just handles it when it's submitted (from the user or with .trigger())

```js
.ajax(done, before);
```


### Parameters

`done` [optional]: A function to be called when the request ends. The first argument is the error, if any. The second is the body, which is parsed to JSON if it's a JSON string or just the body as a string if it's not JSON. The third is the request object itself.

```js
var done = function(err, body, xhr){};
```

`before` [optional]: A function to be called before the request is sent. Useful to manipulate some data in real-time.

```js
var before = function(xhr){};
```


### Return

**Undefined**. Please don't use the returned value for anything (it might be a promise in the future).



### Examples

Handle the newsletter through ajax

```js
u('.newsletter').ajax(function(err){
  if (err) return alert("Error");
  alert("Thank you for subscribing, awesome!");
});
```

Actually send a form through ajax:

```js
u('form.edit').ajax(function(){ console.log('Sent!'); }).trigger('submit');
```


### Why not jquery?

This was created because this pattern is quite common in jquery:

```js
$('form').on('submit', function(e){
  e.preventDefault();
  $.post($(this).attr('action'), $(this).serialize(), function(data){
    alert("Done! Thanks, " + data.name);
  }, 'json');
});
```

After repeating that many times, I found out that it's better if we just make that the default. The same code on Umbrella JS:

```js
u('form').ajax(function(err, data){
  if (!err) alert('Done! Thanks, ' + data.name);
});
```

Of course you have freedom and you can use a similar method to jquery, but I think it's a bit pointless for this specific situation:

```js
u('form').on('submit', function(e){
  e.preventDefault();
  var options = { method: u(this).attr('method'), body: u(this).serialize() };
  ajax(u(this).attr('action'), options, function(err, data){
    if (!err) alert("Done! Thanks, " + data.name);
  });
});
```


### Related

[ajax()](#ajaxfn): perform ajax requests

## .append()

Add some html as a child at the end of each of the matched elements

```js
.append(html)

.append('<div>')
.append(u('<div>'))
.append(u('<div>').first()) // Same as document.createElement('div')
.append(u('<div></div><div></div>'))
.append(function(){})
.append(function(el){}, elements)
.append(function(el){}, 10)
```



### Parameters

`html = ""`:
  - Any of these elements:
    - **string** containing the html that is going to be inserted
    - **instance of Umbrella**
    - **HTML node**
    - **array** containing HTML nodes
  - A callback that returns any of the previous. It gets passed these parameters:
    - **el**: the current element from the elements parameter, {} if none is specified and i if elements is number
    - **i**: the index of the current element

`elements = [{}]` (optional): It can be any of the following:
  - An array of elements that will be passed to the callback. The callback is executed once per element, and all of them are added consecutively.
  - A css selector, so the function will be executed once per matched element.
  - A number, in which case the function will be executed that number of times



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Add a footer to each of the articles

```js
u("article").append("<footer>Hello world</footer>");
```

Add three elements to the list. All of these methods are equivalent:

```js
// Add them all like a single string
u("ul").append("<li>One</li><li>Two</li><li>Three</li>");

// Add them in a chain
u("ul").append("<li>One</li>").append("<li>Two</li>").append("<li>Three</li>");

// Add them with a function parameter
var cb = function(txt){ return "<li>" + txt + "</li>" };
u("ul").append(cb, ["One", "Two", "Three"]);

// Same as the previous one but with ES6
u("ul").append(txt => `<li>${ txt }</li>`, ["One", "Two", "Three"]);
```

They all result in:

```html
<ul>
  <!-- previous data -->

  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>
```

You can also add some events to them by creating an html node:

```js
function greet(){ alert("Hello world"); }

u("a.main").append(function(){
  return u('<a>').addClass('hi').on('click', greet).html("Hey!");
});
```



### Related

[.prepend()](#prepend) Add some html as a child at the beginning of each of the matched elements.

[.before()](#before) Add some html before each of the matched elements.

[.after()](#after) Add some html as a sibling after each of the matched elements.

## .array()

Extract structured data from the DOM.

```js
.array()
.array(callback)
```

### Parameters

`callback = function(node, i){ return node.innerHTML }`: a callback to be called on each node. The returned value is the one set on the final version. If an array is returned then these elements are added to the set. However, if nothing or null is returned it removes them.


### Return

A simple javascript array consisting on the elements returned by the callback



### Example

```html
<ul>
  <li>Peter</li>
  <li>Mery</li>
  <li>John</li>
</ul>
```

Javascript (by default):

```js
u('ul li').array();
// ['Peter', 'Mery', 'John']
```

Javascript (with custom callback):

```js
u('ul li').array(function(node){
  return { name: u(node).text() };
});
// [{ name: 'Peter' }, { name: 'Mery' }, { name: 'John' }]
```

## .attr()

Handle attributes for the matched elements

```js
// GET
.attr('name');

// SET
.attr('name', 'value');
.attr({ name1: 'value', name2: 'value2' });
```


### Parameters

*GET*

`name`: the attribute that we want to get from the first matched element


*SET*

`name`: the attribute that we want to set for all of the matched elements

`value`: what we want to set the attribute to. If it's not defined, then we get the name



### Return

*GET*

`string`: the value of the attribute

*SET*

`u`: returns the same instance of Umbrella JS



### Important

You must understand that `.attr()` will only retrieve the attributes, not the properties like `checked`. To understand it better, check [jquery's attr() vs prop()](http://api.jquery.com/prop/).

Each property is different so you should consult each case. For example, if you wanted to get the property `checked` you could do:

```js
u('.terms-os-service').is(':checked');
```



### Examples

Get the alt of an image:

```js
u('img.hero').attr('alt');
```

Set the src of all of the images:

```js
u('img').attr({ src: 'demo.jpg' });
```


### Related

[.data()](#data) handle data-* attributes for the matched elements
## .before()

Add some html before each of the matched elements.

```js
.before(html)

.before('<div>')
.before(u('<div>'))
.before(u('<div>').first()) // Same as document.createElement('div')
.before(u('<div></div><div></div>'))
.before(function(){})
.before(function(el){}, elements)
.append(function(el){}, 10)
```



### Parameters

`html = ""`:
  - Any of these elements:
    - **string** containing the html that is going to be inserted
    - **instance of Umbrella**
    - **HTML node**
    - **array** containing HTML nodes
  - A callback that returns any of the previous. It gets passed these parameters:
    - **el**: the current element from the elements parameter, {} if none is specified and i if elements is number
    - **i**: the index of the current element

`elements = [{}]` (optional): It can be any of the following:
  - An array of elements that will be passed to the callback. The callback is executed once per element, and all of them are added consecutively.
  - A css selector, so the function will be executed once per matched element.
  - A number, in which case the function will be executed that number of times



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Add a header to each of the articles

```js
u("article").after("<header>Hello world</header>");
```

Add three elements before the link. All of these methods are equivalent:

```js
// Add them all like a single string
u("a.main").before("<a>One</a><a>Two</a><a>Three</a>");

// Add them in a chain
u("a.main").before("<a>One</a>").before("<a>Two</a>").before("<a>Three</a>");

// Add them with a function parameter
var cb = function(txt){ return "<a>" + txt + "</a>" };
u("a.main").before(cb, ["One", "Two", "Three"]);

// Same as the previous one but with ES6
u("a.main").before(txt => `<a>${ txt }</a>`, ["One", "Two", "Three"]);
```

They all result in:

```html
<a>One</a>
<a>Two</a>
<a>Three</a>
<a class="main"></a>

<!-- previous data -->
```


You can also add some events to them by creating an html node:

```js
function greeting(){ alert("Hello world"); }

u("a.main").before(function(){
  return u('<a>').addClass('hi').on('click', greeting).html("Greetings!");
});
```



### Related

[.after()](#after) Add some html as a sibling after each of the matched elements.

[.append()](#append) Add some html as a child at the end of each of the matched elements

[.prepend()](#prepend) Add some html as a child at the beginning of each of the matched elements.

## .children()

Get the direct children of all of the nodes with an optional filter

```js
.children(filter);
```


### Parameters

`filter`: a string containing a selector that nodes must pass or a function that return a boolean. See [.filter()](#filter) for a better explanation



### Return

`u`: returns an instance of Umbrella JS with the new children as nodes



### Examples

Get the first `<li>` of every `<ul>`

```js
u("ul").children('li:first-child');
```



### Related

[.parent()](#parent) get all of the direct parents

[.find()](#find) get all of the descendants of the matched nodes

[.closest()](#closest) get the first ascendant that matches the selector

## .clone()

Create a deep copy of the set of matched elements. Includes matched element node and **all of its events** as well as its children **and all of their events** by **default**.

```js
u('.elementToClone').clone()
```



### Extensions
  - The following extensions are enabled by default:
    - **select** select input node values are copied to all cloned nodes. To disable globally, add ```u.prototype.mirror.select = false;``` to your code.
    - **textarea** textarea input node values are copied to all cloned nodes. To disable globally, add ```u.prototype.mirror.select = false;``` to your code.


### Return

`u`: returns the same instance of Umbrella JS



### Examples

Clone a node and append to another.

```html
<div class="container">
  <div class="testClone1">Hello</div>
  <div class="cloneDestination"></div>
</div>
```

```js
var clone = u("testClone1").clone();
u(".cloneDestination").append(clone);

```
Result:
```html
<div class="container">
  <div class="testClone1">Hello</div>
  <div class="cloneDestination">
    <div class="testClone1">Hello</div>
  </div>
</div>
```

### Related
[.append()](#append) add some html as a child at the end of each of the matched elements.


## .closest()

Find the first ancestor that matches the selector for each node

```js
.closest(filter);
```


### Parameters

`filter`: a string containing a selector that nodes must pass or a function that return a boolean. See [.filter()](#filter) for a better explanation



### Return

`u`: returns an instance of Umbrella JS with the new ancestors as nodes



### Examples

Get the ul of every li

```js
u("li").closest('ul');
```



### Related

[.find()](#find) get all of the descendants of the matched nodes

[.parent()](#parent) get all of the direct parents

[.children()](#children) get the direct children of all of the nodes with an optional filter

## .data()

Handle data-* attributes for the matched elements

```js
// GET
.data('name');

// SET
.data('name', 'value');
.data({ name1: 'value', name2: 'value2' });
```


### Parameters

*GET*

`name`: the data-* attribute that we want to get from the first matched element


*SET*

`name`: the data-* attribute that we want to set for all of the matched elements

`value`: what we want to set the attribute to. If it's not defined, then we get the name



### Return

*GET*

`string`: the value of the data-* attribute

*SET*

`u`: data-* returns the same instance of Umbrella JS


### Examples

Get the value for data-id:

```html
<ul>
  <li data-id='0'>First</li>
  <li data-id='1'>Second</li>
  <li data-id='2'>Third</li>
</ul>
```

```js
u('ul li').first().data('id'); // 0
```

Set the data-id of an element:

```js
u('ul li').first().data({ id: '1' }); // <li data-id='1'>First</li>

u('ul li').first().data('id', '2'); // <li data-id='2'>First</li>
```


### Related

[.attr()](#attr) handle attributes for the matched elements

## .each()

Loop through all of the nodes and execute a callback for each

```js
.each(function(node, i){});
```


### Parameters

`callback`: the function that will be called. It accepts two parameters, the node and the index. `this` is Umbrella's instance so other methods like `this.args()` and `this.slice()` are available.



### Return

`u`: returns an instance of Umbrella JS with the same nodes



### Examples

Loop through all of the links and add them a `target="_blank"`:

```js
u('a').each(function(node, i){
  u(node).attr({ target: '_blank' });
});
```
## .filter()

Remove all the nodes that doesn't match the criteria

```js
.filter('a')
.filter(u('a'))
.filter(function(node, i){ return u(node).is('a'); })
```


### Parameters

`filter`: it can be:
  - css selector that each of the nodes must match to stay
  - instance of umbrella with the elements to keep (the intersection will be kept)
  - function that returns a boolean with true to keep the element. It accepts two parameters, `node` and `index`, and the context of `this` is the instance of umbrella so methods like `this.slice()` are available


### Returns

An instance of Umbrella with the nodes that passed the filter.


### Examples

Get only the active links

```js
var links = u('a').filter('.active');
```

Get all of the paragraphs with a link:

```js
var paragraphs = u('p').filter(function(node){
  return u(node).find('a').length > 0;
});
```

Get only the inputs with an answer above 5 and show an error:

```js
u('input').filter(function(node, i){
  if (parseInt(u(node).first().value) > 5) {
    return true;
  }
}).addClass('error');
```


### Related

[.is()](#is) check whether one or more of the nodes is of one type

[.not()](#not) remove all the nodes that match the criteria
## .find()

Get all of the descendants of the nodes with an optional filter

```js
.find(filter);
```


### Parameters

`filter`: a string containing a selector that nodes must pass or a function that return a boolean. See [.filter()](#filter) for a better explanation



### Return

An instance of Umbrella with the new children as nodes



### Examples

Get all of the links within all the paragraphs

```js
u("p").find('a');
```

Get the required fields within a submitting form:

```js
u('form').on('submit', function(e){
  var required = u(this).find('[required]');
});
```



### Related

[.closest()](#closest) get the first ascendant that matches the selector

[.parent()](#parent) get all of the direct parents

[.children()](#find) get the direct child of the matched nodes

## .first()

Retrieve the first of the matched nodes

```js
.first();
```


### Parameters

This method doesn't accept any parameters


### Return

The first html node or false if there is none.



### Examples

Retrieve the first element of a list:

```js
var next = u("ul.demo li").first();
```



### Related

[.last()](#last) retrieve the last matched element
## ajax() fn

Function (not method) that allows performing ajax requests. The implementation is somewhat similar to [nanoajax](https://github.com/yanatan16/nanoajax):

```js
var action = '/save';
var options = { body: 'a=b' };
var after = function(err, data){ console.log(data); };
var before = function(xhr){};

ajax(action, options, after, before);
```


### Parameters

`action`: the place where to send the ajax request

`options`: an object that sets the options to be passed. These are:

- `method = 'GET'`: the way to send the request. It can be GET or POST
- `body = ''`: a string on the `a=b&c=d` format or a simple object that will be converted
- `headers = {}`: an object with `{ key: value }` headers to be manually set

`after`: the callback to be called when the request has been sent and parsed. The first parameter is an error that can be null, and the second one the parsed data in JSON or the unparsed data as an string.

`before`: a callback that can be called just before sending the request. It receives the XHR object as the first parameter.

### Return

Returns the already sent XHR object.


### Tips

You can modify the XHR object straight by using the *before* callback. It is called just before sending the request, after setting all its parameters:

```js
ajax('/save', {}, after, function(xhr){
  xhr.responseType = 'json';
});
```

## .handle()

This function is the same as [`on()`](#on), but it executes the `e.preventDefault()` so you don't need to do it. So these two are exactly the same:

```js
u('form.login').on('submit', function(e){
  e.preventDefault();
  // logic
});
```

```js
u('form.login').handle('submit', function(e){
  // logic
});
```

### Related

[.on()](#on) Calls a function when an event is triggered

[.trigger()](#trigger) calls an event on all of the matched nodes

[.off()](#off) Removes an event from  matched nodes

## .hasClass()

Find if any of the matched elements contains the class passed:

```js
.hasClass('name1');
.hasClass('name1 name2 nameN');
.hasClass('name1,name2,nameN');
.hasClass('name1', 'name2', 'nameN');
.hasClass(['name1', 'name2', 'nameN']);
.hasClass(['name1', 'name2'], ['name3'], ['nameN']);
.hasClass(function(){ return 'name1'; });
.hasClass(function(){ return 'name1'; }, function(){ return 'name2'; });
```

If more than one class is passed, they are checked **with the AND condition** similar to:

```js
u("a").hasClass("button") && u("a").hasClass("primary");
```


### Parameters

`name1`, `name2`, `nameN`: the class name (or variable containing it) to be matched to any of the matched elements. It accepts many different types of parameters (see above).


### Return

**`boolean`**: returns true if all of the passed classes are found in any of the matched elements and false if they couldn't be found.



### Example

You can also check manually if it has several classes with the OR parameter with:

```js
u('a').is('.button, .primary');
```

And with the AND parameter:

```js
u('a').is('.button.primary');
```


Toggle the color of a button depending on the status

```html
<a class="example button">Click me</a>

<script src="//umbrellajs.com/umbrella.min.js"></script>
<script>
  u(".example").on('click', function() {
    if(u(this).hasClass("error")) {
      u(this).removeClass("error").html("Click me");
    } else {
      u(this).addClass("error").html("Confirm");
    }
  });
</script>
```


### Related

[.addClass()](#addclass) adds html class(es) to each of the matched elements.

[.removeClass()](#removeclass) deletes class(es) from the matched elements.

## .html()

Retrieve or set the html of the elements:


```js
// GET
.html();

// SET
.html(html);
```


### Parameters

*GET*
should pass no parameter so it retrieves the html.

*SET*
`html`: the new value that you want to set. To remove it, pass an empty string: `""`



### Return

*GET*
`string`: the html of the first node

*SET*
`u`: returns the same instance of Umbrella JS



### Examples

Get the main title:

```js
var title = u('h1').html();
```

Set the main title:

```js
u('h1').html('Hello world');
```


### Related

[.text()](#attr) Retrieve or set the textContent of the elements

[.attr()](#attr) Handle attributes for the matched elements

## .is()

Check whether any of the nodes matches the selector

```js
.is('a')
.is(u('a'))
.is(function(){ return Math.random() > 0.5 })
```



### Parameters

`filter`: it can be two things:
  - css selector to check
  - instance of umbrella with the elements to check
  - function that returns a boolean to check for each of the nodes. If one of them returns true, then the method `is()` returns true. It accepts two parameters, `node` and `index`, and the context of `this` is the instance of umbrella so methods like `this.slice()` are available.



### Return

*boolean*: *true* if any of the nodes matches the selector or the function returns true, false otherwise.



### Examples

Check if the current form needs to be valdated

```js
u('form.subscribe').ajax(false, function() {

  // Same as u('form.subscribe').hasClass('validate')
  if (u('form.subscribe').is('.validate')) {
    validate();
  }
});
```



### Related

[.filter()](#filter) remove unwanted nodes

[.not()](#not) remove all the nodes that match the criteria
## .last()

Get the last element from a list of elements.

```js
.last();
```


### Parameters

This method doesn't accept any parameters


### Return

The last html node or false if there is none.



### Examples

Retrieve the last element of a list:

```js
var next = u("ul.demo li").last();
```



### Related

[.first()](#first) retrieve the first matched element

## .map()

Change the content of the current instance by looping each element

```js
.map(function(){});
```


### Parameters

A single callback that returns the element(s) that are going to be kept:

```js
var links = u('.special li').map(function(node, i){
  if (parseInt(node.innerHTML) > 10) {
    return '<a>' + u(node).data('id') + '</a>';
  }
}).addClass('expensive');
```

It can return a value that evaluates to false, a single element, an string, an array or an Umbrella instance. It will **remove duplicated nodes** from the result.

> Note: Umbrella JS is made to manipulate HTML nodes so it will consider the string "" and 0 as false and remove them. Return an HTML node or an HTML string to keep the elements.



### Return

An instance of Umbrella with the nodes passed



### Examples

Get the parent elements (see [.parent()](#parent)):

```js
var lists = u('li').map(function(node){ return node.parentNode });
```



### Related

[.each()](#each) loop all the elements without changing them

## .not()

Remove known nodes from nodes

```js
.not('a')
.not(u('a'))
.not(function(node){ return Math.random() > 0.5; })
```


### Parameters

`not`: it can be two things (in order):
  - css selector that each of the nodes must **not** match to stay
  - instance of umbrella with the element to remove
  - function that returns `true` to remove the element. It accepts **one parameter**, and the context of `this` is the instance of umbrella so methods like `this.slice()` are available

```js
.not(function(node){
  // your code
});
```



### Examples

```html
<ul class="menu">
    <li><a class="active">Menu item 1</a></li>
    <li><a>Menu item 2</a></li>
    <li><a>Menu item 3</a></li>
</ul>
```

Get only the non-active links on paragraphs

```js
var nonactive_links = u('.menu a').not('.active');
```

Get all of the active:

```js
active_links = u('.menu a').not(nonactive_links);
```


### Related

[.is()](#is) check whether one or more of the nodes is of one type

[.filter()](#filter) Remove unwanted nodes

## .off()

Remove event handler from matched nodes

```js
.off('event1')
.off('event1 event2 eventN')
.off('event1,event2,eventN')
.off(['event1', 'event2', 'eventN'])
```


### Parameters

`event`:
  Any number of events (such as click, mouseover)

`listener`:
  Function reference to remove from the events



### Examples

```html
<ul>
  <li class="off-single-test">1</li>
  <li class="off-multiple-test">2</li>
  <li class="off-multiple-test">3</li>
</ul>
```

```js
const listener = function() {
  alert('called');
}

//Add listener
u('.off-multiple-test').on('click', listener);
//Trigger event
u('.off-multiple-test').trigger('click'); //Alert appears
//Remove listener
u('.off-multiple-test').off('click', listener);
//Trigger event
u('.off-multiple-test').trigger('click'); //No alert
```

### Related

[.on()](#on) Attaches an event to matched nodes

[.handle()](#handle) Same as `.on()`, but it prevents the default action

[.trigger()](#trigger) Triggers an event on all of the matched nodes

## .on()

Calls a function when an event is triggered

```js
.on('event1', callback)
.on('event1 event2 eventN', callback)
.on('event1,event2,eventN', callback)
.on(['event1', 'event2', 'eventN'], callback)
.on('event1', 'selector', callback)
```



### Parameters

`event1`, `event2`, `eventN`: the name(s) of the events to listen for actions, such as `click`, `submit`, `change`, etc.

`callback`: function that will be called when the event is triggered. The parameters it accepts are `function(e, data1, data2, ..., dataN)`:

  - `e`: the event that was triggered. It has some interesting properties:

    - `e.currentTarget`: Contains the element that triggered the event.
    - `e.preventDefault()`: Avoids the browser from performing the default action.
    - `e.details`: an array of the argument data passed to `trigger()` if it was passed with that function. See other arguments:

  - `data1`, `data2`, `dataN`: the arguments that were passed to `trigger()` if it was called with that function.

Another way is doing event delegation, for which the parameters are:

`event1`, `event2`, `eventN`: same as before

`selector`: a css selector that matches the nodes that will trigger it

`callback`: same as before


### Return

Umbrella instance



### Examples

An auto-save feature that submits the form through ajax every 10 seconds

```js
// Show 'test' when the button test is clicked
u('button.test').on('click', function(e) {
  alert("Test");
});

// This example is very similar to .ajax() implementation
u('form.test').on('submit', function(e){

  // Avoid submitting the form normally
  e.preventDefault();

  // Submit the form through ajax
  ajax(u(this).attr('action'), u(this).serialize());
});

// Better 'onchange':
u('input').on('change click blur paste', function(){
  console.log("Maybe changed");
});
```



### Related

[.handle()](#off) Same as `.on()`, but it prevents the default action

[.trigger()](#trigger) calls an event on all of the matched nodes

[.off()](#off) Removes an event from  matched nodes

## .parent()

Retrieve each parent of the matched nodes, optionally filtered by a selector

```js
.parent()
.parent('p')
.parent(u('p'))
.parent(function(node, i){})
```


### Parameters

`selector`: Optional filter argument for the parents



### Examples

Retrieve all of the parents of `<li>` in the page:

```js
u('li').parent();
```

Retrieve all the paragraphs that have a link as a direct child

```js
u('a').parent('p');
```


### Related

[.children()](#parent) get all of the direct children

[.find()](#find) get all of the descendants of the matched nodes

[.closest()](#closest) get the first ascendant that matches the selector
## .prepend()

Add some html as a child at the beginning of each of the matched elements.

```js
.prepend(html)

.prepend('<div>')
.prepend(u('<div>'))
.prepend(u('<div>').first()) // Same as document.createElement('div')
.prepend(u('<div></div><div></div>').nodes)
.prepend(function(){})
.prepend(function(el){}, elements)
.prepend(function(el){}, 10)
```



### Parameters

`html = ""`:
  - Any of these elements:
    - **string** containing the html that is going to be inserted
    - **instance of Umbrella**
    - **HTML node**
    - **array** containing HTML nodes
  - A callback that returns any of the previous. It gets passed these parameters:
    - **el**: the current element from the elements parameter, {} if none is specified and i if elements is number
    - **i**: the index of the current element

`elements = [{}]` (optional): It can be any of the following:
  - An array of elements that will be passed to the callback. The callback is executed once per element, and all of them are added consecutively.
  - A css selector, so the function will be executed once per matched element.
  - A number, in which case the function will be executed that number of times



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Add a header to each of the articles

```js
u("article").prepend("<header>Hello world</header>");
```

Add three elements at the beginning of the list. All of these methods are equivalent:

```js
// Add them all like a single string
u("ul").prepend("<li>One</li><li>Two</li><li>Three</li>");

// Add them in a chain
u("ul").prepend("<li>Three</li>").append("<li>Two</li>").append("<li>One</li>");

// Add them with a function parameter
var cb = function(txt){ return "<li>" + txt + "</li>" };
u("ul").prepend(cb, ["One", "Two", "Three"]);

// Same as the previous one but with ES6
u("ul").prepend(txt => `<li>${ txt }</li>`, ["One", "Two", "Three"]);
```

They all result in:

```html
<ul>
  <li>One</li>
  <li>Two</li>
  <li>Three</li>

  <!-- previous data -->
</ul>
```

You can also add some events to them by creating an html node:

```js
function greeting(){ alert("Hello world"); }

u("a.main").prepend(function(){
  return u('<a>').addClass('hi').on('click', greeting).html("Greetings!");
});
```



### Related

[.append()](#append) Add some html as a child at the end of each of the matched elements

[.before()](#before) Add some html before each of the matched elements.

[.after()](#after) Add some html as a sibling after each of the matched elements.

## .remove()

Removes the matched elements.

```js
.remove();
```


### Parameters

This method doesn't accept any parameters


### Return

`u`: Returns an instance of Umbrella JS with the removed nodes.


### Examples

Remove all the elements of a list:

```js
u("ul.demo li").remove();
```

## .removeClass()

Remove html class(es) to all of the matched elements.

```js
.removeClass('name1');
.removeClass('name1 name2 nameN');
.removeClass('name1,name2,nameN');
.removeClass('name1', 'name2', 'nameN');
.removeClass(['name1', 'name2', 'nameN']);
.removeClass(['name1', 'name2'], ['name3'], ['nameN']);
.removeClass(function(){ return 'name1'; });
.removeClass(function(){ return 'name1'; }, function(){ return 'name2'; });
```


### Parameters

`name1`, `name2`, `nameN`: the class name (or variable containing it) to be removed to all of the matched elements. It accepts many different types of parameters (see above).



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Remove the class `main` to all the `<h2>` from the page:

```js
u("h2").removeClass("main");
```

Remove the class `toValidate` and `ajaxify` to all the `<form>` present in the page:

```js
u("form").removeClass("toValidate", "ajaxify");
```

### Related

[.addClass()](#addclass) adds class(es) from the matched elements.

[.hasClass()](#hasclass) finds if the matched elements contain the class(es)

## .replace()

Replace the matched elements with the passed argument.

```js
.replace();
```

### Parameters

The parameter can be any of these types:
  - string:  html tag like `<div>`
  - function: a function which returns an html tag.


### Return

The newly created element.



### Examples

Replace elements with class 'save' by a button with class 'update':

```js
u('.save').replace('<button class="update">Update</button>');
```

Replace element button by a link with class 'button':

```js
u('button').replace(function(btn){
  return '<a class="button">' + btn.innerHTML + '</a>';
});
```

## .scroll()

Scroll to the first matched element, smoothly if supported.

```js
.scroll()
```


### Examples

Scroll to the first `<li>` in the page:

```js
u('li').scroll();
```

On click event, scroll the first `<section>` element with the class "team":

```js
u('a.team').on('click', function(e){
  e.preventDefault();
  u('section.team').scroll();
});
```

## .serialize()

Converts a form into a string to be sent:

```js
.serialize()
```

> Note: multiple-select are not supported in Internet Explorer, [similarly to jQuery](https://github.com/jquery/jquery-mobile/issues/3947)

## .siblings()

Get the siblings of all of the nodes with an optional filter

```js
.siblings(selector);
```


### Parameters

`selector`: a string containing a selector that nodes must pass or a function that return a boolean. See [.filter()](#selector) for a better explanation



### Return

`u`: returns an instance of Umbrella JS with the new siblings as nodes



### Examples

Get the all the siblings of the hovered `<li>`

```js
u("li:hover").siblings('li:first-child');
```

Get all the siblings

```js
u("li").siblings();
```



### Related

[.parent()](#parent) get all of the direct parents

[.find()](#find) get all of the descendants of the matched nodes

[.closest()](#closest) get the first ascendant that matches the selector

[.children()](#closest) get the direct children of all of the nodes with an optional filter

## .size()

Get the [bounding client rect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of the first matched element. This has height, width, top, left, right and bottom properties

```js
.size()
```

### Parameters

None


### Return

Returns a simple object with the following properties referring to the first matched element:

- left
- right
- top
- height
- bottom
- width




### Examples

```js
u('body').size();
// {"left":0,"right":400,"top":0,"height":300,"bottom":300,"width":400}
```

## .text()

Retrieve or set the text content of matched elements:


```js
// GET
.text();

// SET
.text(text);
```


### Parameters

*GET*
should pass no parameter so it retrieves the text from the first matched element.

*SET*
`html`: the new text content that you want to set for all of the matched elements. To remove it, pass an empty string: `""`



### Return

*GET*
`string`: the text content of the first matched element

*SET*
`u`: returns the same instance of Umbrella JS



### Examples

Get the main title text:

```js
var title = u('h1').text();
```

Set the main title text:

```js
u('h1').text('Hello world');
```


### Related

[.html()](#html) Retrieve or set the HTML of matched elements

## .toggleClass()

Toggles html class(es) to all of the matched elements.

```js
.toggleClass('name1');
.toggleClass('name1 name2 nameN');
.toggleClass('name1,name2,nameN');
.toggleClass(['name1', 'name2', 'nameN']);
.toggleClass('name1', forceAdd);
```

### Parameters

`name1`, `name2`, `nameN`: the class name (or variable containing it) to be toggled to all of the matched elements. It accepts many different types of parameters (see above).

`forceAdd`: boolean telling the method whether to force an `.addClass()` (true) or `.removeClass()` (false).



### Return

`u`: returns the same instance of Umbrella JS



### Examples

Add the class `main` to all the `<h2>` from the page:

```js
u("h2").toggleClass("main");
```

Add the class `toValidate` and remove `ajaxify` from the element `<form class="ajaxify">` present in the page:

```js
u("form.ajaxify").toggleClass("toValidate ajaxify");
```

Force an `.addClass()` on the element `<h2>` from the page:

```js
u("h2").toggleClass("main", true);
```

Note however that this last example by itself doesn't make much sense as you could just use `addClass()` instead. It makes a lot more sense when the second parameter is checked dynamically:

```js
u("h2").toggleClass("main", u('.accept').is(':checked'));
```



### Related

[.addClass()](#addclass) adds class(es) from the matched elements.

[.removeClass()](#removeclass) deletes class(es) from the matched elements.

[.hasClass()](#hasclass) finds if the matched elements contain the class(es)

## .trigger()

Calls an event on all of the matched nodes

```js
.trigger('event1', data)
.trigger('event1 event2 eventN', data1, data2, dataN)
.trigger('event1,event2,eventN', data1, data2, dataN)
.trigger(['event1', 'event2', 'eventN'], data1, data2, dataN)
```



### Parameters

`event1`, `event2`, `eventN`: the name(s) of the events to listen for actions, such as `click`, `submit`, `change`, etc.

`data1`, `data2`, `dataN` (optional): the data that will be passed to the event listener in the `e.details` variable and as arguments.


### Return

Umbrella instance



### Examples

An auto-save feature that submits the form through ajax every 10 seconds

```js
// Make the form to submit through ajax
u('form.edit').ajax();

// Submit it every 10s
setInterval(function(){
  u('form.edit').trigger('submit');
}, 10000);
```


### Related

[.on()](#on) add an event listener to the matched nodes

[.handle()](#off) Same as `.on()`, but it prevents the default action

[.off()](#off) Removes an event from matched nodes

## .wrap()

Wraps the matched element(s) with the passed argument. The argument gets processed with the constructor u() and it accepts an html tag like ```.wrap('<div>')```

```js
.wrap(selector);
```


### Parameters

`selector`: a formatted string of the desired selector. For example ```.wrap('<div>')```. Nested selectors are supported in a similar way to [jQuery wrap](http://api.jquery.com/wrap/). For example ```.wrap('<div class="a1"><div class="b1"><div class="c1"></div></div></div>')```. Matched element(s) will be wrapped with innermost node of the first child of a nested argument. See examples below.



### Return

`u`: returns an instance of Umbrella JS with the wrapped node(s)



### Examples

Wrap an element in an html element:

Original element:
```html
<button class="example">Link1</button>
```

```js
u(".example").wrap('<a class="wrapper">');
```

Result:
```html
<a class="wrapper">
  <button class="example">Link1</button>
</a>
```

Wrap an element in an html element and chain umbrella.js methods:

```js
u(".example").wrap('<a>').attr({class: "wrapper", href: "http://google.com"});
```

Result:
```html
<a href="http://google.com" class="wrapper">
  <button class="example">Link1</button>
</a>
```

Wrap several elements in an html element

```html
<button class="example">Link1</button>
<button class="example">Link2</button>
<button class="example">Link3</button>

```

```js
u(".example").wrap('<a>').attr({class: "wrapper", href: "http://google.com"});
```

Result:
```html
<a href="http://google.com" class="wrapper">
  <button class="example">Link1</button>
</a>
<a href="http://google.com" class="wrapper">
  <button class="example">Link2</button>
</a>
<a href="http://google.com" class="wrapper">
  <button class="example">Link3</button>
</a>
```

Nested selector arguments:

```html
<button class="example">Link1</button>
```

```js
u(".example").wrap('<div class="a1"><div class="b1"><div class="c1"></div></div></div>');
```

Result:
```html
<div class="a1">
	<div class="b1">
		<div class="c1">
			<a href="http://google.com" class="wrapper">
			  <button class="example">Link1</button>
			</a>
		</div>
	</div>
</div>
```

Nested selector arguments with multiple child nodes:

```html
<button class="example">Link1</button>
```

```js
u(".example").wrap('<div class="a1"><div class="b1"><div class="c1"></div></div><div class="b2"><div class="c2"><div class="d1"></div></div></div></div>');
```

Result:
```html
<div class="a1">
	<div class="b1">
		<div class="c1">
			<a href="http://google.com" class="wrapper">
			  <button class="example">Link1</button>
			</a>
		</div>
	</div>
	<div class="b2">
		<div class="c2">
			<div class="d1"></div>
		</div>
	</div>
</div>
```
