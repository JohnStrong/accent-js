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

<pre>
	<code>
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
	</code>
</pre>

### test.html

<pre>
	<code>
	&lt;code class="test"&gt;
		for(var ith = 0; ith &lt; 100; i++) {
			console.log(me.firstname, me.surname, me.age);
	}
	&lt;/code&gt;
	</code>
</pre>

### test.js

<pre>
	<code>
		accent('test', 'javascript', 'custom');
	</code>
</pre>

### result

!["javascript syntax with custom theme"](/examples/javascriptShortCustomTheme.PNG "javascript syntax with custom theme")

