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
/***/ function(module, exports, __webpack_require__) {

	// Copyright (C) 2015 Logi Ragnarsson <logi@logi.org>
	// License: GNU Lesser General Public License, version 2.1 or later.
	// http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _tlsConverter = __webpack_require__(1);
	
	var _utils = __webpack_require__(2);
	
	// Private state
	
	var readyListeners = [];
	var becListeners = [];
	var aecListeners = [];
	
	/**
	 * Library to allow Burmese-language web content to be authored in both Zawgyi-One and Unicode and to be viewed by users
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
	                    _utils.console.error(e);
	                }
	            }
	        }
	    }]);
	
	    return BothMM;
	})();
	
	exports['default'] = BothMM;
	
	/**
	 * The library version according to <a href="http://semver.org/">semver</a> semantics.
	 *
	 * This member is available during initialisation.
	 */
	BothMM.VERSION = '0.1.0';
	
	/**
	 * The DOM elements to translate. Defaults to anything with a [both-mm] attribute,
	 * unless it is nested within another such element. */
	BothMM.roots = [];
	
	/**
	 * Re-export the convert function
	 * @type {convert}
	 */
	BothMM.convert = _tlsConverter.convert;
	
	///////////////////////////////////////////////////////////////////
	// Utility functions
	
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
	 * @param encSrc Encoding source inherited from parents. This may be overridden in children.
	 * @param elms List of elements to translate.
	 */
	function translateSub(encSrc, elms) {
	    var encTgt = BothMM.encoding;
	    for (var i = 0; i < elms.length; i++) {
	        var elm = elms[i];
	
	        if (elm.nodeType == 3) {
	            // It's a text node, so let's do some actual text conversion
	            if (!elm.__raw) {
	                // TODO: Brittle
	                elm.__raw = elm.nodeValue;
	            }
	            elm.nodeValue = (0, _tlsConverter.convert)(encSrc, encTgt, elm.__raw);
	        } else {
	            // No text here. Update settings and recurse
	            var encSrcSel = elm.getAttribute('both-mm') || encSrc;
	            var encTgtEff = encSrcSel == 'off' ? 'off' : encTgt != encSrcSel ? encTgt : 'off';
	            //console.log(encSrc, encSrcSel, "->", encTgt, encTgtEff, elm);
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
	    var i;
	
	    /**
	     * Whether the Zawgyi-One font is available in the user's browser.
	     * @type {bool}
	     */
	    BothMM.zawgyiOneFont = BothMM.hasFont('Zawgyi-One');
	
	    /**
	     * Translate elements to use this presentation.
	     * @type {string} (zawgyi-one|unicode|off)
	     */
	    BothMM.encoding = getCookie('BothMM.encoding') || 'unicode';
	
	    BothMM.roots = discardIfAncestorAttr('both-mm', findWithAttr('both-mm'));
	    _utils.console.log('BothMM.roots discovered:', BothMM.roots.length);
	    for (i = 0; i < BothMM.roots; i++) {
	        _utils.console.log('  ', BothMM.roots[i]);
	    }
	
	    // Translate all the discovered elements
	    BothMM.setEncoding();
	
	    // Change the encoding when any element with the "both-mm-select" attribute is clicked
	    var selectors = findWithAttr('both-mm-select');
	    for (i = 0; i < selectors.length; i++) {
	        selectors[i].addEventListener('click', function (evt) {
	            var encoding = evt.target.getAttribute('both-mm-select');
	            BothMM.setEncoding(encoding);
	        });
	    }
	
	    // Notify listeners that we are ready
	    for (i = 0; i < readyListeners.length; i++) {
	        try {
	            readyListeners[i]();
	        } catch (e) {
	            _utils.console.error(e);
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
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright (C) 2010 Keith Stribley http://www.ThanLwinSoft.org/
	// Copyright (C) 2015 Logi Ragnarsson <logi@logi.org>
	// License: GNU Lesser General Public License, version 2.1 or later.
	// http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	exports.convert = convert;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _utils = __webpack_require__(2);
	
	var _specs = __webpack_require__(3);
	
	var _specs2 = _interopRequireDefault(_specs);
	
	// Static tables other than the encoding specs
	
	var UNICODE_SEQUENCE = ['kinzi', null, 'lig', null, 'cons', 'stack', 'asat', 'yapin', 'yayit', 'wasway', 'hatoh', 'eVowel', 'uVowel', 'lVowel', 'anusvara', 'aVowel', 'lDot', 'asat', 'lDot', 'visarga'];
	// null is used as a place holder for the ((lig)|((cons)|(numbers)(stack)?)) groups
	var LEGACY_SEQUENCE = ['eVowel', 'yayit', null, 'lig', null, 'cons', 'stack', 'kinzi', 'uVowel', 'anusvara', 'asat', 'stack', 'yapin', 'wasway', 'hatoh', 'wasway', 'yapin', 'kinzi', 'uVowel', 'lDot', 'lVowel', 'lDot', 'anusvara', 'uVowel', 'lVowel', 'aVowel', 'stack', 'lDot', 'visarga', 'asat', 'lDot', 'visarga', 'lDot'];
	
	/**
	 * Class to handle converting Myanmar (Burmese) text to/from Myanmar Unicode 5.1.
	 * Myanmar Unicode text is assumed to conform to UTN11r3.
	 * @param spec - hierarchical maps for each component of syllable for Unicode to legacy conversion
	 */
	
	var Converter = (function () {
	    function Converter(spec) {
	        _classCallCheck(this, Converter);
	
	        this.spec = spec;
	        this.useZwsp = false;
	        this.sourceEncoding = spec.fonts[0];
	        this.unicodePattern = this.buildRegExp(UNICODE_SEQUENCE, true);
	        this.legacyPattern = this.buildRegExp(LEGACY_SEQUENCE, false);
	        this.fontFamily = spec.fonts.join(', ');
	    }
	
	    _createClass(Converter, [{
	        key: 'buildRegExp',
	        value: function buildRegExp(sequence, isUnicode) {
	            var i, j, k;
	
	            var pattern = '';
	            var escapeRe = new RegExp('([\\^\\$\\\\\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|])', 'g');
	            if (!this.reverse) {
	                this.reverse = {};
	            }
	            if (!this.minCodePoint) {
	                this.minCodePoint = this.spec['cons']['က'].charCodeAt(0);
	                this.maxCodePoint = this.minCodePoint;
	            }
	            for (i = 0; i < sequence.length; i++) {
	                var alternates = [];
	                if (sequence[i] == null) {
	                    continue;
	                }
	                if (this.reverse[sequence[i]] == null) {
	                    this.reverse[sequence[i]] = {};
	                }
	                for (j in this.spec[sequence[i]]) {
	                    if (this.spec[sequence[i]][j] && this.spec[sequence[i]][j].length > 0) {
	                        for (k = 0; k < this.spec[sequence[i]][j].length; k++) {
	                            var codePoint = this.spec[sequence[i]][j].charCodeAt(k);
	                            if (codePoint != 0x20) {
	                                if (codePoint > this.maxCodePoint) {
	                                    this.maxCodePoint = codePoint;
	                                }
	                                if (codePoint < this.minCodePoint) {
	                                    this.minCodePoint = codePoint;
	                                }
	                            }
	                        }
	                        if (isUnicode) {
	                            // items with an underscore suffix are not put into the regexp
	                            // but they are used to build the legacy to unicode map
	                            var underscore = j.indexOf('_');
	                            if (underscore == -1) {
	                                this.reverse[sequence[i]][this.spec[sequence[i]][j]] = j;
	                                alternates.push(j.replace(escapeRe, '\\$1'));
	                            } else {
	                                this.reverse[sequence[i]][this.spec[sequence[i]][j]] = j.substring(0, underscore);
	                            }
	                        } else {
	                            var escapedAlternate = this.spec[sequence[i]][j].replace(escapeRe, '\\$1');
	                            alternates.push(escapedAlternate);
	                        }
	                    }
	                }
	                alternates = alternates.sort(Converter.sortLongestFirst);
	                if (sequence[i] == 'cons') {
	                    pattern += '(';
	                } else if (sequence[i] == 'lig') {
	                    pattern += '(';
	                }
	                pattern += '(';
	                var subPattern = '';
	                for (k = 0; k < alternates.length; k++) {
	                    if (k == 0) {
	                        subPattern += alternates[k];
	                    } else {
	                        subPattern += '|' + alternates[k];
	                    }
	                }
	                if (sequence[i] == 'stack') {
	                    this.legacyStackPattern = new RegExp(subPattern);
	                }
	                if (sequence[i] == 'kinzi') {
	                    this.legacyKinziPattern = new RegExp(subPattern);
	                }
	                if (sequence[i] == 'lig') {
	                    this.legacyLigPattern = new RegExp(subPattern);
	                }
	                pattern += subPattern + ')';
	                if (sequence[i] == 'cons') {} else if (sequence[i] == 'lig') {
	                    pattern += '|';
	                } else if (sequence[i] == 'stack' && sequence[i - 1] == 'cons') {
	                    pattern += '?))';
	                } else if (sequence[i] == 'wasway' || sequence[i] == 'hatoh' || sequence[i] == 'uVowel' || sequence[i] == 'lVowel' || sequence[i] == 'aVowel' || sequence[i] == 'lDot' || sequence[i] == 'visarga') {
	                    if (isUnicode) {
	                        pattern += '?';
	                    } else {
	                        pattern += '*';
	                    } // these are frequently multi-typed
	                } else {
	                    pattern += '?';
	                }
	            }
	            /*if (isUnicode) {
	             console.log("unicode pattern: " + pattern);
	             } else {   //^ $ \ . * + ? ( ) [ ] { } |
	             console.log("legacy pattern: " + pattern);
	             }*/
	            return new RegExp(pattern, 'g');
	        }
	    }, {
	        key: 'convertToUnicode',
	
	        /**
	         * Convert text to Unicode
	         * @param inputText in legacy encoding
	         * @return converted text in Unicode 5.1
	         */
	        value: function convertToUnicode(inputText) {
	            return this.convertToUnicodeSyllables(inputText).outputText;
	        }
	    }, {
	        key: 'convertToUnicodeSyllables',
	
	        /**
	         * Convert text to Unicode
	         * @param inputText in legacy encoding
	         * @return converted text in Unicode 5.1
	         */
	        value: function convertToUnicodeSyllables(inputText) {
	            var outputText = '';
	            var syllables = [];
	            var pos = 0;
	            this.legacyPattern.lastIndex = 0;
	            var prevSyllable = null;
	            var match = this.legacyPattern.exec(inputText);
	            while (match) {
	                if (match.index != pos) {
	                    prevSyllable = null;
	                    var nonMatched = inputText.substring(pos, match.index);
	                    outputText += nonMatched;
	                    syllables.push(nonMatched);
	                }
	                pos = this.legacyPattern.lastIndex;
	                //console.log("To Unicode Match: " + match);
	                prevSyllable = this.toUnicodeMapper(inputText, match, prevSyllable);
	                syllables.push(prevSyllable);
	                outputText += prevSyllable;
	                match = this.legacyPattern.exec(inputText);
	            }
	            if (pos < inputText.length) {
	                nonMatched = inputText.substring(pos, inputText.length);
	                outputText += nonMatched;
	                syllables.push(nonMatched);
	            }
	            var ret = {};
	            ret.outputText = outputText;
	            ret.syllables = syllables;
	            return ret;
	        }
	    }, {
	        key: 'toUnicodeMapper',
	
	        /**
	         * @internal
	         */
	        value: function toUnicodeMapper(inputText, matchData, prevSyllable) {
	            var syllable = {};
	            for (var g = 1; g < matchData.length; g++) {
	                var component = LEGACY_SEQUENCE[g - 1];
	                if (component == null || matchData[g] == null) {
	                    continue;
	                }
	                // TODO handle repeated components
	                if (syllable[component]) {
	                    _utils.console.log('Unicode Syllable:' + matchData[0] + ' multiple values ' + syllable[component] + ' / ' + this.reverse[component][matchData[g]]);
	                }
	                syllable[component] = this.reverse[component][matchData[g]];
	                if (!syllable[component]) {
	                    _utils.console.log('Undefined ' + component + ' ' + matchData[g]);
	                }
	                // check a few sequences putting ligature components in right place
	                if (syllable[component].length > 1) {
	                    if (component == 'yapin') {
	                        if (syllable[component].charAt(1) == 'ွ') {
	                            syllable['wasway'] = 'ွ';
	                            if (syllable[component].length > 2) {
	                                if (syllable[component].charAt(2) == 'ှ') {
	                                    syllable['hatoh'] = 'ှ';
	                                } else {
	                                    _utils.console.log('Unhandled yapin ligature: ' + syllable[component]);
	                                }
	                            }
	                            syllable[component] = syllable[component].substring(0, 1);
	                        } else if (syllable[component].charAt(1) == 'ှ' || syllable[component].length > 2) {
	                            syllable['hatoh'] = 'ှ';
	                            syllable[component] = syllable[component].substring(0, 1);
	                        }
	                    } else if (component == 'yayit') {
	                        if (syllable[component].charAt(1) == 'ွ') {
	                            syllable['wasway'] = 'ွ';
	                        } else if (syllable[component].charAt(1) == 'ု') {
	                            syllable['lVowel'] = 'ု';
	                        } else if (syllable[component].charAt(1) == 'ိ' && syllable[component].charAt(2) == 'ု') {
	                            syllable['uVowel'] = 'ိ';
	                            syllable['lVowel'] = 'ု';
	                        } else {
	                            _utils.console.log('unhandled yayit ligature: ' + syllable[component]);
	                        }
	                        syllable[component] = syllable[component].substring(0, 1);
	                    } else if (component == 'wasway') {
	                        syllable['hatoh'] = syllable[component].substring(1, 2);
	                        syllable[component] = syllable[component].substring(0, 1);
	                    } else if (component == 'hatoh') {
	                        syllable['lVowel'] = syllable[component].substring(1, 2);
	                        syllable[component] = syllable[component].substring(0, 1);
	                    } else if (component == 'uVowel') {
	                        syllable['anusvara'] = syllable[component].substring(1, 2);
	                        syllable[component] = syllable[component].substring(0, 1);
	                    } else if (component == 'aVowel') {
	                        syllable['asat'] = syllable[component].substring(1, 2);
	                        syllable[component] = syllable[component].substring(0, 1);
	                    } else if (component == 'kinzi') {
	                        // kinzi is length 3 to start with
	                        if (syllable[component].charAt(3) == 'ံ' || syllable[component].length > 4 && syllable[component].charAt(4) == 'ံ') {
	                            syllable['anusvara'] = 'ံ';
	                        }
	                        if (syllable[component].charAt(3) == 'ိ' || syllable[component].charAt(3) == 'ီ') {
	                            syllable['uVowel'] = syllable[component].charAt(3);
	                        }
	                        syllable[component] = syllable[component].substring(0, 3);
	                    } else if (component == 'cons') {
	                        if (syllable[component].charAt(1) == 'ာ') {
	                            syllable['aVowel'] = syllable[component].charAt(1);
	                            syllable[component] = syllable[component].substring(0, 1);
	                        }
	                    } else if (component == 'stack' || component == 'lig') {} else {
	                        _utils.console.log('unhandled ligature: ' + component + ' ' + syllable[component]);
	                    }
	                }
	            }
	            // now some post processing
	            if (syllable['asat']) {
	                if (!syllable['eVowel'] && (syllable['yayit'] || syllable['yapin'] || syllable['wasway'] || syllable['lVowel'])) {
	                    syllable['contraction'] = syllable['asat'];
	                    delete syllable['asat'];
	                }
	                if (syllable['cons'] == 'ဥ') {
	                    syllable['cons'] = 'ဉ';
	                }
	            }
	            if (syllable['cons'] == 'ဥ' && syllable['uVowel'] == 'ီ') {
	                syllable['cons'] = 'ဦ';
	                delete syllable['uVowel'];
	            } else if (syllable['cons'] == 'စ' && syllable['yapin']) {
	                syllable['cons'] = 'ဈ';
	                delete syllable['yapin'];
	            } else if (syllable['cons'] == 'သ' && syllable['yayit']) {
	                if (syllable['eVowel'] && syllable['aVowel'] && syllable['asat']) {
	                    syllable['cons'] = 'ဪ';
	                    delete syllable['yayit'];
	                    delete syllable['eVowel'];
	                    delete syllable['aVowel'];
	                    delete syllable['asat'];
	                } else {
	                    syllable['cons'] = 'ဩ';
	                    delete syllable['yayit'];
	                }
	            } else if (syllable['cons'] == '၀') {
	                // convert zero to wa except in numbers
	                if (matchData[0].length == 1 && matchData.index > 0 && inputText.charAt(matchData.index - 1) == this.spec['cons']['အ'] || matchData[0].length > 1 && (matchData.index == 0 || inputText.charCodeAt(matchData.index - 1) < 0x1040 || inputText.charCodeAt(matchData.index - 1) > 0x1049) || inputText.length > matchData.index + matchData[0].length && (inputText.charAt(matchData.index + matchData[0].length).match(this.legacyLigPattern) || inputText.charCodeAt(matchData.index + matchData[0].length) >= 0x1000 && inputText.charCodeAt(matchData.index + matchData[0].length) <= 0x1021 || inputText.charAt(matchData.index + matchData[0].length) == this.spec['cons']['ဿ']) || inputText.length > matchData.index + matchData[0].length + 1 && (inputText.charAt(matchData.index + matchData[0].length + 1) == this.spec['asat']['်'] || inputText.charAt(matchData.index + matchData[0].length + 1).match(this.legacyStackPattern) || inputText.charAt(matchData.index + matchData[0].length + 1).match(this.legacyKinziPattern)) || inputText.length > matchData.index + matchData[0].length + 2 && inputText.charAt(matchData.index + matchData[0].length + 2) == this.spec['asat']['်'] && inputText.charAt(matchData.index + matchData[0].length + 1) == this.spec['asat']['့']) {
	                    syllable['cons'] = 'ဝ';
	                }
	            } else if (syllable['cons'] == '၄' && inputText.length >= matchData.index + matchData[0].length + 3) {
	                // check for lagaun
	                if (inputText.substr(matchData.index + matchData[0].length, 3) == this.spec['cons']['င'] + this.spec['asat']['်'] + this.spec['visarga']['း']) {
	                    syllable['cons'] = '၎';
	                }
	            } else if (syllable['cons'] == '၇' && (syllable['eVowel'] || syllable['uVowel'] || syllable['lVowel'] || syllable['anusvara'] || syllable['aVowel'] || syllable['lDot'] || syllable['asat'] || syllable['wasway'] || syllable['hatoh'])) {
	                // check for lagaun
	                // if (inputText.substr(matchData.index + matchData[0].length, 3) ==
	                // this.spec["cons"]["င"] + this.spec["asat"]["်"] + this.spec["visarga"]["း"])
	                syllable['cons'] = 'ရ';
	                _utils.console.log('7 found instead of ရ: ' + inputText);
	            }
	            var outputText = '';
	            if (this.useZwsp && !syllable['kinzi'] && !syllable['lig'] && !syllable['stack'] && !syllable['contraction'] && !syllable['asat'] && prevSyllable != '​အ' && prevSyllable != null) {
	                outputText += '​';
	            }
	            var outputOrder = ['kinzi', 'lig', 'cons', 'numbers', 'stack', 'contraction', 'yapin', 'yayit', 'wasway', 'hatoh', 'eVowel', 'uVowel', 'lVowel', 'anusvara', 'aVowel', 'lDot', 'asat', 'visarga'];
	            for (var i = 0; i < outputOrder.length; i++) {
	                if (syllable[outputOrder[i]]) {
	                    outputText += syllable[outputOrder[i]];
	                }
	            }
	            return outputText;
	        }
	    }, {
	        key: 'convertFromUnicode',
	
	        /**
	         * Convert text from Unicode into a legacy encoding.
	         * @param inputText in Unicode 5.1
	         * @return text in legacy encoding
	         */
	        value: function convertFromUnicode(inputText) {
	            inputText = inputText.replace(/[\u200B\u2060]/g, '');
	            var outputText = '';
	            var pos = 0;
	            this.unicodePattern.lastIndex = 0;
	            var match = this.unicodePattern.exec(inputText);
	            while (match) {
	                outputText += inputText.substring(pos, match.index);
	                pos = this.unicodePattern.lastIndex;
	                //console.log("From Unicode Match: " + match);
	                outputText += this.fromUnicodeMapper(inputText, match);
	                match = this.unicodePattern.exec(inputText);
	            }
	            if (pos < inputText.length) {
	                outputText += inputText.substring(pos, inputText.length);
	            }
	            return outputText;
	        }
	    }, {
	        key: 'fromUnicodeMapper',
	
	        /**
	         * @internal
	         */
	        value: function fromUnicodeMapper(inputText, matchData) {
	            var unicodeSyllable = {};
	            var syllable = {};
	            for (var g = 1; g < matchData.length; g++) {
	                var component = UNICODE_SEQUENCE[g - 1];
	                if (component == null || matchData[g] == null) {
	                    continue;
	                }
	                // TODO handle repeated components
	                if (syllable[component]) {
	                    _utils.console.log('Legacy Syllable:' + matchData[0] + ' ' + component + ' multiple values ' + syllable[component] + ' / ' + this.spec[component][matchData[g]]);
	                }
	                unicodeSyllable[component] = matchData[g];
	                syllable[component] = this.spec[component][matchData[g]];
	            }
	            var key;
	            if (unicodeSyllable['kinzi']) {
	                if (unicodeSyllable['uVowel']) {
	                    if (unicodeSyllable['anusvara']) {
	                        key = unicodeSyllable['kinzi'] + unicodeSyllable['uVowel'] + unicodeSyllable['anusvara'] + '_lig';
	                        if (this.spec['kinzi'][key] && this.spec['kinzi'][key].length) {
	                            syllable['kinzi'] = this.spec['kinzi'][key];
	                            delete syllable['anusvara'];
	                        }
	                    } else {
	                        key = unicodeSyllable['kinzi'] + unicodeSyllable['uVowel'] + '_lig';
	                        if (this.spec['kinzi'][key] && this.spec['kinzi'][key].length) {
	                            syllable['kinzi'] = this.spec['kinzi'][key];
	                            delete syllable['uVowel'];
	                        }
	                    }
	                }
	                if (unicodeSyllable['anusvara']) {
	                    key = unicodeSyllable['kinzi'] + unicodeSyllable['anusvara'] + '_lig';
	                    if (this.spec['kinzi'][key] && this.spec['kinzi'][key].length) {
	                        syllable['kinzi'] = this.spec['kinzi'][key];
	                        delete syllable['anusvara'];
	                    }
	                }
	            }
	            // check for code points which may not have a direct mapping
	            if (unicodeSyllable['cons'] == 'ဉ') {
	                if (unicodeSyllable['asat']) {
	                    syllable['cons'] = this.spec['cons']['ဥ'];
	                } else if (unicodeSyllable['stack']) {
	                    syllable['cons'] = this.spec['cons']['ဉ_alt'];
	                } else if (unicodeSyllable['aVowel'] && this.spec['cons']['ဉာ_lig']) {
	                    syllable['cons'] = this.spec['cons']['ဉာ_lig'];
	                    delete syllable['aVowel'];
	                }
	                // this hatoh can occur with aVowel, so no else
	                if (unicodeSyllable['hatoh']) {
	                    syllable['hatoh'] = this.spec['hatoh']['ှ_small'];
	                }
	            } else if (unicodeSyllable['cons'] == 'ဠ') {
	                if (unicodeSyllable['hatoh']) {
	                    syllable['hatoh'] = this.spec['hatoh']['ှ_small'];
	                }
	            } else if (unicodeSyllable['cons'] == 'ဈ' && this.spec['cons']['ဈ'].length == 0) {
	                syllable['cons'] = this.spec['cons']['စ'];
	                syllable['yapin'] = this.spec['yapin']['ျ'];
	            } else if (unicodeSyllable['cons'] == 'ဩ' && this.spec['cons']['ဩ'].length == 0) {
	                syllable['cons'] = this.spec['cons']['သ'];
	                syllable['yayit'] = this.spec['yayit']['ြ_wide'];
	            } else if (unicodeSyllable['cons'] == 'ဪ' && this.spec['cons']['ဪ'].length == 0) {
	                syllable['cons'] = this.spec['သ'];
	                syllable['yayit'] = this.spec['ြ_wide'];
	                syllable['eVowel'] = this.spec['ေ'];
	                syllable['aVowel'] = this.spec['ာ'];
	                syllable['asat'] = this.spec['်'];
	            } else if (unicodeSyllable['cons'] == '၎င်း' && this.spec['cons']['၎င်း'].length == 0) {
	                if (this.spec['၎'].length) {
	                    syllable['cons'] = this.spec['cons']['၎'] + this.spec['cons']['င'] + this.spec['asat']['်'] + this.spec['visarga']['း'];
	                } else {
	                    syllable['cons'] = this.spec['number']['၄'] + this.spec['cons']['င'] + this.spec['asat']['်'] + this.spec['visarga']['း'];
	                }
	            } else if (unicodeSyllable['cons'] == 'န' || unicodeSyllable['cons'] == 'ည') {
	                if (unicodeSyllable['stack'] || unicodeSyllable['yapin'] || unicodeSyllable['wasway'] || unicodeSyllable['hatoh'] || unicodeSyllable['lVowel']) {
	                    syllable['cons'] = this.spec['cons'][unicodeSyllable['cons'] + '_alt'];
	                }
	            } else if (unicodeSyllable['cons'] == 'ရ') {
	                if (unicodeSyllable['yapin'] || unicodeSyllable['wasway'] || unicodeSyllable['lVowel']) {
	                    syllable['cons'] = this.spec['cons'][unicodeSyllable['cons'] + '_alt'];
	                } else if (unicodeSyllable['hatoh'] && this.spec['cons'][unicodeSyllable['cons'] + '_tall'].length) {
	                    syllable['cons'] = this.spec['cons'][unicodeSyllable['cons'] + '_tall'];
	                }
	            } else if (unicodeSyllable['cons'] == 'ဦ') {
	                if (this.spec['cons']['ဦ'].length == 0) {
	                    syllable['cons'] = this.spec['cons']['ဥ'];
	                    syllable['uVowel'] = this.spec['uVowel']['ီ'];
	                }
	            }
	            // stack with narrow upper cons
	            if ((unicodeSyllable['cons'] == 'ခ' || unicodeSyllable['cons'] == 'ဂ' || unicodeSyllable['cons'] == 'င' || unicodeSyllable['cons'] == 'စ' || unicodeSyllable['cons'] == 'ဎ' || unicodeSyllable['cons'] == 'ဒ' || unicodeSyllable['cons'] == 'ဓ' || unicodeSyllable['cons'] == 'န' || unicodeSyllable['cons'] == 'ပ' || unicodeSyllable['cons'] == 'ဖ' || unicodeSyllable['cons'] == 'ဗ' || unicodeSyllable['cons'] == 'မ' || unicodeSyllable['cons'] == 'ဝ') && unicodeSyllable['stack'] && this.spec['stack'][unicodeSyllable['stack'] + '_narrow'] && this.spec['stack'][unicodeSyllable['stack'] + '_narrow'].length > 0) {
	                syllable['stack'] = this.spec['stack'][unicodeSyllable['stack'] + '_narrow'];
	            }
	            // yapin variants
	            if (unicodeSyllable['yapin'] && (unicodeSyllable['wasway'] || unicodeSyllable['hatoh'])) {
	                if (this.spec['yapin']['ျ_alt'].length) {
	                    syllable['yapin'] = this.spec['yapin']['ျ_alt'];
	                } else // assume we have the ligatures
	                    {
	                        key = 'ျ' + (unicodeSyllable['wasway'] ? 'ွ' : '') + (unicodeSyllable['hatoh'] ? 'ှ' : '') + '_lig';
	                        if (this.spec['yapin'][key]) {
	                            syllable['yapin'] = this.spec['yapin'][key];
	                            if (unicodeSyllable['wasway']) {
	                                delete syllable['wasway'];
	                            }
	                            if (unicodeSyllable['hatoh']) {
	                                delete syllable['hatoh'];
	                            }
	                        } else {
	                            _utils.console.log(key + ' not found');
	                        }
	                    }
	            }
	            if (unicodeSyllable['yayit']) {
	                var widthVariant = '_wide';
	                var upperVariant = '';
	                if (unicodeSyllable['cons'] == 'ခ' || unicodeSyllable['cons'] == 'ဂ' || unicodeSyllable['cons'] == 'င' || unicodeSyllable['cons'] == 'စ' || unicodeSyllable['cons'] == 'ဎ' || unicodeSyllable['cons'] == 'ဒ' || unicodeSyllable['cons'] == 'ဓ' || unicodeSyllable['cons'] == 'န' || unicodeSyllable['cons'] == 'ပ' || unicodeSyllable['cons'] == 'ဖ' || unicodeSyllable['cons'] == 'ဗ' || unicodeSyllable['cons'] == 'မ' || unicodeSyllable['cons'] == 'ဝ') {
	                    widthVariant = '_narrow';
	                }
	                if (unicodeSyllable['uVowel'] || unicodeSyllable['kinzi'] || unicodeSyllable['anusvara']) {
	                    upperVariant = '_upper';
	                }
	                if (unicodeSyllable['wasway']) {
	                    if (unicodeSyllable['hatoh']) {
	                        if (this.spec['wasway']['ွှ_small'].length) {
	                            if (this.spec['yayit']['ြ' + upperVariant + widthVariant].length) {
	                                syllable['yayit'] = this.spec['yayit']['ြ' + upperVariant + widthVariant];
	                            } else {
	                                if (widthVariant == '_narrow') {
	                                    widthVariant = '';
	                                }
	                                syllable['yayit'] = this.spec['yayit']['ြ' + widthVariant];
	                            }
	                            syllable['wasway'] = this.spec['wasway']['ွှ_small'];
	                            delete syllable['hatoh'];
	                        } else if (this.spec['yayit']['ြ_lower' + widthVariant].length) {
	                            if (this.spec['yayit']['ြ_lower' + upperVariant + widthVariant].length) {
	                                syllable['yayit'] = this.spec['yayit']['ြ_lower' + upperVariant + widthVariant];
	                            } else {
	                                syllable['yayit'] = this.spec['yayit']['ြ_lower' + widthVariant];
	                            }
	                        }
	                    } else if (this.spec['yayit']['ြွ' + upperVariant + widthVariant].length) {
	                        syllable['yayit'] = this.spec['yayit']['ြွ' + upperVariant + widthVariant];
	                        delete syllable['wasway'];
	                    } else if (this.spec['yayit']['ြွ' + widthVariant].length) {
	                        syllable['yayit'] = this.spec['yayit']['ြွ' + widthVariant];
	                        delete syllable['wasway'];
	                    } else if (this.spec['yayit']['ြ_lower_wide'].length) {
	                        if (this.spec['yayit']['ြ' + '_lower' + upperVariant + widthVariant].length) {
	                            syllable['yayit'] = this.spec['yayit']['ြ' + '_lower' + upperVariant + widthVariant];
	                        } else {
	                            syllable['yayit'] = this.spec['yayit']['ြ' + '_lower' + widthVariant];
	                        }
	                    }
	                } else if (unicodeSyllable['hatoh']) {
	                    if (upperVariant.length == 0 && widthVariant == '_narrow') {
	                        widthVariant = '';
	                    }
	                    if (this.spec['yayit']['ြ' + upperVariant + widthVariant].length) {
	                        syllable['yayit'] = this.spec['yayit']['ြ' + upperVariant + widthVariant];
	                    } else if (this.spec['yayit']['ြ' + widthVariant].length) {
	                        syllable['yayit'] = this.spec['yayit']['ြ' + widthVariant];
	                    } else {
	                        syllable['yayit'] = this.spec['yayit']['ြ'];
	                    }
	                    syllable['hatoh'] = this.spec['hatoh']['ှ_small'];
	                } else if (unicodeSyllable['lVowel'] == 'ု' && this.spec['yayit']['ြု_wide']) {
	                    if (syllable['uVowel'] == this.spec['uVowel']['ိ'] && this.spec['yayit']['ြို' + widthVariant]) {
	                        syllable['yayit'] = this.spec['yayit']['ြို' + widthVariant];
	                        delete syllable['uVowel'];
	                    } else {
	                        if (this.spec['yayit']['ြု' + upperVariant + widthVariant].length) {
	                            syllable['yayit'] = this.spec['yayit']['ြု' + upperVariant + widthVariant];
	                        } else {
	                            syllable['yayit'] = this.spec['yayit']['ြု' + widthVariant];
	                        }
	                    }
	                    delete syllable['lVowel'];
	                } else {
	                    if (upperVariant.length == 0 && widthVariant == '_narrow') {
	                        widthVariant = '';
	                    }
	                    syllable['yayit'] = this.spec['yayit']['ြ' + upperVariant + widthVariant];
	                }
	            }
	            if (syllable['wasway'] && syllable['hatoh']) {
	                delete syllable['hatoh'];
	                syllable['wasway'] = this.spec['wasway']['ွှ_lig'];
	            }
	            if (syllable['hatoh'] && syllable['lVowel'] && !syllable['yapin'] && !syllable['yayit']) {
	                syllable['hatoh'] = this.spec['hatoh']['ှ' + unicodeSyllable['lVowel'] + '_lig'];
	                delete syllable['lVowel'];
	            }
	            if (syllable['uVowel'] && unicodeSyllable['uVowel'] == 'ိ' && syllable['anusvara'] && unicodeSyllable['anusvara'] == 'ံ') {
	                syllable['uVowel'] = this.spec['uVowel']['ိံ_lig'];
	                delete syllable['anusvara'];
	            }
	            if (syllable['lVowel'] && (unicodeSyllable['yayit'] || unicodeSyllable['yapin'] || unicodeSyllable['wasway'] || unicodeSyllable['hatoh'] || unicodeSyllable['lig'] || unicodeSyllable['stack'] || unicodeSyllable['cons'] == 'ဍ' || unicodeSyllable['cons'] == 'ဋ' || unicodeSyllable['cons'] == 'ဌ' || unicodeSyllable['cons'] == 'ဈ' || unicodeSyllable['cons'] == 'ဥ' || unicodeSyllable['cons'] == 'ဠ')) {
	                syllable['lVowel'] = this.spec['lVowel'][unicodeSyllable['lVowel'] + '_tall'];
	            }
	            if (unicodeSyllable['aVowel'] && unicodeSyllable['asat'] && unicodeSyllable['aVowel'] == 'ါ') {
	                syllable['aVowel'] = this.spec['aVowel']['ါ်_lig'];
	                delete syllable['asat'];
	            }
	            if (unicodeSyllable['lDot'] && (unicodeSyllable['aVowel'] || !(unicodeSyllable['yayit'] || unicodeSyllable['lig'] || unicodeSyllable['stack'] || unicodeSyllable['yapin'] || unicodeSyllable['wasway'] || unicodeSyllable['hatoh'] || unicodeSyllable['lVowel'] || unicodeSyllable['cons'] == 'ဍ' || unicodeSyllable['cons'] == 'ဋ' || unicodeSyllable['cons'] == 'ဌ' || unicodeSyllable['cons'] == 'ဈ' || unicodeSyllable['cons'] == 'ရ'))) {
	                if (unicodeSyllable['cons'] == 'န') {
	                    syllable['lDot'] = this.spec['lDot']['့_alt'];
	                } else {
	                    syllable['lDot'] = this.spec['lDot']['့_left'];
	                }
	            }
	            if (unicodeSyllable['lDot'] && !syllable['yayit'] && !(unicodeSyllable['cons'] == 'ရ') && (syllable['hatoh'] && syllable['hatoh'].length == 1 && !syllable['lVowel'] || syllable['lVowel'] && syllable['lVowel'] == this.spec['lVowel']['ု'])) {
	                syllable['lDot'] = this.spec['lDot']['့_alt'];
	            }
	            if (syllable['asat']) {
	                if (!syllable['eVowel'] && (syllable['yayit'] || syllable['yapin'] || syllable['wasway'] || syllable['lVowel'])) {
	                    syllable['contraction'] = syllable['asat'];
	                    delete syllable['asat'];
	                }
	            }
	            var outputOrder = ['eVowel', 'yayit', 'lig', 'cons', 'stack', 'contraction', 'yapin', 'kinzi', 'wasway', 'hatoh', 'uVowel', 'lVowel', 'anusvara', 'aVowel', 'asat', 'lDot', 'visarga'];
	            var outputText = '';
	            for (var i = 0; i < outputOrder.length; i++) {
	                if (syllable[outputOrder[i]]) {
	                    outputText += syllable[outputOrder[i]];
	                }
	            }
	            return outputText;
	        }
	    }, {
	        key: 'matchFrequency',
	
	        /**
	         * Compute the frequency of characters matching a Myanmar syllable
	         * compared to the number of characters in the code point range of the conv.
	         * @param inputText to match against
	         * @param isUnicode true to match with genuine Unicode pattern, false to match legacy
	         */
	        value: function matchFrequency(inputText, isUnicode) {
	            var re = this.legacyPattern;
	            var retValue = {};
	            retValue.syllables = [];
	            if (isUnicode) {
	                var utn11 = new TlsMyanmarUtn11();
	                re = utn11.pattern;
	            }
	            var legacyRange = '[' + String.fromCharCode(this.minCodePoint) + '-' + String.fromCharCode(this.maxCodePoint) + ']+';
	            //console.log(legacyRange + " " + this.minCodePoint + " " + this.maxCodePoint);
	            var codeRange = isUnicode ? new RegExp('[က-႟ꩠ-ꩻ]+', 'g') : new RegExp(legacyRange, 'g');
	            re.lastIndex = 0;
	            var pos = 0;
	            var matchCharCount = 0;
	            var nonMyanmarCount = 0;
	            var match = re.exec(inputText);
	            while (match) {
	                var nonMatched = inputText.substring(pos, match.index);
	                if (nonMatched.length) {
	                    retValue.syllables.push(nonMatched);
	                }
	                var strippedNonMatched = nonMatched.replace(codeRange, '');
	                nonMyanmarCount += strippedNonMatched.length;
	                pos = re.lastIndex;
	                retValue.syllables.push(match[0]);
	                matchCharCount += match[0].length;
	                match = re.exec(inputText);
	            }
	            if (pos != inputText.length) {
	                nonMatched = inputText.substring(pos, inputText.length);
	                strippedNonMatched = nonMatched.replace(codeRange, '');
	                nonMyanmarCount += strippedNonMatched.length;
	                retValue.syllables.push(nonMatched);
	            }
	            var freq = matchCharCount ? matchCharCount / (inputText.length - nonMyanmarCount) : 0;
	            _utils.console.log('match uni=' + isUnicode + ' freq=' + freq + ' match count=' + matchCharCount + ' unmatched=' + (inputText.length - nonMyanmarCount - matchCharCount) + ' length=' + inputText.length);
	            retValue.freq = freq;
	            return retValue;
	        }
	    }, {
	        key: 'getFontFamily',
	        value: function getFontFamily(isUnicode) {
	            return isUnicode ? '\'Padauk\',\'ThanLwin\',\'Myanmar3\',\'Parabaik\'' : this.fontFamily;
	        }
	    }, {
	        key: 'isPseudoUnicode',
	        value: function isPseudoUnicode() {
	            return this.minCodePoint == 0x1000;
	        }
	    }], [{
	        key: 'sortLongestFirst',
	
	        /**
	         * @internal
	         */
	        value: function sortLongestFirst(a, b) {
	            if (a.length > b.length) {
	                return -1;
	            } else if (a.length < b.length) {
	                return 1;
	            } else if (a < b) {
	                return -1;
	            } else if (a > b) {
	                return 1;
	            }
	            return 0;
	        }
	    }]);
	
	    return Converter;
	})();
	
	var TlsMyanmarUtn11 = (function () {
	    function TlsMyanmarUtn11() {
	        _classCallCheck(this, TlsMyanmarUtn11);
	
	        this.kinzi = '((င|ရ|ၚ)်္)?'; //1
	        this.cons = '(က|ခ|ဂ|ဃ|င|စ|ဆ|ဇ|ဈ|ဉ|ည|ဋ|ဌ|ဍ|ဎ|ဏ|တ|ထ|ဒ|ဓ|န|ပ|ဖ|ဗ|ဘ|မ|ယ|ရ|လ|ဝ|သ|ဟ|ဠ|အ|ဣ|ဤ|ဥ|ဦ|ဧ|ဩ|ဪ|ဿ|၀|၁|၂|၃|၄|၅|၆|၇|၈|၉|၌|၍|၎|၏|ၐ|ၑ|ၒ|ၓ|ၔ|ၕ|ၚ|ၛ|ၜ|ၝ|ၡ|ၥ|ၦ|ၮ|ၯ|ၰ|ၵ|ၶ|ၷ|ၸ|ၹ|ၺ|ၻ|ၼ|ၽ|ၾ|ၿ|ႀ|ႁ|ႎ|႐|႑|႒|႓|႔|႕|႖|႗|႘|႙|႟|ꩠ|ꩡ|ꩢ|ꩣ|ꩤ|ꩥ|ꩦ|ꩧ|ꩨ|ꩩ|ꩪ|ꩫ|ꩬ|ꩭ|ꩮ|ꩯ|ꩱ|ꩲ|ꩳ|ꩴ|ꩵ|ꩶ|꩷|꩸|꩹|ꩺ)'; //3
	        this.stack = '(္(က|ခ|ဂ|ဃ|င|စ|ဆ|ဇ|ဈ|ဉ|ည|ဋ|ဌ|ဍ|ဎ|ဏ|တ|ထ|ဒ|ဓ|န|ပ|ဖ|ဗ|ဘ|မ|ယ|ရ|လ|ဝ|သ|ဟ|ဠ|အ|ၚ|ၛ|ၜ|ၝ)){0,2}'; //4
	        this.asat = '(်)?'; //6,11,22
	        this.medialY = '(ျ|ၞ|ၟ)?'; //7
	        this.medialR = '(ြ)?'; //8
	        this.medialW = '(ွ|ႂ)?'; //9
	        this.medialH = '(ှ|ၠ)?'; //10
	        // asat 11
	        this.eVowel = '(ေေ|ႄေ|ေ|ႄ)?'; //12
	        this.uVowel = '(ိ|ီ|ဲ|ဳ|ဴ|ဵ|ံ|ၱ|ၲ|ၳ|ၴ|ႅ|ႝ)?'; //13
	        this.lVowel = '(ု|ူ)?'; //14
	        this.karenVowel = '(ၢ|့)?'; //15
	        this.shanVowel = '(ႆ)?'; //16
	        this.aVowel = '(ါ|ာ|ၢ|ၣ|ၧ|ၨ|ႃ)?'; //17
	        this.anusvara = '(ဲ|ံ)?'; //18
	        this.pwoTone = '(ၤ|ၩ|ၪ|ၫ|ၬ|ၭ)?'; //19
	        this.lowerDot = '(့)?'; //20
	        this.monH = '(ှ)?'; //21
	        // asat 22
	        this.visarga = '(း|ႇ|ႈ|ႉ|ႊ|ႋ|ႌ|ႍ|ႏ|ႚ|ႛ|ႜ)?'; //23
	        this.redup = '(ႝꩰ)?'; //24
	        this.section = '(၊|။)?'; //25
	        this.pattern = new RegExp(this.kinzi + this.cons + this.stack + this.asat + this.medialY + this.medialR + this.medialW + this.medialH + this.asat + this.eVowel + this.uVowel + this.lVowel + this.karenVowel + this.shanVowel + this.aVowel + this.anusvara + this.pwoTone + this.lowerDot + this.monH + this.asat + this.visarga + this.redup + this.section, 'g');
	        return this;
	    }
	
	    _createClass(TlsMyanmarUtn11, [{
	        key: 'findSyllables',
	        value: function findSyllables(inputText) {
	            var syllables = [];
	            var pos = 0;
	            var match = this.pattern.exec(inputText);
	            while (match) {
	                var nonMatched = inputText.substring(pos, match.index);
	                if (nonMatched.length) {
	                    syllables.push(nonMatched);
	                }
	                pos = this.pattern.lastIndex;
	                // check for asat or virama and append to previous syllable
	                if (syllables.length && (match[1] != null || match[4] != null || match[6] != null || match[11] != null || match[22] != null || syllables[syllables.length - 1] == 'အ')) {
	                    var lastSyl = syllables.pop();
	                    lastSyl += match[0];
	                    syllables.push(lastSyl);
	                } else {
	                    syllables.push(match[0]);
	                }
	                match = this.pattern.exec(inputText);
	            }
	            if (pos != inputText.length) {
	                nonMatched = inputText.substring(pos, inputText.length);
	                syllables.push(nonMatched);
	            }
	            return syllables;
	        }
	    }]);
	
	    return TlsMyanmarUtn11;
	})();
	
	/** map to hold converters keyed by legacy encoding (font) name */
	var converters = {};
	exports.converters = converters;
	for (var enc in _specs2['default']) {
	    var spec = _specs2['default'][enc];
	    _utils.console.log('Converter', enc, 'for', spec.fonts);
	    var conv = new Converter(spec);
	    for (var i = 0; i < spec.fonts.length; i++) {
	        var font = spec.fonts[i];
	        converters[font] = conv;
	        converters[font.toLowerCase()] = conv;
	    }
	}
	
	function convert(encSrc, encTgt, txtSrc) {
	    if (encSrc == encTgt || encSrc == 'off' || encTgt == 'off' || !txtSrc) {
	        // If encoding is identical or text is trivial, just pass it through
	        return txtSrc;
	    }
	    //console.log('src', encSrc, txtSrc);
	    var convSrc = converters[encSrc];
	    var txtUni = convSrc ? convSrc.convertToUnicode(txtSrc) : txtSrc;
	    if (!convSrc && encSrc != 'unicode') {
	        _utils.console.error('No decoder found for', encSrc);
	    }
	    var convTgt = converters[encTgt];
	    var txtTgt = convTgt ? convTgt.convertFromUnicode(txtUni) : txtUni;
	    if (!convTgt && encTgt != 'unicode') {
	        _utils.console.error('No encoder found for', encTgt);
	    }
	    return txtTgt;
	}
	
	// should be safe to ignore, since the relative order is correct

/***/ },
/* 2 */
/***/ function(module, exports) {

	// Ensure that console.log and console.error don't cause errors
	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var console = window.console || {};
	exports.console = console;
	console.log = console.log || function () {};
	console.error = console.error || console.log;

/***/ },
/* 3 */
/***/ function(module, exports) {

	// Copyright (C) 2010 Keith Stribley http://www.ThanLwinSoft.org/
	// Copyright (C) 2015 Logi Ragnarsson <logi@logi.org>
	// License: GNU Lesser General Public License, version 2.1 or later.
	// http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
	
	/**
	 * Specifications of legacy Burmese encodings for use with the tls.converter.Converter class
	 */
	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = {
	
	    "zawgyi-one": {
	        "fonts": ["Zawgyi-One"],
	        "kinzi": {
	            "င်္": "ၤ",
	            "င်္ိ_lig": "ႋ",
	            "င်္ီ_lig": "ႌ",
	            "င်္ံ_lig": "ႍ"
	        },
	        "cons": {
	            "က": "က",
	            "ခ": "ခ",
	            "ဂ": "ဂ",
	            "ဃ": "ဃ",
	            "င": "င",
	            "စ": "စ",
	            "ဆ": "ဆ",
	            "ဇ": "ဇ",
	            "ဈ": "ဈ",
	            "ဉ": "ဉ",
	            "ဉ_alt": "ၪ",
	            "ည": "ည",
	            "ည_alt": "ၫ",
	            "ဋ": "ဋ",
	            "ဌ": "ဌ",
	            "ဍ": "ဍ",
	            "ဎ": "ဎ",
	            "ဏ": "ဏ",
	            "တ": "တ",
	            "ထ": "ထ",
	            "ဒ": "ဒ",
	            "ဓ": "ဓ",
	            "န": "န",
	            "န_alt": "ႏ",
	            "ပ": "ပ",
	            "ဖ": "ဖ",
	            "ဗ": "ဗ",
	            "ဘ": "ဘ",
	            "မ": "မ",
	            "ယ": "ယ",
	            "ရ": "ရ",
	            "ရ_alt": "႐",
	            "ရ_tall": "",
	            "လ": "လ",
	            "ဝ": "ဝ",
	            "သ": "သ",
	            "ဟ": "ဟ",
	            "ဠ": "ဠ",
	            "အ": "အ",
	            "ဣ": "ဣ",
	            "ဤ": "ဤ",
	            "ဥ": "ဥ",
	            "ဦ": "ဦ",
	            "ဧ": "ဧ",
	            "ဩ": "ဩ",
	            "ဪ": "ဪ",
	            "ဿ": "ႆ",
	            "၌": "၌",
	            "၍": "၍",
	            "၎": "",
	            "၎င်း": "၎",
	            "၏": "၏",
	            "၀": "၀",
	            "၁": "၁",
	            "၂": "၂",
	            "၃": "၃",
	            "၄": "၄",
	            "၅": "၅",
	            "၆": "၆",
	            "၇": "၇",
	            "၈": "၈",
	            "၉": "၉",
	            "။": "။",
	            "၊": "၊"
	        },
	        "lig": {
	            "ဍ္ဍ": "ၮ",
	            "ဍ္ဎ": "ၯ",
	            "ဏ္ဍ": "႑",
	            "ဋ္ဌ": "႒",
	            "ဋ္ဋ": "႗"
	        },
	        "stack": {
	            "္က": "ၠ",
	            "္ခ": "ၡ",
	            "္ဂ": "ၢ",
	            "္ဃ": "ၣ",
	            "္စ": "ၥ",
	            "္ဆ": "ၦ",
	            "္ဆ_narrow": "ၧ",
	            "္ဇ": "ၨ",
	            "္ဈ": "ၩ",
	            "္ဋ": "ၬ",
	            "္ဌ": "ၭ",
	            "္ဍ": "",
	            "္ဎ": "",
	            "္ဏ": "ၰ",
	            "္တ": "ၱ",
	            "္တ_narrow": "ၲ",
	            "္တွ": "႖",
	            "္ထ": "ၳ",
	            "္ထ_narrow": "ၴ",
	            "္ဒ": "ၵ",
	            "္ဓ": "ၶ",
	            "္န": "ၷ",
	            "္ပ": "ၸ",
	            "္ဖ": "ၹ",
	            "္ဗ": "ၺ",
	            "္ဘ": "ၻ",
	            "္မ": "ၼ",
	            "္ယ": "",
	            "္ရ": "",
	            "္လ": "ႅ",
	            "္သ": "",
	            "္အ": ""
	        },
	        "yapin": {
	            "ျ": "်",
	            "ျ_alt": "ၽ",
	            "ျွ_lig": "",
	            "ျှ_lig": "",
	            "ျွှ_lig": ""
	        },
	        "yayit": {
	            "ြ": "ျ",
	            "ြ_wide": "ၾ",
	            "ြ_upper_narrow": "ၿ",
	            "ြ_upper_wide": "ႀ",
	            "ြ_lower_narrow": "ႁ",
	            "ြ_lower_wide": "ႂ",
	            "ြ_lower_upper_narrow": "ႃ",
	            "ြ_lower_upper_wide": "ႄ",
	            "ြွ_narrow": "",
	            "ြွ_wide": "",
	            "ြွ_upper_narrow": "",
	            "ြွ_upper_wide": "",
	            "ြု_narrow": "",
	            "ြု_wide": "",
	            "ြု_upper_narrow": "",
	            "ြု_upper_wide": ""
	        },
	        "wasway": {
	            "ွ": "ြ",
	            "ွှ_lig": "ႊ",
	            "ွှ_small": ""
	        },
	        "hatoh": {
	            "ှ": "ွ",
	            "ှ_small": "ႇ",
	            "ှု_lig": "ႈ",
	            "ှူ_lig": "ႉ"
	        },
	        "eVowel": {
	            "ေ": "ေ"
	        },
	        "uVowel": {
	            "ိ": "ိ",
	            "ိံ_lig": "ႎ",
	            "ီ": "ီ"
	        },
	        "lVowel": {
	            "ု": "ု",
	            "ု_tall": "ဳ",
	            "ူ": "ူ",
	            "ူ_tall": "ဴ"
	        },
	        "anusvara": {
	            "ံ": "ံ",
	            "ဲ": "ဲ"
	        },
	        "aVowel": {
	            "ါ": "ါ",
	            "ါ်_lig": "ၚ",
	            "ာ": "ာ"
	        },
	        "lDot": {
	            "့": "႕",
	            "့_alt": "႔",
	            "့_left": "့",
	            "့_spaceDot": " ့",
	            "့_spaceDotAlt": " ႔"
	        },
	        "asat": {
	            "်": "္"
	        },
	        "visarga": {
	            "း": "း"
	        }
	    },
	
	    "wininnwa": {
	        "fonts": ["Wininnwa", "Win Researcher", "Win Innwa", "Win   Innwa", "Win---Innwa", "Win---Researcher"],
	        "kinzi": {
	            "င်္": "F",
	            "င်္ိ_lig": "Ø",
	            "င်္ီ_lig": "Ð",
	            "င်္ံ_lig": "ø"
	        },
	        "cons": {
	            "က": "u",
	            "ခ": "c",
	            "ဂ": "*",
	            "ဃ": "C",
	            "င": "i",
	            "စ": "p",
	            "ဆ": "q",
	            "ဇ": "Z",
	            "ဈ": "ps",
	            "ဉ": "Ú",
	            "ဉ_alt": "Í",
	            "ဉာ_lig": "Ó",
	            "ည": "n",
	            "ည_alt": "ñ",
	            "ဋ": "#",
	            "ဌ": "X",
	            "ဍ": "!",
	            "ဎ": "¡",
	            "ဏ": "P",
	            "တ": "w",
	            "ထ": "x",
	            "ဒ": "'",
	            "ဓ": "\"",
	            "န": "e",
	            "န_alt": "E",
	            "ပ": "y",
	            "ဖ": "z",
	            "ဗ": "A",
	            "ဘ": "b",
	            "မ": "r",
	            "ယ": ",",
	            "ရ": "&",
	            "ရ_alt": "½",
	            "ရ_tall": "",
	            "လ": "v",
	            "ဝ": "0",
	            "သ": "o",
	            "ဟ": "[",
	            "ဠ": "V",
	            "အ": "t",
	            "ဣ": "£",
	            "ဤ": "þ",
	            "ဥ": "O",
	            "ဦ": "OD",
	            "ဧ": "{",
	            "ဩ": "Mo",
	            "ဪ": "aMomf",
	            "ဿ": "ó",
	            "၌": "ü",
	            "၍": "í",
	            "၎": "¤",
	            "၎င်း": "",
	            "၏": "\\",
	            "၀": "0",
	            "၁": "1",
	            "၂": "2",
	            "၃": "3",
	            "၄": "4",
	            "၅": "5",
	            "၆": "6",
	            "၇": "7",
	            "၈": "8",
	            "၉": "9",
	            "။": "/",
	            "၊": "?"
	        },
	        "lig": {
	            "ဍ္ဍ": "×",
	            "ဍ္ဎ": "¹",
	            "ဏ္ဍ": "@",
	            "ဋ္ဌ": "|",
	            "ဋ္ဋ": "¥",
	            "ကျပ်": "$"
	        },
	        "stack": {
	            "္က": "ú",
	            "္ခ": "©",
	            "္ဂ": "¾",
	            "္ဃ": "¢",
	            "္စ": "ö",
	            "္ဆ": "ä",
	            "္ဆ_narrow": "",
	            "္ဇ": "Æ",
	            "္ဈ": "Ñ",
	            "္ဋ": "³",
	            "္ဌ": "²",
	            "္ဍ": "",
	            "္ဎ": "",
	            "္ဏ": "Ö",
	            "္တ": "å",
	            "္တ_narrow": "Å",
	            "္တွ": "É",
	            "္ထ": "¬",
	            "္ထ_narrow": "¦",
	            "္ဒ": "´",
	            "္ဓ": "¨",
	            "္န": "é",
	            "္ပ": "Ü",
	            "္ဖ": "æ",
	            "္ဗ": "Á",
	            "္ဘ": "Ç",
	            "္မ": "®",
	            "္ယ": "",
	            "္ရ": "",
	            "္လ": "’",
	            "္သ": "",
	            "္အ": ""
	        },
	        "yapin": {
	            "ျ": "s",
	            "ျ_alt": "ß",
	            "ျွ_lig": "R",
	            "ျှ_lig": "Q",
	            "ျွှ_lig": "W"
	        },
	        "yayit": {
	            "ြ": "j",
	            "ြ_wide": "M",
	            "ြ_upper_narrow": "N",
	            "ြ_upper_wide": "B",
	            "ြ_lower_narrow": "`",
	            "ြ_lower_wide": "~",
	            "ြ_lower_upper_narrow": "",
	            "ြ_lower_upper_wide": "",
	            "ြွ_narrow": ">",
	            "ြွ_wide": "<",
	            "ြွ_upper_narrow": "",
	            "ြွ_upper_wide": "",
	            "ြု_narrow": "û",
	            "ြု_wide": "ê",
	            "ြု_upper_narrow": "",
	            "ြု_upper_wide": ""
	        },
	        "wasway": {
	            "ွ": "G",
	            "ွှ_lig": "T",
	            "ွှ_small": ""
	        },
	        "hatoh": {
	            "ှ": "S",
	            "ှ_small": "§",
	            "ှု_lig": "I",
	            "ှူ_lig": "ª"
	        },
	        "eVowel": {
	            "ေ": "a"
	        },
	        "uVowel": {
	            "ိ": "d",
	            "ိံ_lig": "ð",
	            "ီ": "D"
	        },
	        "lVowel": {
	            "ု": "k",
	            "ု_tall": "K",
	            "ူ": "l",
	            "ူ_tall": "L"
	        },
	        "anusvara": {
	            "ံ": "H",
	            "ဲ": "J"
	        },
	        "aVowel": {
	            "ါ": "g",
	            "ါ်_lig": ":",
	            "ာ": "m"
	        },
	        "lDot": {
	            "့": "U",
	            "့_alt": "Y",
	            "့_left": "h"
	        },
	        "asat": {
	            "်": "f"
	        },
	        "visarga": {
	            "း": ";"
	        }
	    },
	
	    "wwin_burmese1": {
	        "fonts": ["Wwin_Burmese1", "Wwin_Burmese"],
	        "kinzi": {
	            "င်္": "F",
	            "င်္ိ_lig": "õ",
	            "င်္ီ_lig": "ô",
	            "င်္ံ_lig": "ø"
	        },
	        "cons": {
	            "က": "u",
	            "ခ": "c",
	            "ဂ": "*",
	            "ဃ": "C",
	            "င": "i",
	            "စ": "p",
	            "ဆ": "q",
	            "ဇ": "Z",
	            "ဈ": "ps",
	            "ဉ": "^",
	            "ဉ_alt": "",
	            "ည": "n",
	            "ည_alt": "!",
	            "ဋ": "Ë",
	            "ဋ_alt": "É",
	            "ဌ": "X",
	            "ဍ": "È",
	            "ဎ": "Ê",
	            "ဏ": "%",
	            "တ": "w",
	            "ထ": "x",
	            "ဒ": "'",
	            "ဓ": "\"",
	            "န": "e",
	            "န_alt": "E",
	            "ပ": "y",
	            "ဖ": "z",
	            "ဗ": "A",
	            "ဘ": "b",
	            "မ": "r",
	            "ယ": ",",
	            "ရ": "&",
	            "ရ_alt": "¶",
	            "ရ_tall": "±",
	            "လ": "v",
	            "ဝ": "ÿ",
	            "သ": "o",
	            "ဟ": "[",
	            "ဠ": "V",
	            "အ": "t",
	            "ဣ": "Á",
	            "ဤ": "T",
	            "ဥ": "O",
	            "ဦ": "OD",
	            "ဧ": "{",
	            "ဩ": "=o",
	            "ဪ": "a=omf",
	            "ဿ": "\\",
	            "၌": "Y",
	            "၍": "I",
	            "၎": "",
	            "၎င်း": "‚",
	            "၏": ".",
	            "၀": "0",
	            "၁": "1",
	            "၂": "2",
	            "၃": "3",
	            "၄": "4",
	            "၅": "5",
	            "၆": "6",
	            "၇": "7",
	            "၈": "8",
	            "၉": "9",
	            "။": "?",
	            "၊": "/"
	        },
	        "lig": {
	            "ဍ္ဍ": "Ä",
	            "ဍ္ဎ": "Å",
	            "ဏ္ဍ": "¾",
	            "ဏ္ဌ": "¿",
	            "ဏ္ဏ": "À",
	            "ဏ္ဋ": "Â",
	            "ဋ္ဋ": "Ã",
	            "ဋ္ဌ": "Ï",
	            "ဉ္စ": "Ì",
	            "ဉ္ဇ": "Í"
	        },
	        "stack": {
	            "္က": "U",
	            "္ခ": "Q",
	            "္ဂ": "~",
	            "္ဃ": "ƒ",
	            "္စ": "P",
	            "္ဆ": ">",
	            "္ဆ_narrow": "",
	            "္ဇ": "…",
	            "္ဇျ_lig": "Æ",
	            "္ဈ": "Æ",
	            "္ဋ": "",
	            "္ဌ": "",
	            "္ဍ": "",
	            "္ဎ": "„",
	            "္ဏ": "",
	            "္တ": "W",
	            "္တ_narrow": "©",
	            "္တ_narrow2": "œ",
	            "္တွ": "",
	            "္ထ": "ˆ",
	            "္ထ_narrow": "Î",
	            "္ဒ": "N",
	            "္ဓ": "<",
	            "္န": "M",
	            "္ပ": "`",
	            "္ဖ": "‰",
	            "္ဗ": "Š",
	            "္ဘ": "B",
	            "္မ": "R",
	            "္ယ": "",
	            "္ရ": "",
	            "္လ": "†",
	            "္သ": "",
	            "္အ": ""
	        },
	        "yapin": {
	            "ျ": "s",
	            "ျ_alt": "",
	            "ျွ_lig": "|",
	            "ျွ_alt": "í",
	            "ျှ_lig": "#",
	            "ျွှ_lig": "é",
	            "ျွှ_alt": "î"
	        },
	        "yayit": {
	            "ြ": "j",
	            "ြ_wide": "=",
	            "ြ_upper_narrow": "+",
	            "ြ_upper_wide": "}",
	            "ြ_lower_narrow": "",
	            "ြ_lower_wide": "",
	            "ြ_lower_upper_narrow": "",
	            "ြ_lower_upper_wide": "",
	            "ြွ_narrow": "¹",
	            "ြွ_wide": "º",
	            "ြွ_upper_narrow": "",
	            "ြွ_upper_wide": "",
	            "ြု_narrow": "ð",
	            "ြု_wide": "ñ",
	            "ြု_upper_narrow": "",
	            "ြု_upper_wide": "",
	            "ြို_narrow": "ò",
	            "ြို_wide": "ó"
	        },
	        "wasway": {
	            "ွ": "G",
	            "ွ_alt": "ë",
	            "ွှ_lig": "$",
	            "ွှ_small": "",
	            "ွှ_alt": "¸",
	            "ွှ_alt2": "ì",
	            "ွှ_alt3": "ï"
	        },
	        "hatoh": {
	            "ှ": "S",
	            "ှ_small": "‡",
	            "ှ_alt": "ê",
	            "ှု_lig": "_",
	            "ှူ_lig": "–"
	        },
	        "eVowel": {
	            "ေ": "a"
	        },
	        "uVowel": {
	            "ိ": "d",
	            "ိံ_lig": "ö",
	            "ီ": "D"
	        },
	        "lVowel": {
	            "ု": "k",
	            "ု_tall": "K",
	            "ူ": "l",
	            "ူ_tall": "L"
	        },
	        "anusvara": {
	            "ံ": "H",
	            "ဲ": "J"
	        },
	        "aVowel": {
	            "ါ": "g",
	            "ါ်_lig": ":",
	            "ာ": "m"
	        },
	        "lDot": {
	            "့": "Œ",
	            "့_alt": "@",
	            "့_alt2": "‹",
	            "့_left": "h",
	            "့_left2": "•",
	            "့_left3": "›"
	        },
	        "asat": {
	            "်": "f"
	        },
	        "visarga": {
	            "း": ";"
	        }
	    }
	};
	module.exports = exports["default"];

/***/ }
/******/ ]);
//# sourceMappingURL=BothMM.js.map