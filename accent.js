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

	// return expressions and corresponding identifier for each feature of supported language
	// e.g. 'lolcode' -> { 'hai' : [_expression, _identifier], ... }
	var _language = ( function() {

		// removes accewnt syntax highlighting spans from string
		var forgetAccent = /\<span\s+class=acc-js.*?>(.*?)<\/span>/g;

		return {

		'javascript': {

			// escape html open/close tags
			'EscapeHTML': [
				/[<>]/g,
				function(match) {
					var escaped = '&lt;';

					if(match === '>') { escaped = '&gt;' }

					return escaped;
				}
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
				function(match) {

					// remove previous parsers nodes
					var escaped = match.replace(forgetAccent, '$1');

					// add string highlighting
					return '<span class=acc-js-string>' + escaped + '</span>';
				}
			],

			// comments
			'inlineCom': [
				/(\/{2}.*?\n+|\/\*(.|[\r\n])*\*\/)/g,
				function(match) {

					// remove previous parser nodes
					var escaped = match.replace(forgetAccent, '$1');

					// add comment highlighting
					return '<span class=acc-js-comment>' + escaped + '</span>';
				}
			]
		}

		};

	} )(),

	// formats the code content with a default theme
	_format = ( function() {

		var defaultTheme = 'acc-dark',

		// formats dom node by wrapping it with a HTML pre node
		 _wrapWith = function(domNode, wrapper) {
			var parent = domNode.parentNode,
				pre = document.createElement(wrapper);

				parent.replaceChild(pre, domNode);
				pre.appendChild(domNode);
		};

		return function(domNode) {

			// wrap with pre formatter tag
			_wrapWith(domNode, 'pre');

			// add theme to pre wrapper
			domNode.parentNode.className = defaultTheme;

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

		var _illegalArgumentsError = 'both identifier and language parameters must be strings',
		
		// reliable way to check type of accent function arguments
		_is = function(obj, type) {
			var clas = Object.prototype.toString.call(obj).slice(8, -1);
			return clas === type;
		};

		return function(identifier, lang) {

			var config = {},

			// basic input validation of function params

			isidentifierString = _is(identifier, 'String'),
			isLangString = _is(lang, 'String');
			
			if(isidentifierString && isLangString) {
				config.elems = document.getElementsByClassName(identifier);
				config.lang = language[lang];
			} else {
				throw new Error(_illegalArgumentsError);
			}


			// format and parse each selected dom node

			for(var ith = 0; ith < config.elems.length; ith++) {

				var current = config.elems[ith];

				format(current);
				
				parse(current, config.lang);
			};
		};

	})(_format, _parse, _language);

	window.accent = accent;

} )();