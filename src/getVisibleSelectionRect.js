/*
 * Taken from draft-js/lib/getVisibleSelectionRect
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
import invariant from 'fbjs/lib/invariant';

var isChrome = /chrome/gi.test(window.navigator.userAgent)

// In Chrome, the client rects will include the entire bounds of all nodes that
// begin (have a start tag) within the selection, even if the selection does
// not overlap the entire node. To resolve this, we split the range at each
// start tag and join the client rects together.
// https://code.google.com/p/chromium/issues/detail?id=324437
/* eslint-disable consistent-return */
function getRangeClientRectsChrome(range: Range): Array<ClientRect> {
  var tempRange = range.cloneRange();
  var clientRects = [];

  for (
    var ancestor = range.endContainer;
    ancestor != null;
    ancestor = ancestor.parentNode
  ) {
    // If we've climbed up to the common ancestor, we can now use the
    // original start point and stop climbing the tree.
    var atCommonAncestor = ancestor === range.commonAncestorContainer;
    if (atCommonAncestor) {
      tempRange.setStart(range.startContainer, range.startOffset);
    } else {
      tempRange.setStart(tempRange.endContainer, 0);
    }
    var rects = Array.from(tempRange.getClientRects());
    clientRects.push(rects);
    if (atCommonAncestor) {
      clientRects.reverse();
      return [].concat(...clientRects);
    }
    tempRange.setEndBefore(ancestor);
  }

  invariant(
    false,
    'Found an unexpected detached subtree when getting range client rects.',
  );
}

/**
 * Like range.getClientRects() but normalizes for browser bugs.
 */
var getRangeClientRects = isChrome
  ? getRangeClientRectsChrome
  : function(range: Range): Array<ClientRect> {
      return Array.from(range.getClientRects());
    };

/**
 * Like range.getBoundingClientRect() but normalizes for browser bugs.
 */
function getRangeBoundingClientRect(range) {
  // "Return a DOMRect object describing the smallest rectangle that includes
  // the first rectangle in list and all of the remaining rectangles of which
  // the height or width is not zero."
  // http://www.w3.org/TR/cssom-view/#dom-range-getboundingclientrect
  var rects = getRangeClientRects(range);
  var top = 0;
  var right = 0;
  var bottom = 0;
  var left = 0;

  if (rects.length) {
    // If the first rectangle has 0 width, we use the second, this is needed
    // because Chrome renders a 0 width rectangle when the selection contains
    // a line break.
    if (rects.length > 1 && rects[0].width === 0) {
      ({top, right, bottom, left} = rects[1]);
    } else {
      ({top, right, bottom, left} = rects[0]);
    }

    for (var ii = 1; ii < rects.length; ii++) {
      var rect = rects[ii];
      if (rect.height !== 0 && rect.width !== 0) {
        top = Math.min(top, rect.top);
        right = Math.max(right, rect.right);
        bottom = Math.max(bottom, rect.bottom);
        left = Math.min(left, rect.left);
      }
    }
  }

  return {
    top,
    right,
    bottom,
    left,
    width: right - left,
    height: bottom - top,
  };
}

/**
 * Return the bounding ClientRect for the visible DOM selection, if any.
 * In cases where there are no selected ranges or the bounding rect is
 * temporarily invalid, return null.
 */
function getVisibleSelectionRect(global: any): ?FakeClientRect {
  const selection = global.getSelection();
  if (!selection.rangeCount) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const boundingRect = getRangeBoundingClientRect(range);
  const {top, right, bottom, left} = boundingRect;

  // When a re-render leads to a node being removed, the DOM selection will
  // temporarily be placed on an ancestor node, which leads to an invalid
  // bounding rect. Discard this state.
  if (top === 0 && right === 0 && bottom === 0 && left === 0) {
    return null;
  }

  return boundingRect;
}

export default getVisibleSelectionRect;
