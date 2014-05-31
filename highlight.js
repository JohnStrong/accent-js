/**
 *	ACCENT.JS: multi language code highlighting library
 *	
 *	Description:
 *		implemented in javascript, this project aims to be a simple multi language code highlighting library,
 *		taking stylistic influence from various popular text editors
 *
 *		I do NOT intend to implement highlighting for all languages or even most.
 *
 *		I plan to implement code highlighting for JavaScript, Node? and Erlang
 **/

;(function() {

	'use strict';

	// return expressions and corresponding class for each feature of supported language
	// e.g. 'lolcode' -> { 'hai' : [_expression, _class], ... }
	var _language = {

		'javascript': {

			// regular expression literals
			'regExp': [/(\/.*\/(\w+))(?=[^\s])/g, '<span class=js-regexp>$1</span>'],

			// inline comments
			'inlineCom': [/(\/{2}.*?\n+)/g, '<span class=js-comment-il>$1</span>'],

			// multiple line comments
			'multiLineCom': [/(\/\*(.|[\r\n])*\*\/)/g, '<span class=js-comment-ml>$1</span>'],

			// double qouted trhing
			'doubleStr': [/"(.*?)"/g, '<span class=js-double-str>"$1"</span>'],

			// single qouted string
			'singleStr': [/'(.*?)'/g, '<span class=js-single-str>\'$1\'</span>'],

			// common language operators such as conditionals and loops
			'basicOps': [/\b(if|else|continue|switch|case|default|break|return|for)(?=[^\w])/g, '<span class=js-basic>$1</span>'],

			// variable assignment keywords
			'assignment': [/\b(function|var|const|in|new)(?=[^\w])/g, '<span class=js-assignment>$1</span>'],

			// function arguments
			// 'args': [/////]

			// global javascript objects/packages
			'global': [/\b(console|document|location|history|localStorage|Math|window)/g, '<span class=js-global>$1</span>'],

			// empty\NULL valued keywords
			'empty': [/\b(null|undefined)/g, '<span class=js-empty>$1</span>'],

			// basic types and special type checking keywords
			'types': [/\b(Array|String|Function|Object|Number|Date|Error|typeof|instanceof)/g, '<span class=js-types>$1</span>'],

			// numeric values
			'numberLiteral': [/(\d)/g, '<span class=js-numeric>$1</span>']
		}
	},

	// parses element text body according to the selected language property rules (see _language)
	_parse = ( function() {

		var _byFeature = function(textBody, langFeature) {
			return textBody.replace(langFeature[0], langFeature[1]);
		};

		// to comment
		return function(elem, lang) {
			
			var textBody = elem.innerHTML;
			
			// apply language highlighting rules to text
			for(var feature in lang) {
				textBody = _byFeature(textBody, lang[feature]);
			}
			
			elem.innerHTML = textBody;
		};

	})(),


	// outward facing reference
	// clean up closure functionality, implment a less general condition evaluation function
	highlight = ( function(parse, language) {

		var _illegalArgumentsError = 'both class and language parameters must be strings',

		// TODO: make it more useful!!!!
		_is = function(args, condition) {
			return !!condition(args);
		};

		return function(_class, _lang) {

			var config = {},

			// basic input validation of function params

			isClassString = _is(_class, function(_cl) {
				return (_cl && typeof _cl === 'string');
			}),

			isLangString = _is(_lang, function(_ln) {
				return (_ln && typeof _ln === 'string');
			});
			
			if(isClassString && isLangString) {
				config.elems = document.getElementsByClassName(_class);
				config.lang = language[_lang];
			} else {
				throw new Error(_illegalArgumentsError);
			}


			// parse and highlight each selected dom element

			for(var ith = 0; ith < config.elems.length; ith++) {

				var current = config.elems[ith],

					// check whether node needs to be preformatted (check out HTML PRE)
					isNodePreformatted = _is(current.parentNode.nodeName, function(_name) {
						return _name === 'PRE';
					});

				parse(current, config.lang);
			};
		};

	})(_parse, _language);

	window.highlight = highlight;

})();