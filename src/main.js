// Copyright (C) 2015 Logi Ragnarsson <logi@logi.org>
// License: GNU Lesser General Public License, version 2.1 or later.
// http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html

import {convert} from './tls/converter';
import {console} from './utils';

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
export default class BothMM {

    /**
     * Call the passed-in function when the BothMM library is whenReady. This is guaranteed to also be after the DOM is
     * initialised.
     * @param f
     */
    static ready(f) {
        if (readyListeners) {
            readyListeners.push(f);
        } else {
            setTimeout(f, 0);
        }
    }

    /**
     * Tests whether a given font is installed in the user's browser.
     * @param {string} font The name of the font to test for
     * @returns {boolean} Whether the font is available
     */
    static hasFont(font) {
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

    /**
     * Register function to call before the encoding is changed.
     * If the function throws an exception, then the change will be aborted. */
    static beforeEncodingChange(f) {
        becListeners.push(f)
    }

    /**
     * Register function to call after the encoding has been changed.
     * If the function throws an exception, then the change will be aborted. */
    static afterEncodingChange(f) {
        aecListeners.push(f)
    }

    /**
     *  Set the target encoding and translate all discovered element.
     *  @param {string=} encoding Change to this encoding or omit to refresh translation.
     */
    static setEncoding(encoding) {
        if (encoding === undefined) {
            encoding = BothMM.encoding;
        }
        var before = BothMM.encoding;
        for (var i = 0; i < becListeners.length; i++) {
            becListeners[i](before, encoding)
        }
        BothMM.encoding = encoding;
        translateSub("off", BothMM.roots);

        setCookie('BothMM.encoding', encoding, '/');
        for (i = 0; i < aecListeners.length; i++) {
            try {
                aecListeners[i](before, encoding)
            } catch (e) {
                console.error(e);
            }
        }
    }
}

/**
 * The library version according to <a href="http://semver.org/">semver</a> semantics.
 *
 * This member is available during initialisation.
 */
BothMM.VERSION = "0.1.0";


/**
 * The DOM elements to translate. Defaults to anything with a [both-mm] attribute,
 * unless it is nested within another such element. */
BothMM.roots = [];


/**
 * Re-export the convert function
 * @type {convert}
 */
BothMM.convert = convert;

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
            elm.nodeValue = convert(encSrc, encTgt, elm.__raw);
        } else {
            // No text here. Update settings and recurse
            var encSrcSel = elm.getAttribute("both-mm") || encSrc;
            var encTgtEff = (encSrcSel == "off") ? "off" : (encTgt != encSrcSel) ? encTgt : "off";
            //console.log(encSrc, encSrcSel, "->", encTgt, encTgtEff, elm);
            elm.setAttribute("both-mm-now", encTgtEff);
            translateSub(encSrcSel, elm.childNodes);
        }
    }
}

function getCookie(key) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

function setCookie(key, value, path) {
    document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT" + (path ? "; path=" + path : "");
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

    BothMM.roots = discardIfAncestorAttr("both-mm", findWithAttr("both-mm"));
    console.log('BothMM.roots discovered:', BothMM.roots.length);
    for (i = 0; i < BothMM.roots; i++) {
        console.log('  ', BothMM.roots[i]);
    }

    // Translate all the discovered elements
    BothMM.setEncoding();

    // Change the encoding when any element with the "both-mm-select" attribute is clicked
    var selectors = findWithAttr("both-mm-select");
    for (i = 0; i < selectors.length; i++) {
        selectors[i].addEventListener('click', function (evt) {
            var encoding = evt.target.getAttribute("both-mm-select");
            BothMM.setEncoding(encoding);
        });
    }

    // Notify listeners that we are ready
    for (i = 0; i < readyListeners.length; i++) {
        try {
            readyListeners[i]();
        } catch (e) {
            console.error(e);
        }
    }
    readyListeners = undefined;
}

(function ready() {
    if (document.readyState === "complete") {
        setTimeout(onDomReady, 1);
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', onDomReady);
    } else {
        setTimeout(ready, 20);
    }
})();
