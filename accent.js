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

	/**
	 *	supported languages namespace
	 *
	 *	returns expressions and syntax wrappers for each specified language feature
	 * 	
	 *	e.g. language = { feature[String] : [ expression[Regexp], wrapper[String] ], ... }
	 **/
	var _language = {};

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
	_language['javascript'] = {

		// common language operators such as conditionals and loops
		'operation': [
			/\b(if|else|continue|switch|case|default|break|return|for|try|catch|throw)(?=[^\w])/g, 
			_language.util.highlight('js-operation')
		],

		// variable assignment keywords
		'declaration': [
			/(\bfunction|var|const|in|new|this|prototype)(?=[^\w])/g, 
			_language.util.highlight('js-declaration')
		],

		// frequently used methods
		'specials': [
			/(\.\bgetElementById|getElementsBy(ClassName|TagName|Name)|(type|instance)of|hasOwnProperty)/g, 
			_language.util.highlight('js-special')
		],

		// common dom methods
		'dom methods': [
			/(\.\binnerHTML|createElement|parentNode|innerHTML|(append|replace)Child)(?=[^\w])/g,
			_language.util.highlight('js-dom')
		],

		// globals [window]
		'global': [
			/\b(window|console|document)/g,
			_language.util.highlight('js-global')
		],

		// basic types and special type checking keywords
		'types': [
			/\b(Array|String|Function|Object|Number|Date|Boolean|Error|RegExp|Math|null|undefined|true|false)(?=[^\w])/g, 
			_language.util.highlight('js-type')
		],

		// numeric values (including hexadecimal)
		'number': [
			/(-{0,1}\d+\.{0,1}\d+|-{0,1}0x\w+)(?=[^\w])/g, 
			_language.util.highlight('js-numeric')
		],

		// double/single qouted string
		'string': [
			/(".*?"|'.*?')/g, 
			_language.util.ignoreNot('js-string')
		],

		// comments
		'inlineCom': [
			/(\/{2}.*?\n+|\/\*(.|[\r\n])*\*\/)/g,
			_language.util.ignoreNot('js-comment')
		],

		// regexp literals
		'regExp': [
			/[^<](\/.+?\/(\s|,|\]|;|\/|g|i|m|y))/g,
			_language.util.ignoreNot('js-regexp')
		],
	};


	// primary syntax highlighter namespace
	var _accent = {};

	// formats the code content with a default theme
	_accent['format'] = ( function() {
		
		// formats dom node by wrapping it with a HTML pre node
		var _wrapWith = function(domNode, wrapper) {
			var parent = domNode.parentNode,
				pre = document.createElement(wrapper);

				parent.replaceChild(pre, domNode);
				pre.appendChild(domNode);
		};

		return function(domNode) {

			// wrap with pre formatter tag
			_wrapWith(domNode, 'pre');

			// prefix theme with the acc flag
			domNode.parentNode.className = 'acc-'.concat(this.theme);
		};

	} )();

	// parses element text body according to the selected language property rules (see language)
	_accent['parse'] = ( function() {

		var _byFeature = function(textBody, langFeature) {
			return textBody.replace(langFeature[0], langFeature[1]);
		};
		
		// return highlighted text of given dom node for given language
		return function(domNode) {
			
			var textBody = domNode.innerHTML,
				lang = this.lang;

			
			// apply language highlighting rules to text
			for(var feature in lang) {
				if(lang.hasOwnProperty(feature)) {	
					textBody = _byFeature(textBody, lang[feature]);
				}
			}
			
			// replace plain node text body with highlighted text body
			domNode.innerHTML = textBody;
		};

	} )();

	// runner mathod for accent sytax highlighting
	_accent['highlight'] = function(config) {
	
		var self = this;

		return function(node) {
			self.format.call(config, node);
			self.parse.call(config, node);
		};
	};


	// outward facing reference
	// clean up closure functionality, implment a less general condition evaluation function
	var accent = ( function(accent, language) {

		var _errors = {
			illegalArgumentsError: 'both identifier and language parameters must be strings'
		},
		
		// reliable way to check type of accent function arguments
		_is = function(obj, type) {
			var clas = Object.prototype.toString.call(obj).slice(8, -1);
			return clas === type;
		};

		// add option param
		return function(identifier, lang, theme) {

			var config = {},
				_acc,

			// basic input validation of function params
			isidentifierString = _is(identifier, 'String'),
			isLangString = _is(lang, 'String'),
			isThemeString = _is(theme, 'String');
			
			if(isidentifierString && isLangString && isThemeString) {
				config.elems = document.getElementsByClassName(identifier);
				config.lang = language[lang];
				config.theme = theme;
			} else {
				throw new Error(_errors.illegalArgumentsError);
			}

			_acc = accent['highlight'](config);
			config.elems.forEach(_acc);
		};

	})(_accent, _language);

	window.accent = accent;

} )();