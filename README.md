accent-js
=========

Easy to use, customizable, code highlighting library Implemented with JavaScript & CSS.

## Dark theme
`accent('myClassName', 'javascript', 'dark')`
!["javascript syntax with dark theme"](/examples/javascriptThemeDark.PNG "javascript syntax with dark theme")

## Light theme 
`accent('myClassName', 'javascript', 'light')`
!["javascript syntax with light theme"](/examples/javascriptThemeLight.PNG "javascript syntax with light theme")

## Muddy theme
`accent('myClassName', 'javascript', 'muddy')`
!["javascript syntax with muddy theme"](/examples/javascriptThemeMuddy.PNG "javascript syntax with muddy theme")

## Custom theme
You can add your own custom theme by prefixing a css class with 'acc' and overloading the properties you wish to customize.
<br/>
Below contains an example project in which the user has created a css file describing custom properties for highlighting the syntax of a javascript code block.

### custom.css

```css
.acc-custom {
	background-color: #101;
	color: #CCC;
}

.acc-custom .js-string,
.acc-custom .js-type {
	color: #949;
}

.acc-custom .js-declaration, 
.acc-custom .js-operation, 
.acc-custom .js-special {
	color: #797;
	font-weight: bold !important;
}

.acc-custom .js-global {
	color: #737;
	font-weight: bold !important;
}

.acc-custom .js-comment {
	color: #555;
	font-style: italic !important;
}

.acc-custom .js-regexp {
	color: #A84;
}
 
.acc-custom .js-numeric {
	color: #FD5;
}
```

### test.html

```html
&lt;code class="test"&gt;
	for(var ith = 0; ith &lt; 100; i++) {
		console.log(me.firstname, me.surname, me.age);
	}	
&lt;/code&gt;
```

### test.js

```javascript
accent('test', 'javascript', 'custom');
```

### result

!["javascript syntax with custom theme"](/examples/javascriptShortCustomTheme.PNG "javascript syntax with custom theme")

## License

The MIT License (MIT)

Copyright (c) 2014 John Strong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

