/* Copyright (c) 2012 Joel Thornton <sidewise@joelpt.net> See LICENSE.txt for license details. */

FancyTree.prototype.onBodyMouseUp = function(b) {
  var a = b.data.treeObj,
    b = $(b.target);
  if (b.parents().is(a.root) && !b.is(".ftBottomPadding") || a.dragging) return !0;
  a.draggingJustCancelled && (a.ignoreNextRowMouseUpEvent = !1, a.draggingJustCancelled = !1);
  a.clearMultiSelection.call(a);
  return a.contextMenuShown ? (a.disableContextMenu.call(a), !1) : !0
};
FancyTree.prototype.onBodyMouseLeave = function(b) {
  b.data.treeObj.hideTooltip.call(b.data.treeObj);
  b.data.treeObj.usingFastTooltip = !1
};
FancyTree.prototype.onBodyMouseWheel = function(b) {
  var a = b.data.treeObj;
  if (!a.clickOnMouseWheel && !b.shiftKey || a.clickOnMouseWheel && b.altKey) return !0;
  if (a.clickOnMouseWheelIgnoring) return !1;
  if (!a.focusedRow || 1 < a.multiSelection.length || !a.allowClickOnScrollSelector) return !0;
  if (a.scrollTargetElem.get(0).scrollHeight > a.scrollTargetElem.height()) {
    var c = 0.85 * (a.scrollTargetElem.width() + a.scrollTargetElem.offset().left) - 16;
    if (b.originalEvent.pageX >= c) return !0
  }
  a.hideTooltip();
  0 > b.originalEvent.wheelDelta ? (c =
    a.focusedRow.following(".ftRowNode[rowtype=page][hibernated=false]"), 0 == c.length && (c = a.root.find(".ftRowNode[rowtype=page][hibernated=false]:first"))) : (c = a.focusedRow.preceding(".ftRowNode[rowtype=page][hibernated=false]"), 0 == c.length && (c = a.root.find(".ftRowNode[rowtype=page][hibernated=false]:last")));
  if (0 == c.length) return !0;
  a.clickOnMouseWheelIgnoring = !0;
  a.clickOnMouseWheelTimer = setTimeout(function() {
    a.clickOnMouseWheelIgnoring = false
  }, 20);
  a.bodyMouseWheelHandler.call(a, b, c);
  return !1
};
FancyTree.prototype.bodyMouseWheelHandler = function(b, a) {
  var c = this.getRowTypeParams(a);
  !1 !== c.autofocusOnClick && this.focusRow(a);
  if (c.onClick) {
    var d = b.data;
    this.resetDragDropState(function() {
      b.data = d;
      b.data.row = a;
      b.data.clickedViaScroll = !0;
      c.onClick(b)
    })
  }
};
FancyTree.prototype.onDocumentKeyDown = function(b) {
  var a = b.data.treeObj;
  if (a.filterBoxShown && 70 == b.keyCode && (b.ctrlKey||b.metaKey)) return a.filterElem.children(".ftFilterInput").focus(), !1;
  // if (67 == b.keyCode && (b.ctrlKey||b.metaKey)) return alert("test"), !1;
  if (87 == b.keyCode && (b.ctrlKey||b.metaKey)) return alert("close"), !1;
  if (27 == b.keyCode) {
    if (a.filterBoxShown && (a.filterElem.children(".ftFilterInput").val("").trigger("keyup"), a.filtering = !1, a.filterElem.children(".ftFilterInput").is(":focus"))) return a.filterElem.children(".ftFilterInput").blur(), !0;
    a.contextMenuShown && a.disableContextMenu.call(a);
    a.dragging && (a.ignoreNextRowMouseUpEvent = !0, a.resetDragDropState());
    return !1
  }
  if ((b.ctrlKey||b.metaKey) || b.altKey) return !0;
  if (a.filterBoxShown && 48 <= b.keyCode && 90 >= b.keyCode) {
    if (a.filterElem.children(".ftFilterInput").is(":focus")) return !0;
    setTimeout(function() {
      a.filterElem.children(".ftFilterInput").focus().val(String.fromCharCode(b.keyCode).toLowerCase())
    }, 5)
  }
  return !0
};