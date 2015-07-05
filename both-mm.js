/**
 * Global object for scripting the BothMM library.
 *
 * It initially has only the ready() and VERSION members, until the library has properly initialised.
 */
BothMM = {
    _oldBothMM: window.BothMM,
    _readyList: [],

    /**
     * Call the passed-in function when the BothMM library is ready. This is guaranteed to also be after the DOM is
     * initialised.
     * @param f
     */
    ready: function (f) {
        if (this._readyList) {
            this._readyList.push(f);
        } else {
            setTimeout(f, 0);
        }
    },

    VERSION: "0.0.1"
};

(function () {

    function init() {
        // Ensure that console.log and console.error don't cause errors
        var console = window.console || {
                log: function () {
                },
                error: function () {
                }
            };

        ///////////////////////////////////////////////////////////////////
        // Utility functions

        /**
         * Find all nodes on page with a given attribute
         *
         * @param {string} an
         * @returns {Array<Element> | NodeList}
         */
        function findWithAttr(an) {
            if (typeof(document.querySelectorAll) == "function") {
                return document.querySelectorAll("[" + an + "]");
            } else {
                var all = document.getElementsByTagName("*");
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
         * Filters a list of Nodes, discarding the ones with an ancestor having a particular element
         * @param {string} an
         * @param {Array<Element> | NodeList} elms
         * @returns {Array<Element>}
         */
        function noParentsWithAttr(an, elms) {
            var good = [];
            for (var i = 0; i < elms.length; i++) {
                var elm = elms[i];
                var p = elm.parentNode;
                while (p && p.getAttribute) {
                    //console.log('>', p);
                    if (p.getAttribute(an)) {
                        elm = null;
                    }
                    p = p.parentNode;
                }
                if (elm) {
                    good.push(elm);
                }
            }
            return good;
        }


        ///////////////////////////////////////////////////////////////////
        // Set up global object

        /** Global BothMM object for scripting. */
        var BothMM = window.BothMM;

        /**
         * Restores the global BothMM variable to its original state and returns this object.
         * @returns {BothMM}
         */
        BothMM.noConflict = function () {
            window.BothMM = BothMM._oldBothMM;
            return BothMM;
        };

        //noinspection JSUnusedGlobalSymbols
        BothMM.stringConverterMap = {  // TODO: Implement actual text translation
            zawgyi_unicode: function (s) {
                // Silly translator that puts _undreline_ on each word.
                return s.replace(/((\s|^)+)([^\s$]+)/g, "$1[$3]");
            },
            unicode_zawgyi: function (s) {
                // Silly translator that puts _undreline_ on each word.
                return s.replace(/((\s|^)+)([^\s$]+)/g, "$1[$3]");
            },
            noop: function (s) {
                return s;
            }
        };

        /**
         * Recursively translate all the elements.
         * @param encSrcParent Encoding source inherited from parents and may be overridden in children.
         * @param elms List of elements to translate.
         */
        function translateSub(encSrcParent, elms) {
            var encTgt = BothMM.encoding;
            for (var i = 0; i < elms.length; i++) {
                var elm = elms[i];

                if (elm.nodeType == 3) {
                    // It's a text node, so let's do some actual text conversion
                    if (!elm.__raw) elm.__raw = elm.nodeValue;
                    var cvtKey = encSrcParent + "_" + encTgt;
                    //console.log(cvtKey, elm);
                    var cvt = BothMM.stringConverterMap[cvtKey] || BothMM.stringConverterMap.noop;
                    elm.nodeValue = cvt(elm.__raw);
                    // TODO: Update on DOMCharacterDataModified  -- fallback to setInterval?
                } else {
                    // No text here. Update settings and recurse
                    var encSrcSel = elm.getAttribute("both-mm") || encSrcParent;
                    var encTgtEff = (encSrcSel == "off") ? "off" : (encTgt != encSrcSel) ? encTgt : "off";
                    //console.log(encSrcParent, encSrcSel, "->", encTgt, encTgtEff, elm);
                    elm.setAttribute("both-mm-now", encTgtEff);
                    translateSub(encSrcSel, elm.childNodes);
                }
            }
        }

        var listenBEC = [];
        var listenAEC = [];

        /**
         * Register function to call before the encoding is changed.
         * If the function throws an exception, then the change will be aborted. */
        BothMM.beforeEncodingChange = function (f) {
            listenBEC.push(f)
        };

        /**
         * Register function to call after the encoding has been changed.
         * If the function throws an exception, then the change will be aborted. */
        BothMM.afterEncodingChange = function (f) {
            listenAEC.push(f)
        };

        /**
         *  Set the target encoding and translate all discovered element.
         *  @param {string | undefined} encoding Change to this encoding or omit to refresh translation.
         */
        BothMM.setEncoding = function (encoding) {
            if (encoding === undefined) {
                encoding = BothMM.encoding;
            }
            var before = BothMM.encoding;
            for (var i = 0; i < listenBEC.length; i++) {
                listenBEC[i](before, encoding)
            }
            this.encoding = encoding;
            translateSub("off", BothMM.roots);
            // TODO: Store new encoding in cookie
            for (i = 0; i < listenAEC.length; i++) {
                try {
                    listenAEC[i](before, encoding)
                } catch (e) {
                    console.error(e);
                }
            }
        };

        ///////////////////////////////////////////////////////////////////
        // Discovery

        // TODO: Load encoding from cookie
        // TODO: Detect Zawgyi font and set encoding accordingly

        /**
         * Translate elements to use this presentation.
         * @type {string} (zawgyi|unicode|off)
         */
        BothMM.encoding = "off";

        /**
         * The DOM elements to translate. Defaults to anything with a [both-mm] attribute,
         * unless it is nested within another such element. */
        BothMM.roots = noParentsWithAttr("both-mm", findWithAttr("both-mm"));
        console.log('BothMM.roots discovered:', BothMM.roots.length);
        for (i = 0; i < BothMM.roots.length; i++) {
            console.log('  ', BothMM.roots[i]);
        }

        // Change the encoding when any element with the "both-mm-select" attribute is clicked
        var selectors = findWithAttr("both-mm-select");
        for (var i = 0; i < selectors.length; i++) {
            selectors[i].addEventListener('click', function (evt) {
                var encoding = evt.target.getAttribute("both-mm-select");
                BothMM.setEncoding(encoding);
            });
        }

        // Finally do the default translation
        BothMM.setEncoding();

        // Call the ready callbacks
        for (i = 0; i < BothMM._readyList.length; i++) {
            try {
                BothMM._readyList[i]();
            } catch (e) {
                console.error(e);
            }
        }
        delete BothMM._readyList;
    }

    (function whenReady() {
        if (document.readyState === "complete") {
            setTimeout(init, 1);
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            setTimeout(whenReady, 20);
        }
    })();
})();
