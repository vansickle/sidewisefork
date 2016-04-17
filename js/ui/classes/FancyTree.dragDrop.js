/* Copyright (c) 2012 Joel Thornton <sidewise@joelpt.net> See LICENSE.txt for license details. */

var DRAG_TO_ABOVE_SENSITIVITY_RATIO = 0.3,
  DRAG_TO_BELOW_SENSITIVITY_RATIO = 0.7;
FancyTree.prototype.setDraggableDroppable = function(c, a) {
  var b = this.getItemRow(c);
  a || (a = this.getRowTypeParams(c));
  a.draggableParams && b.draggable(a.draggableParams);
  a.droppableParams && b.droppable(a.droppableParams)
};
FancyTree.prototype.getDraggableParams = function() {
  var c = this;
  return {
    axis: "y",
    containment: "document",
    cursorAt: {
      top: -30,
      left: 5
    },
    distance: 5,
    delay: 50,
    helper: function() {
      return '<div class="ftDragHelper"/>'
    },
    revert: "invalid",
    revertDuration: 300,
    scroll: !0,
    start: function(a) {
      c.draggableStart.call(c, a);
      a.stopPropagation();
      return !0
    },
    stop: function() {
      c.resetDragDropState.call(c)
    }
  }
};
FancyTree.prototype.getDroppableParams = function() {
  var c = this;
  return {
    tolerance: "pointer",
    hoverClass: "ftDragOver",
    accept: function() {
      return c.canAcceptDropTo
    },
    drop: function() {}
  }
};
FancyTree.prototype.getGenericDroppableParams = function() {
  var c = this;
  return {
    accept: "*",
    tolerance: "pointer",
    hoverClass: "ftDragOver",
    drop: function(a, b) {
      c.onItemRowDrop(a, b);
      a.stopPropagation();
      return !1
    }
  }
};
FancyTree.prototype.resetDragDropState = function(c) {
  this.canAcceptDropTo = this.dragging = !1;
  this.draggingTo = this.draggingOverRow = this.draggingRow = null;
  this.dragSelectedCollapsedRow = this.dragToreOffParent = !1;
  $(".ftDragToChild").removeClass("ftDragToChild");
  this.hideDragInsertBar();
  this.draggingJustCancelled = !0;
  $(".ui-draggable-dragging").trigger("mouseup");
  c && setTimeout(c, 0)
};
FancyTree.prototype.draggableStart = function(c) {
  var a = this,
    b = $(c.target),
    d = a.getParentRowNode(b),
    b = a.getRowTypeParams(d),
    e = a.getGenericDroppableParams();
  a.dragging = !0;
  a.dropping = !1;
  a.draggingRow = d;
  a.canAcceptDropTo = !1;
  a.dragSelectedCollapsedRow = !1;
  a.root.find(".ftChildren").droppable(e);
  $(".ftBottomPadding").show();
  a.hideTooltip.call(a);
  var e = d.hasClass("ftCollapsed"),
    f = 0;
  a.dragAutoSelectedChildren = !1;
  if (c.ctrlKey||c.metaKey) a.clearMultiSelection.call(a), a.toggleMultiSelectionSingle.call(a, d, !0), a.dragToreOffParent = !0;
  else {
    a.dragToreOffParent = !1;
    if (0 == a.multiSelection.length || !d.hasClass("ftSelected")) a.clearMultiSelection.call(a), a.toggleMultiSelectionSingle.call(a, d, !0), a.dragSelectedCollapsedRow = e, !e && (a.autoSelectChildrenOnDrag && b.permitAutoSelectChildren) && d.children(".ftChildren").find(".ftRowNode").each(function(b, c) {
      var d = $(c);
      0 < d.parents(".ftCollapsed").length || (a.toggleMultiSelectionSingle.call(a, d, !0), a.dragAutoSelectedChildren = !0)
    }), 0 < a.getChildrenCount(d) && (d.children(".ftChildren").addClass("ftDrawAttention"),
      setTimeout(function() {
        d.children(".ftChildren").removeClass("ftDrawAttention")
      }, 350));
    c.shiftKey ? a.multiSelection.find(".ftRowNode").each(function(b, c) {
      a.toggleMultiSelectionSingle.call(a, $(c), !0)
    }) : b.autoselectChildrenOnDrag && (b = a.multiSelection.filter(function(a, b) {
      return $(b).hasClass("ftCollapsed")
    }), b.find(".ftRowNode:not(.ftSelected)").each(function(b, c) {
      a.toggleMultiSelectionSingle.call(a, $(c), !0)
    }), f = b.find(".ftRowNode.ftSelected").length)
  }
  this.updateDragHelper(c, f)
};
FancyTree.prototype.onItemRowMouseMove = function(c) {
  var a = c.data.treeObj;
  if (a.dragging) {
    var b = $(".ftDragHelper"),
      d = a.scrollTargetElem.position().top + a.scrollTargetElem.height();
    c.pageY + 80 > d ? b.css("margin-top", "-150px") : b.css("margin-top", "");
    var b = $(c.target),
      b = b.hasClass("ftBottomPadding") ? a.root.find(".ftRowNode").last() : a.getParentRowNode(b),
      d = a.getItemRow(b),
      e = a.getItemRowContent(b),
      f = a.getRowTypeParams(a.draggingRow),
      j = f.allowedDropTargets,
      g = b.attr("rowtype");
    if (0 <= j.indexOf(g)) {
      var g = d.height(),
        c = (c.pageY - d.offset().top) / g,
        g = a.getChildrenContainer(b).children(),
        i = b.hasClass("ftCollapsed"),
        h = b.parent().parent().hasClass("ftRoot");
      if (a.multiSelection.is(b)) d = ["append", e];
      else if (c <= DRAG_TO_ABOVE_SENSITIVITY_RATIO)
        if (h && f.allowAtTopLevel && 0 <= j.indexOf("ROOT")) d = ["before", d];
        else if (!h || f.allowAtTopLevel && 0 <= j.indexOf("ROOT")) d = ["before", e];
      else {
        if (!h && !f.allowAtChildLevel) {
          a.canAcceptDropTo = !1;
          return
        }
        if (0 == g.length || i) d = ["append", e];
        else if (h && !f.allowAtTopLevel)
          if (f.allowAtChildLevel) d = ["prepend",
            e
          ];
          else {
            a.canAcceptDropTo = !1;
            return
          }
        else d = ["after", e]
      } else d = h && !f.allowAtChildLevel ? ["before", d] : c >= DRAG_TO_BELOW_SENSITIVITY_RATIO ? 0 < g.length && !i ? ["before", a.getItemRowContent(g.first())] : h && 0 == g.length ? ["append", e] : ["after", e] : 0 < g.length && !i ? ["prepend", e] : ["append", e];
      if (!a.allowDropHandler || allowDropHandler(a.multiSelection, d[0], a.getParentRowNode(d[1]))) a.canAcceptDropTo = !0, a.draggingOverRow = b, $(".ftDragToChild").removeClass("ftDragToChild"), a.hideDragInsertBar.call(a), a.drawDragInsertBar.call(a,
        d[0], d[1], a.getParentRowNode(d[1]).attr("rowtype")), a.draggingTo = d[0], a.draggingOverRow = a.getParentRowNode(d[1])
    }
  }
};
FancyTree.prototype.onItemRowDrop = function() {
  if (this.dropping || !this.canAcceptDropTo || !this.draggingOverRow) return !1;
  this.dropping = !0;
  this.sortMultiSelection();
  var c = this.multiSelection.not(this.draggingOverRow);
  if (0 == c.length) return !1;
  var a = $.fx.off;
  if (1 == c.length && !this.dragToreOffParent || this.dragSelectedCollapsedRow) $.fx.off = !0;
  var b = this;
  this.moveRowSetAnimate(c, this.draggingTo, this.draggingOverRow, function(c) {
    $.fx.off = a;
    b.sortMultiSelection();
    if (b.onRowsMoved) b.onRowsMoved(c);
    setTimeout(function() {
      b.dropping = !1
    }, 1E3)
  });
  return !1
};
FancyTree.prototype.updateDragHelper = function(c, a) {
  var b = "";
  (c.ctrlKey||c.metaKey) ? b = "Dragging hovered row." : c.shiftKey ? b = "Autoselected children." : this.autoSelectChildrenOnDrag && this.dragAutoSelectedChildren ? b = "Ctrl+drag: drag just the hovered row." : this.autoSelectChildrenOnDrag || (b = "Shift+drag: also drag all children rows.");
  b += (b ? "<br/>" : "") + "Hit Esc to cancel.";
  $(".ftDragHelper").html('<div class="ftDragHelperMessage">Moving ' + this.multiSelection.length + " row" + (1 == this.multiSelection.length ? "" : "s") + (0 < a ? " (" +
    a + " hidden)" : "") + '</div><div class="ftDragHelperFooter">' + b + "</div>")
};
FancyTree.prototype.drawDragInsertBar = function(c, a, b) {
  var d = a.offset(),
    e = d.left,
    d = d.top,
    f = a.width(),
    j = a.height();
  switch (c) {
    case "before":
      this.drawDragInsertBarAt(b, e, d - 1, f, 0);
      break;
    case "after":
      this.drawDragInsertBarAt(b, e, d + j + 3, f, 0);
      break;
    case "prepend":
      this.getParentRowNode(a).addClass("ftDragToChild");
      this.hideDragInsertBar();
      break;
    case "append":
      this.getParentRowNode(a).addClass("ftDragToChild"), this.hideDragInsertBar()
  }
};
FancyTree.prototype.drawDragInsertBarAt = function(c, a, b, d, e) {
  var f = $("#ftDragInsertBar");
  f.attr("targetrowtype", c);
  0 == f.length && (f = $("<div/>", {
    id: "ftDragInsertBar"
  }), $("body").append(f));
  f.css({
    left: a,
    top: b,
    width: d,
    height: e
  });
  f.show();
  f.droppable(this.getGenericDroppableParams)
};
FancyTree.prototype.hideDragInsertBar = function() {
  $("#ftDragInsertBar").hide()
};
FancyTree.prototype.moveRowSetAnimate = function(c, a, b, d) {
  var e = this;
  if (0 == c.length) throw Error("Nothing to move");
  var f = 0;
  c.each(function(a, b) {
    var c = $(b).children(".ftItemRow").height();
    c > f && (f = c)
  });
  var j;
  e.slideOutAndShrink.call(e, c, f, function(f) {
    j = e.moveRowSet.call(e, c, a, b);
    e.growAndSlideIn.call(e, c, f, function() {
      d && d(j)
    })
  })
};
FancyTree.prototype.moveRowSet = function(c, a, b) {
  c = this.planMoveRowSet(c, a, b);
  c = this.performMoveRowSet(c);
  this.reconfigureRowSetAfterMove([]);
  return c
};
FancyTree.prototype.performMoveRowSet = function(c) {
  for (var a = [], b = 0; b < c.length; b++) {
    var d = c[b];
    "nomove" == d.relation ? (d.staticMove = !0, a.push(d)) : a.push(this.moveRowRel(d.row, d.relation, d.to, d.keepChildren, !0))
  }
  return a
};
FancyTree.prototype.reconfigureRowSetAfterMove = function(c) {
  var a = this;
  (0 == c.length ? this.root.find(".ftRowNode") : c.find(".ftRowNode").add(c)).each(function(b, c) {
    var e = $(c);
    a.setDraggableDroppable.call(a, e);
    a.updateRowExpander.call(a, e);
    a.setRowButtonTooltips.call(a, e);
    a.formatRowTitle.call(a, e)
  })
};
FancyTree.prototype.findNearestInsertPoint = function(c, a, b) {
  return b ? this.findNearestInsertPointAfter(c, a) : this.findNearestInsertPointBefore(c, a)
};
FancyTree.prototype.findNearestInsertPointBefore = function(c, a) {
  var b = c.prevUntil().not(a).first();
  if (1 == b.length) return ["after", b];
  b = c.parent().parent();
  return b.is(a) ? this.findNearestInsertPointBefore(b, a) : ["prepend", b]
};
FancyTree.prototype.findNearestInsertPointAfter = function(c, a) {
  var b = c.nextUntil().not(a).first();
  if (1 == b.length) return ["before", b];
  b = c.parent().parent();
  return b.is(a) ? this.findNearestInsertPointAfter(b, a) : ["append", b]
};
FancyTree.prototype.stripHiddenCollapsedRowsFromRowSet = function(c) {
  return c.filter(function(a, b) {
    return 0 == $(b).parents().filter(function(a, b) {
      return $(b).is(c) && $(b).hasClass("ftCollapsed")
    }).length
  })
};
FancyTree.prototype.planMoveRowSet = function(c, a, b) {
  var d = [],
    c = this.stripHiddenCollapsedRowsFromRowSet(c);
  c.each(function(a, b) {
    var e = $(b),
      f = e.parent().closest(c);
    d.push([e, f])
  });
  var e = [a, b];
  if (("after" == a || "before" == a) && b.is(c)) e = this.findNearestInsertPoint(b, c, "after" == a);
  for (var f, j, g = [], i = 0; i < d.length; i++) {
    var h = d[i][0],
      l = d[i][1];
    if (h.is(b) && ("prepend" == a || "append" == a)) g.push({
      row: h,
      relation: "nomove",
      keepChildren: !1
    });
    else {
      var k = this.getRowTypeParams(h),
        k = h.hasClass("ftCollapsed") || k.alwaysMoveChildren;
      0 == l.length ? g.push({
        row: h,
        relation: e[0],
        to: e[1],
        keepChildren: k
      }) : (f && f.is(l) ? g.push({
        row: h,
        relation: "after",
        to: j,
        keepChildren: k
      }) : "append" == a ? g.push({
        row: h,
        relation: "append",
        to: l,
        keepChildren: k
      }) : g.push({
        row: h,
        relation: "prepend",
        to: l,
        keepChildren: k
      }), f = l, j = h);
      if ("prepend" == e[0] || 0 == l.length) e[0] = "after", e[1] = h
    }
  }
  var m = [];
  c.each(function(a, b) {
    m.push(b.id)
  });
  a = ["plan results for $rows", m.join(", "), "relation", a, "$toRow", b.attr("id")].join(" ");
  for (i = 0; i < g.length; i++) b = g[i], a += "\r\n" + [1 + i + ". " + b.row.attr("id"),
    b.relation, "nomove" != b.relation ? b.to.attr("id") : "", k ? " KEEP CHILDREN" : ""
  ].join(" ");
  this.log(a);
  return g
};