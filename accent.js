/**
 *	ACCENT.JS: multi language code highlighting library
 *	
 *	Description:
 *		implemented in javascript, this project aims to be a simple multi language code highlighting library,
 *		taking stylistic influence from various popular text editors
 **/


// TODO generalize language object to parse regexp patterns with generic function
;( function() {

	'use strict';

	// allows for a more functionally pure iterations on Dom node collections
	NodeList.prototype.forEach =
		HTMLCollection.prototype.forEach = 
			Array.prototype.forEach;

	//+ _compose :: array(function) -> function -> any
	var _compose = function() {
		var fns = Array.prototype.slice.call(arguments);

		return function(arg) {
			return fns.reduce(function(arg, fn) {
				return fn(arg);
			}, arg);
		};
	},

	/**
	 *	supported languages namespaces
	 *	returns expressions and syntax wrappers for each specified language feature
	 **/
	_language = {};

	// helper methods for parsers of language features
	_language['util'] = {

		// surrounds a string in a span with the class property specified
		highlight: function(syntaxClass) {
			return function(match) {
				return '<span class='.concat(syntaxClass, '>', match, '</span>');
			};
		},

		// remove syntax node that do not match the specified class
		// i.e. ignoreNot('js-operation') removes all nodes of a string that do not match 'js-operation '
		ignoreNot: function(syntaxClass) {
			
			var self = this;

			return function(match) {	
				var escaped = match.replace(/\<span\s+class=.*?>(.*?)<\/span>/g, '$1');
				return self.highlight(syntaxClass)(escaped);
			};
		}
	};

	// the javascript language parser
	_language['javascript'] = [

		// common language operators such as conditionals and loops
		[
			/\b(if|else|continue|switch|case|default|break|return|for|try|catch|throw)(?=[^\w])/g, 
			_language.util.highlight('js-operation')
		],

		// variable assignment keywords
		[
			/(\bfunction|var|const|in|new|this|prototype)(?=[^\w])/g, 
			_language.util.highlight('js-declaration')
		],

		// frequently used methods
		[
			/(\.\bgetElementById|getElementsBy(ClassName|TagName|Name)|(type|instance)of|hasOwnProperty)/g, 
			_language.util.highlight('js-special')
		],

		// common dom methods
		[
			/(\.\binnerHTML|createElement|parentNode|innerHTML|(append|replace)Child)(?=[^\w])/g,
			_language.util.highlight('js-dom')
		],

		// globals [window]
		[
			/\b(window|console|document)/g,
			_language.util.highlight('js-global')
		],

		// basic types and special type checking keywords
		[
			/\b(Array|String|Function|Object|Number|Date|Boolean|Error|RegExp|Math|null|undefined|true|false)(?=[^\w])/g, 
			_language.util.highlight('js-type')
		],

		// numeric values (including hexadecimal)
		[
			/(-{0,1}\d+\.{0,1}\d+|-{0,1}0x\w+)(?=[^\w])/g, 
			_language.util.highlight('js-numeric')
		],

		// double/single qouted string
		[
			/(".*?"|'.*?')/g, 
			_language.util.ignoreNot('js-string')
		],

		// comments
		[
			/(\/{2}.*?\n+|\/\*(.|[\r\n])*\*\/)/g,
			_language.util.ignoreNot('js-comment')
		],

		// regexp literals
		[
			/[^<](\/.+?\/(\s|,|\]|;|\/|g|i|m|y))/g,
			_language.util.ignoreNot('js-regexp')
		],
	];

	// formats the code content with a default theme
	var _format = function(theme) {
		return function(node) {
			// wrap with pre formatter tag
			var parent = node.parentNode,
			pre = document.createElement('pre');

			parent.replaceChild(pre, node);
			pre.appendChild(node);

			// prefix theme with the acc flag
			node.parentNode.className = 'acc-'.concat(theme);

			return node;
		};
	},

	// parses element text body according to the selected language property rules (see language)
	_parse = function(lang) {
		return function(node) {
			node.innerHTML = lang.reduce(function(textBody, grammer) {
				return textBody.replace(grammer[0], grammer[1]);
			}, node.innerHTML);

			return node;
		};
	},

	// outward facing reference
	// clean up closure functionality, implment a less general condition evaluation function
	accent = (function() {

		// reliable way to check type of accent function arguments
		var _is = function(obj, type) {
			var clas = Object.prototype.toString.call(obj).slice(8, -1);
			return clas === type;
		},

		_highlight = function(lang, theme) {
			return function(elem) {
				_compose(_format(theme), _parse(lang))(elem);
			};
		};

		// add option param
		return function(identifier, lang, theme) {

			// basic input validation of function params
			var isidentifierString = _is(identifier, 'String'),
			isLangString = _is(lang, 'String'),
			isThemeString = _is(theme, 'String');
			
			if(isidentifierString && isLangString && isThemeString) {
				
				var elems = document.getElementsByClassName(identifier),
				begin = _highlight(_language[lang], theme);
				elems.forEach(begin);

			} else {
				throw new TypeError('both identifier and language parameters must be strings');
			}
		};

	})();

	/**
	 *	usage => accent(_className, _language, _theme)
	 *		_className	:= the class property used to identify the node(s) for highlighting
	 *		_language	:= the language that the class node(s) describe
	 *		_theme		:=	the theme (default or custom) accent will use to apply properties to the node(s)
	 **/
	window.accent = accent;

} )();