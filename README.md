accent-js
=========

simple multi language code highlighting library implemented in javascript

## Dark theme
`accent('myClassName', 'myLanguage', 'dark')`
!["javascript syntax with dark theme"](/examples/javascriptThemeDark.PNG "javascript syntax with dark theme")

## Light theme 
`accent('myClassName', 'myLanguage', 'light')`
!["javascript syntax with light theme"](/examples/javascriptThemeLight.PNG "javascript syntax with light theme")

## Custom theme
You can add your own custom theme by prefixing a css class with 'acc' and overloading the properties you wish to customize.
<br/>
Below contains an example project in which the user has created a css file describing custom properties for highlighting the syntax of a javascript code block.

### custom.css

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

### test.html

<code>
&lt;code class="test"&gt;
	for(var ith = 0; ith &lt; 100; i++) {
		console.log(me.firstname, me.surname, me.age);
}
</code>

### test.js

`accent('test', 'javascript', 'custom');`

### result

!["javascript syntax with custom theme"](/examples/javascriptCustomTheme.PNG "javascript syntax with custom theme")

