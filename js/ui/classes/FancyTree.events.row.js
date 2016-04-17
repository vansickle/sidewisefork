/* Copyright (c) 2012 Joel Thornton <sidewise@joelpt.net> See LICENSE.txt for license details. */

FancyTree.prototype.onTooltipMouseOver = function() {
  $(this).hide()
};
FancyTree.prototype.onExpanderClick = function(b) {
  var a = b.data.treeObj;
  if (a.contextMenuShown) return a.disableContextMenu.call(a), !1;
  a.hideTooltip();
  var c = $(this).closest(".ftRowNode");
  a.toggleExpandRow(c);
  b.stopPropagation()
};
FancyTree.prototype.onMouseEnterButtons = function(b) {
  b.data.treeObj.handleHideTooltipEvent(b)
};
FancyTree.prototype.onMouseLeaveButtons = function(b) {
  var a = b.data.treeObj,
    c = b.data.treeObj.getParentRowNode($(this));
  a.startTooltipTimer(c, b)
};
FancyTree.prototype.onItemRowMouseEnter = function(b) {
  var a = b.data.treeObj,
    c = a.getParentRowNode($(this)),
    d = a.getRowTypeParams(c),
    e = a.getButtons(c);
  if (d.onShowButtons) {
    var f = d.onShowButtons(c, d.buttons).map(function(a) {
      return ".ftButton__" + d.name + "_" + a.id
    }).join(",");
    e.filter(f).show();
    e.not(f).hide()
  }
  e.parent().show();
  a.getInnerRow(c).children(".ftItemTextAffix").hide();
  a.hoveredRow = c;
  a.startTooltipTimer(c, b);
  0 <= a.clickOnHoverDelayMs && d.allowClickOnHover && (a.clickOnHoverTimer && clearTimeout(a.clickOnHoverTimer),
    a.clickOnHoverTimer = setTimeout(function() {
      if (!b.shiftKey && !(b.ctrlKey||b.metaKey) && !(a.contextMenuShown || 1 < a.multiSelection.length))
        if (!1 !== b.data.autofocusOnClick && a.focusRow(c), d.onClick) {
          var e = b.data;
          a.resetDragDropState(function() {
            b.data = e;
            b.data.row = c;
            b.data.clickedViaHover = !0;
            d.onClick(b)
          })
        }
    }, a.clickOnHoverDelayMs))
};
FancyTree.prototype.onItemRowMouseLeave = function(b) {
  var a = b.data.treeObj,
    c = a.getParentRowNode($(this));
  a.getButtons(c).parent().hide();
  c = a.getInnerRow(c).children(".ftItemTextAffix");
  c.html() && c.show();
  a.hoveredRow = null;
  a.handleHideTooltipEvent(b);
  a.clickOnHoverTimer && clearTimeout(a.clickOnHoverTimer)
};
FancyTree.prototype.defaultFormatTitleHandler = function(b, a) {
  var c = b.attr("label"),
    d = b.attr("text");
  a.children(".ftItemTitle").text(d);
  c && a.children(".ftItemLabel").text(c + (d ? ": " : ""))
};