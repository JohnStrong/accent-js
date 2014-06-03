/**
 *	ACCENT.JS: multi language code highlighting library
 *	
 *	Description:
 *		implemented in javascript, this project aims to be a simple multi language code highlighting library,
 *		taking stylistic influence from various popular text editors
 *
 *		I do NOT intend to implement highlighting for all languages or even most
 **/

;(function() {

	'use strict';

	// return expressions and corresponding identifier for each feature of supported language
	// e.g. 'lolcode' -> { 'hai' : [_expression, _identifier], ... }
	var _language = {

		'javascript': {

			// escape special characters
			'htmlOpenTag': [/</g, '&lt'],
			'htmlCloseTag': [/>/g, '&gt'],

			// regular expression literals: fix...
			'regExp': [
				/(\/.+?\/(g|i|m|y){0,1})/g, 
				'<span class=js-regexp>$1</span>'
			],

			// double qouted trhing
			'doubleStr': [
				/"(.*?)"/g, 
				'<span class=js-double-str>"$1"</span>'
			],

			// single qouted string
			'singleStr': [
				/'(.*?)'/g, 
				'<span class=js-single-str>\'$1\'</span>'
			],

			// common language operators such as conditionals and loops
			'operation': [
				/\b(if|else|continue|switch|case|default|break|return|for|try|catch)(?=[^\w])/g, 
				'<span class=js-operation><span class=js-keyword>$1</span></span>'
			],

			// variable assignment keywords
			'declaration': [
				/([^.]\bfunction|var|const|in|new|this|prototype)(?=[^\w])/g, 
				'<span class=js-declaration><span class=js-keyword>$1</span></span>'
			],

			// frequently used document methods
			'specials': [
				/(\.\bgetElementById|getElementsBy(ClassName|TagName|Name)|(type|instance)of)/g, 
				'<span class=js-special>$1</span>'
			],

			// basic types and special type checking keywords
			'types': [
				/\b(Array|String|Function|Object|Number|Date|Boolean|Error|RegExp|Math|null|undefined|true|false)/g, 
				'<span class=js-type>$1</span>'
			],

			// numeric values
			'number': [
				/(-{0,1}\d+\.{0,1}\d+)(?=[^\w])/g, 
				'<span class=js-numeric>$1</span>'
			],

			// hexadecimal bitwise
			'hexadecimal': [
				/(-{0,1}0x\w+)/g,
				'<span class=js-numeric>$1</span>'
			],

			// inline comments
			'inlineCom': [
				/(\/{2}.*?\n+)/g, 
				'<span class=js-comment>$1</span>'
			],

			// multiple line comments
			'multiLineCom': [
				/(\/\*(.|[\r\n])*\*\/)/g, 
				'<span class=js-comment>$1</span>'
			],
		}
	},

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
				textBody = _byFeature(textBody, lang[feature]);
			}
			
			// replace plain node text body with highlighted text body
			domNode.innerHTML = textBody;
		};

	})(),


	// outward facing reference
	// clean up closure functionality, implment a less general condition evaluation function
	accent = ( function(parse, language) {

		var _illegalArgumentsError = 'both identifier and language parameters must be strings',

		// TODO: make it more useful!!!!
		_is = function(args, condition) {
			return condition(args);
		},

		// formats dom node by wrapping it with a HTML pre node
		_wrapWithPre = function(domNode) {
			var parent = domNode.parentNode,
				pre = document.createElement('pre');

				parent.replaceChild(pre, domNode);
				pre.appendChild(domNode);
		};

		return function(identifier, lang) {

			var config = {},

			// basic input validation of function params

			isidentifierString = _is(identifier, function(_class) {
				return (_class && typeof _class === 'string');
			}),

			isLangString = _is(lang, function(_ln) {
				return (_ln && typeof _ln === 'string');
			});
			
			if(isidentifierString && isLangString) {
				config.elems = document.getElementsByClassName(identifier);
				config.lang = language[lang];
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

				// format the current node
				if(!isNodePreformatted) {
					_wrapWithPre(current);
				}

				parse(current, config.lang);
			};
		};

	})(_parse, _language);

	window.accent = accent;

})();