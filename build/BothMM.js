var BothMM =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	// Copyright (C) 2015 Logi Ragnarsson <logi@logi.org>
	
	// Ensure that console.log and console.error don't cause errors
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var console = window.console || {};
	console.log = console.log || function () {};
	console.error = console.error || console.log;
	
	// Private state
	
	var readyListeners = [];
	var becListeners = [];
	var aecListeners = [];
	
	/**
	 * Library to allow Burmese-language web content to be authored in both Zawgyi and Unicode and to be viewed by users
	 * whichever font/encoding they have configured in their browsers.
	 *
	 * It initially has a very limited set of members, until the library has properly initialised. Those members are
	 * documented as such.
	 */
	
	var BothMM = (function () {
	    function BothMM() {
	        _classCallCheck(this, BothMM);
	    }
	
	    _createClass(BothMM, null, [{
	        key: 'ready',
	
	        /**
	         * Call the passed-in function when the BothMM library is whenReady. This is guaranteed to also be after the DOM is
	         * initialised.
	         * @param f
	         */
	        value: function ready(f) {
	            if (readyListeners) {
	                readyListeners.push(f);
	            } else {
	                setTimeout(f, 0);
	            }
	        }
	    }, {
	        key: 'hasFont',
	
	        /**
	         * Tests whether a given font is installed in the user's browser.
	         * @param {string} font The name of the font to test for
	         * @returns {boolean} Whether the font is available
	         */
	        value: function hasFont(font) {
	            /* Works by constructing a <div/> with some text in the requested font,
	             * but either "sans-serif" or "monospace" as the backup font. If the font
	             * exists, the browser will use that font and both elements have the same
	             * width. If the font does not exist, the fallback fonts have very
	             * different widths. */
	
	            var node = document.createElement('div');
	            node.innerHTML = '<span style="position:absolute!important;width:auto!important;font-size:100px!important;left:-999px">. . .</span>';
	            node = node.firstChild;
	
	            node.style.fontFamily = font + ', sans-serif';
	            document.body.appendChild(node);
	            var widthOrSans = node.clientWidth;
	            node.style.fontFamily = font + ', monospace';
	            var widthOrMono = node.clientWidth;
	            document.body.removeChild(node);
	
	            console.log(font, widthOrSans == widthOrMono ? 'exists' : 'is bogus', widthOrSans, widthOrMono);
	            return widthOrSans == widthOrMono;
	        }
	    }, {
	        key: 'beforeEncodingChange',
	
	        /**
	         * Register function to call before the encoding is changed.
	         * If the function throws an exception, then the change will be aborted. */
	        value: function beforeEncodingChange(f) {
	            becListeners.push(f);
	        }
	    }, {
	        key: 'afterEncodingChange',
	
	        /**
	         * Register function to call after the encoding has been changed.
	         * If the function throws an exception, then the change will be aborted. */
	        value: function afterEncodingChange(f) {
	            aecListeners.push(f);
	        }
	    }, {
	        key: 'setEncoding',
	
	        /**
	         *  Set the target encoding and translate all discovered element.
	         *  @param {string=} encoding Change to this encoding or omit to refresh translation.
	         */
	        value: function setEncoding(encoding) {
	            if (encoding === undefined) {
	                encoding = BothMM.encoding;
	            }
	            var before = BothMM.encoding;
	            for (var i = 0; i < becListeners.length; i++) {
	                becListeners[i](before, encoding);
	            }
	            BothMM.encoding = encoding;
	            translateSub('off', BothMM.roots);
	
	            setCookie('BothMM.encoding', encoding, '/');
	            for (i = 0; i < aecListeners.length; i++) {
	                try {
	                    aecListeners[i](before, encoding);
	                } catch (e) {
	                    console.error(e);
	                }
	            }
	        }
	    }]);
	
	    return BothMM;
	})();
	
	/**
	 * The library version according to <a href="http://semver.org/">semver</a> semantics.
	 *
	 * This member is available during initialisation.
	 */
	BothMM.VERSION = '0.0.1';
	
	/**
	 * The DOM elements to translate. Defaults to anything with a [both-mm] attribute,
	 * unless it is nested within another such element. */
	BothMM.roots = [];
	
	///////////////////////////////////////////////////////////////////
	// Utility functions
	
	var stringConverterMap = { // TODO: Implement actual text translation
	    zawgyi_unicode: function zawgyi_unicode(s) {
	        // Silly translator that puts _underline_ on each word.
	        return s.replace(/((\s|^)+)([^\s$]+)/g, '$1[$3]');
	    },
	    unicode_zawgyi: function unicode_zawgyi(s) {
	        // Silly translator that puts _underline_ on each word.
	        return s.replace(/((\s|^)+)([^\s$]+)/g, '$1[$3]');
	    },
	    no_op: function no_op(s) {
	        return s;
	    }
	};
	
	/**
	 * Find all nodes on page with a given attribute
	 *
	 * @param {string} an
	 * @returns {Array<Element> | NodeList}
	 */
	function findWithAttr(an) {
	    if (typeof document.querySelectorAll == 'function') {
	        return document.querySelectorAll('[' + an + ']');
	    } else {
	        var all = document.getElementsByTagName('*');
	        var marked = [];
	        for (var i = 0; i < all.length; i++) {
	            if (all[i].getAttribute(an)) {
	                marked.push(all[i]);
	            }
	        }
	    }
	    return marked;
	}
	
	/**
	 * Filters a list of Nodes, discarding the ones with an ancestor having a particular attribute
	 * @param {string} an
	 * @param {Array<Element> | NodeList} elms
	 * @returns {Array<Element>}
	 */
	function discardIfAncestorAttr(an, elms) {
	    var good = [];
	    for (var i = 0; i < elms.length; i++) {
	        var elm = elms[i];
	        for (var p = elm.parentNode; p && p.getAttribute; p = p.parentNode) {
	            //console.log('>', p);
	            if (p.getAttribute(an)) {
	                elm = null;
	            }
	        }
	        if (elm) {
	            good.push(elm);
	        }
	    }
	    return good;
	}
	
	/**
	 * Recursively translate a list of elements.
	 *
	 * @param encSrcParent Encoding source inherited from parents. This may be overridden in children.
	 * @param elms List of elements to translate.
	 */
	function translateSub(encSrcParent, elms) {
	    var encTgt = BothMM.encoding;
	    for (var i = 0; i < elms.length; i++) {
	        var elm = elms[i];
	
	        if (elm.nodeType == 3) {
	            // It's a text node, so let's do some actual text conversion
	            if (!elm.__raw) elm.__raw = elm.nodeValue;
	            var cvtKey = encSrcParent + '_' + encTgt;
	            //console.log(cvtKey, elm);
	            var cvt = stringConverterMap[cvtKey] || stringConverterMap.no_op;
	            elm.nodeValue = cvt(elm.__raw);
	            // TODO: Update on DOMCharacterDataModified  -- fallback to setInterval?
	        } else {
	            // No text here. Update settings and recurse
	            var encSrcSel = elm.getAttribute('both-mm') || encSrcParent;
	            var encTgtEff = encSrcSel == 'off' ? 'off' : encTgt != encSrcSel ? encTgt : 'off';
	            //console.log(encSrcParent, encSrcSel, "->", encTgt, encTgtEff, elm);
	            elm.setAttribute('both-mm-now', encTgtEff);
	            translateSub(encSrcSel, elm.childNodes);
	        }
	    }
	}
	
	function getCookie(key) {
	    return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
	}
	
	function setCookie(key, value, path) {
	    document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value) + '; expires=Fri, 31 Dec 9999 23:59:59 GMT' + (path ? '; path=' + path : '');
	}
	
	// INITIALISE WHEN DOM IS READY
	
	/** Initialise BothMM state when DOM is whenReady. */
	function onDomReady() {
	
	    /**
	     * Whether the Zawgyi-One font is available in the user's browser.
	     * @type {bool}
	     */
	    BothMM.zawgyiFont = BothMM.hasFont('Zawgyi-One');
	
	    /**
	     * Translate elements to use this presentation.
	     * @type {string} (zawgyi|unicode|off)
	     */
	    BothMM.encoding = getCookie('BothMM.encoding') || (BothMM.zawgyiFont ? 'zawgyi' : 'unicode');
	
	    BothMM.roots = discardIfAncestorAttr('both-mm', findWithAttr('both-mm'));
	    console.log('BothMM.roots discovered:', BothMM.roots.length);
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;
	
	    try {
	        for (var _iterator = BothMM.roots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var root = _step.value;
	
	            console.log('  ', root);
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator['return']) {
	                _iterator['return']();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }
	
	    // Translate all the discovered elements
	    BothMM.setEncoding();
	
	    // Change the encoding when any element with the "both-mm-select" attribute is clicked
	    var selectors = findWithAttr('both-mm-select');
	    for (var i = 0; i < selectors.length; i++) {
	        selectors[i].addEventListener('click', function (evt) {
	            var encoding = evt.target.getAttribute('both-mm-select');
	            BothMM.setEncoding(encoding);
	        });
	    }
	
	    // Notify listeners that we are ready
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;
	
	    try {
	        for (var _iterator2 = readyListeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var listener = _step2.value;
	
	            try {
	                listener();
	            } catch (e) {
	                console.error(e);
	            }
	        }
	    } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                _iterator2['return']();
	            }
	        } finally {
	            if (_didIteratorError2) {
	                throw _iteratorError2;
	            }
	        }
	    }
	
	    readyListeners = undefined;
	}
	
	(function ready() {
	    if (document.readyState === 'complete') {
	        setTimeout(onDomReady, 1);
	    } else if (document.addEventListener) {
	        document.addEventListener('DOMContentLoaded', onDomReady);
	    } else {
	        setTimeout(ready, 20);
	    }
	})();
	
	exports['default'] = BothMM;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=BothMM.js.map