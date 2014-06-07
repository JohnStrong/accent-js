/**
 *	ACCENT.JS: multi language code highlighting library
 *	
 *	Description:
 *		implemented in javascript, this project aims to be a simple multi language code highlighting library,
 *		taking stylistic influence from various popular text editors
 *
 *		I do NOT intend to implement highlighting for all languages or even most
 **/


// TODO generalize language object to parse regexp patterns with generic function
;( function() {

	'use strict';

	/**
	 *	supported languages namespace
	 *
	 *	return expressions and corresponding identifier for each feature of supported language
	 * 	e.g. 'lolcode' -> { 'hai' : [_expression, _identifier], ... }
	 **/
	var _language = {};

	_language['javascript'] = ( function() {

		// remove previous parser nodes
		// highlight with syntax class
		var _highlightIgnoreRest = function(syntaxClass) {
			return function(match) {	
				var escaped = match.replace(/\<span\s+class=acc-js.*?>(.*?)<\/span>/g, '$1');
				return '<span class='.concat(syntaxClass,'>',escaped,'</span>');
			};
		},

		_escapeWith = function(replacement) {
			return function() {
				return replacement;
			};
		};

		return {

			// escape open html tag
			'escapeHTMLOpen': [
				/</g,
				_escapeWith('&lt;')
			],

			// regexp literals
			'regExp': [
				/(\/.+?\/(\s|,|\]|;|\/|g|i|m|y))/g, 
 				'<span class=acc-js-regexp>$1</span>'
 			],

			// common language operators such as conditionals and loops
			'operation': [
				/\b(if|else|continue|switch|case|default|break|return|for|try|catch|throw)(?=[^\w])/g, 
				'<span class=acc-js-operation>$1</span>'
			],

			// variable assignment keywords
			'declaration': [
				/(\bfunction|var|const|in|new|this|prototype)(?=[^\w])/g, 
				'<span class=acc-js-declaration>$1</span>'
			],

			// frequently used methods
			'specials': [
				/(\.\bgetElementById|getElementsBy(ClassName|TagName|Name)|(type|instance)of|hasOwnProperty)/g, 
				'<span class=acc-js-special>$1</span>'
			],

			// common dom methods
			'dom methods': [
				/(\.\binnerHTML|createElement|parentNode|innerHTML|(append|replace)Child)(?=[^\w])/g,
				'<span class=acc-js-dom>$1</span>'
			],

			// globals [window]
			'global': [
				/\b(window|console|document)/g,
				'<span class=acc-js-global>$1</span>'
			],

			// basic types and special type checking keywords
			'types': [
				/([^\w])\b(Array|String|Function|Object|Number|Date|Boolean|Error|RegExp|Math|null|undefined|true|false)(?=[^\w])/g, 
				'$1<span class=acc-js-type>$2</span>'
			],

			// numeric values (including hexadecimal)
			'number': [
				/(-{0,1}\d+\.{0,1}\d+|-{0,1}0x\w+)(?=[^\w])/g, 
				'<span class=acc-js-numeric>$1</span>'
			],


			// double/single qouted string
			'string': [
				/(".*?"|'.*?')/g, 
				_highlightIgnoreRest('acc-js-string')
			],

			// comments
			'inlineCom': [
				/(\/{2}.*?\n+|\/\*(.|[\r\n])*\*\/)/g,
				_highlightIgnoreRest('acc-js-comment')
			]
		};
		
	} )();

	// formats the code content with a default theme
	var _format = ( function() {
		
		// formats dom node by wrapping it with a HTML pre node
		var _wrapWith = function(domNode, wrapper) {
			var parent = domNode.parentNode,
				pre = document.createElement(wrapper);

				parent.replaceChild(pre, domNode);
				pre.appendChild(domNode);
		};

		return function(domNode, theme) {

			// wrap with pre formatter tag
			_wrapWith(domNode, 'pre');

			// add theme to pre wrapper
			domNode.parentNode.className = 'acc-'.concat(theme);

		};

	} )(),

	// parses element text body according to the selected language property rules (see language)
	_parse = ( function() {

		var _byFeature = function(textBody, langFeature) {
			return textBody.replace(langFeature[0], langFeature[1]);
		};

		
		// return highlighted text of given dom node for given language
		return function(domNode, lang) {
			
			var textBody = domNode.innerHTML;
			
			// apply language highlighting rules to text
			for(var feature in lang) {
				if(lang.hasOwnProperty(feature)) {	
					textBody = _byFeature(textBody, lang[feature]);
				}
			}
			
			// replace plain node text body with highlighted text body
			domNode.innerHTML = textBody;
		};

	} )(),


	// outward facing reference
	// clean up closure functionality, implment a less general condition evaluation function
	accent = ( function(format, parse, language) {

		var _defaultTheme = ['dark', 'light'],

		_errors = {
			_illegalArgumentsError:'both identifier and language parameters must be strings',
			_unknownThemeError: 'theme must be a known preset'.concat(' [', _defaultTheme, ']')
		},
		
		// reliable way to check type of accent function arguments
		_is = function(obj, type) {
			var clas = Object.prototype.toString.call(obj).slice(8, -1);
			return clas === type;
		};

		return function(identifier, lang, theme) {

			var config = {},

			// basic input validation of function params

			isidentifierString = _is(identifier, 'String'),
			isLangString = _is(lang, 'String');
			
			if(isidentifierString && isLangString) {
				config.elems = document.getElementsByClassName(identifier);
				config.lang = language[lang];
			} else {
				throw new Error(_errors._illegalArgumentsError);
			}

			// check if a valid theme has been selected

			config.theme = _defaultTheme.filter(function(preset) {
				return preset === theme;
			})[0];

			if(config.theme === undefined) {
				throw new Error(_errors._unknownThemeError);
			}


			// format and parse each selected dom node
			for(var ith = 0; ith < config.elems.length; ith++) {

				var current = config.elems[ith];

				format(current, config.theme);
				parse(current, config.lang);
			};
		};

	})(_format, _parse, _language);

	window.accent = accent;

} )();