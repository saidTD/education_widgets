function hello() {
   console.log("hello");
 }
 var top = "top";
 var bottom = "bottom";
 var right = "right";
 var left = "left";
 var auto = "auto";
 var basePlacements = [top, bottom, right, left];
 var start = "start";
 var end = "end";
 var clippingParents = "clippingParents";
 var viewport = "viewport";
 var popper = "popper";
 var reference = "reference";
 var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
   return acc.concat([placement + "-" + start, placement + "-" + end]);
 }, []);
 var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
   return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
 }, []);
 var beforeRead = "beforeRead";
 var read = "read";
 var afterRead = "afterRead";
 var beforeMain = "beforeMain";
 var main$1 = "main";
 var afterMain = "afterMain";
 var beforeWrite = "beforeWrite";
 var write = "write";
 var afterWrite = "afterWrite";
 var modifierPhases = [beforeRead, read, afterRead, beforeMain, main$1, afterMain, beforeWrite, write, afterWrite];
 function getNodeName(element) {
   return element ? (element.nodeName || "").toLowerCase() : null;
 }
 function getWindow(node) {
   if (node == null) {
     return window;
   }
   if (node.toString() !== "[object Window]") {
     var ownerDocument = node.ownerDocument;
     return ownerDocument ? ownerDocument.defaultView || window : window;
   }
   return node;
 }
 function isElement(node) {
   var OwnElement = getWindow(node).Element;
   return node instanceof OwnElement || node instanceof Element;
 }
 function isHTMLElement(node) {
   var OwnElement = getWindow(node).HTMLElement;
   return node instanceof OwnElement || node instanceof HTMLElement;
 }
 function isShadowRoot(node) {
   if (typeof ShadowRoot === "undefined") {
     return false;
   }
   var OwnElement = getWindow(node).ShadowRoot;
   return node instanceof OwnElement || node instanceof ShadowRoot;
 }
 function applyStyles(_ref) {
   var state = _ref.state;
   Object.keys(state.elements).forEach(function(name) {
     var style = state.styles[name] || {};
     var attributes = state.attributes[name] || {};
     var element = state.elements[name];
     if (!isHTMLElement(element) || !getNodeName(element)) {
       return;
     }
     Object.assign(element.style, style);
     Object.keys(attributes).forEach(function(name2) {
       var value = attributes[name2];
       if (value === false) {
         element.removeAttribute(name2);
       } else {
         element.setAttribute(name2, value === true ? "" : value);
       }
     });
   });
 }
 function effect$2(_ref2) {
   var state = _ref2.state;
   var initialStyles = {
     popper: {
       position: state.options.strategy,
       left: "0",
       top: "0",
       margin: "0"
     },
     arrow: {
       position: "absolute"
     },
     reference: {}
   };
   Object.assign(state.elements.popper.style, initialStyles.popper);
   state.styles = initialStyles;
   if (state.elements.arrow) {
     Object.assign(state.elements.arrow.style, initialStyles.arrow);
   }
   return function() {
     Object.keys(state.elements).forEach(function(name) {
       var element = state.elements[name];
       var attributes = state.attributes[name] || {};
       var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
       var style = styleProperties.reduce(function(style2, property) {
         style2[property] = "";
         return style2;
       }, {});
       if (!isHTMLElement(element) || !getNodeName(element)) {
         return;
       }
       Object.assign(element.style, style);
       Object.keys(attributes).forEach(function(attribute) {
         element.removeAttribute(attribute);
       });
     });
   };
 }
 const applyStyles$1 = {
   name: "applyStyles",
   enabled: true,
   phase: "write",
   fn: applyStyles,
   effect: effect$2,
   requires: ["computeStyles"]
 };
 function getBasePlacement(placement) {
   return placement.split("-")[0];
 }
 var max = Math.max;
 var min = Math.min;
 var round = Math.round;
 function getUAString() {
   var uaData = navigator.userAgentData;
   if (uaData != null && uaData.brands) {
     return uaData.brands.map(function(item) {
       return item.brand + "/" + item.version;
     }).join(" ");
   }
   return navigator.userAgent;
 }
 function isLayoutViewport() {
   return !/^((?!chrome|android).)*safari/i.test(getUAString());
 }
 function getBoundingClientRect(element, includeScale, isFixedStrategy) {
   if (includeScale === void 0) {
     includeScale = false;
   }
   if (isFixedStrategy === void 0) {
     isFixedStrategy = false;
   }
   var clientRect = element.getBoundingClientRect();
   var scaleX = 1;
   var scaleY = 1;
   if (includeScale && isHTMLElement(element)) {
     scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
     scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
   }
   var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
   var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
   var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
   var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
   var width = clientRect.width / scaleX;
   var height = clientRect.height / scaleY;
   return {
     width,
     height,
     top: y,
     right: x + width,
     bottom: y + height,
     left: x,
     x,
     y
   };
 }
 function getLayoutRect(element) {
   var clientRect = getBoundingClientRect(element);
   var width = element.offsetWidth;
   var height = element.offsetHeight;
   if (Math.abs(clientRect.width - width) <= 1) {
     width = clientRect.width;
   }
   if (Math.abs(clientRect.height - height) <= 1) {
     height = clientRect.height;
   }
   return {
     x: element.offsetLeft,
     y: element.offsetTop,
     width,
     height
   };
 }
 function contains(parent, child) {
   var rootNode = child.getRootNode && child.getRootNode();
   if (parent.contains(child)) {
     return true;
   } else if (rootNode && isShadowRoot(rootNode)) {
     var next = child;
     do {
       if (next && parent.isSameNode(next)) {
         return true;
       }
       next = next.parentNode || next.host;
     } while (next);
   }
   return false;
 }
 function getComputedStyle$1(element) {
   return getWindow(element).getComputedStyle(element);
 }
 function isTableElement(element) {
   return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
 }
 function getDocumentElement(element) {
   return ((isElement(element) ? element.ownerDocument : (
     // $FlowFixMe[prop-missing]
     element.document
   )) || window.document).documentElement;
 }
 function getParentNode(element) {
   if (getNodeName(element) === "html") {
     return element;
   }
   return (
     // this is a quicker (but less type safe) way to save quite some bytes from the bundle
     // $FlowFixMe[incompatible-return]
     // $FlowFixMe[prop-missing]
     element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
     element.parentNode || // DOM Element detected
     (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
     // $FlowFixMe[incompatible-call]: HTMLElement is a Node
     getDocumentElement(element)
   );
 }
 function getTrueOffsetParent(element) {
   if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
   getComputedStyle$1(element).position === "fixed") {
     return null;
   }
   return element.offsetParent;
 }
 function getContainingBlock(element) {
   var isFirefox = /firefox/i.test(getUAString());
   var isIE = /Trident/i.test(getUAString());
   if (isIE && isHTMLElement(element)) {
     var elementCss = getComputedStyle$1(element);
     if (elementCss.position === "fixed") {
       return null;
     }
   }
   var currentNode = getParentNode(element);
   if (isShadowRoot(currentNode)) {
     currentNode = currentNode.host;
   }
   while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
     var css = getComputedStyle$1(currentNode);
     if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
       return currentNode;
     } else {
       currentNode = currentNode.parentNode;
     }
   }
   return null;
 }
 function getOffsetParent(element) {
   var window2 = getWindow(element);
   var offsetParent = getTrueOffsetParent(element);
   while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") {
     offsetParent = getTrueOffsetParent(offsetParent);
   }
   if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static")) {
     return window2;
   }
   return offsetParent || getContainingBlock(element) || window2;
 }
 function getMainAxisFromPlacement(placement) {
   return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
 }
 function within(min$1, value, max$1) {
   return max(min$1, min(value, max$1));
 }
 function withinMaxClamp(min2, value, max2) {
   var v = within(min2, value, max2);
   return v > max2 ? max2 : v;
 }
 function getFreshSideObject() {
   return {
     top: 0,
     right: 0,
     bottom: 0,
     left: 0
   };
 }
 function mergePaddingObject(paddingObject) {
   return Object.assign({}, getFreshSideObject(), paddingObject);
 }
 function expandToHashMap(value, keys) {
   return keys.reduce(function(hashMap, key) {
     hashMap[key] = value;
     return hashMap;
   }, {});
 }
 var toPaddingObject = function toPaddingObject2(padding, state) {
   padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
     placement: state.placement
   })) : padding;
   return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
 };
 function arrow(_ref) {
   var _state$modifiersData$;
   var state = _ref.state, name = _ref.name, options = _ref.options;
   var arrowElement = state.elements.arrow;
   var popperOffsets2 = state.modifiersData.popperOffsets;
   var basePlacement = getBasePlacement(state.placement);
   var axis = getMainAxisFromPlacement(basePlacement);
   var isVertical = [left, right].indexOf(basePlacement) >= 0;
   var len = isVertical ? "height" : "width";
   if (!arrowElement || !popperOffsets2) {
     return;
   }
   var paddingObject = toPaddingObject(options.padding, state);
   var arrowRect = getLayoutRect(arrowElement);
   var minProp = axis === "y" ? top : left;
   var maxProp = axis === "y" ? bottom : right;
   var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
   var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
   var arrowOffsetParent = getOffsetParent(arrowElement);
   var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
   var centerToReference = endDiff / 2 - startDiff / 2;
   var min2 = paddingObject[minProp];
   var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
   var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
   var offset2 = within(min2, center, max2);
   var axisProp = axis;
   state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
 }
 function effect$1(_ref2) {
   var state = _ref2.state, options = _ref2.options;
   var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
   if (arrowElement == null) {
     return;
   }
   if (typeof arrowElement === "string") {
     arrowElement = state.elements.popper.querySelector(arrowElement);
     if (!arrowElement) {
       return;
     }
   }
   if (!contains(state.elements.popper, arrowElement)) {
     return;
   }
   state.elements.arrow = arrowElement;
 }
 const arrow$1 = {
   name: "arrow",
   enabled: true,
   phase: "main",
   fn: arrow,
   effect: effect$1,
   requires: ["popperOffsets"],
   requiresIfExists: ["preventOverflow"]
 };
 function getVariation(placement) {
   return placement.split("-")[1];
 }
 var unsetSides = {
   top: "auto",
   right: "auto",
   bottom: "auto",
   left: "auto"
 };
 function roundOffsetsByDPR(_ref) {
   var x = _ref.x, y = _ref.y;
   var win = window;
   var dpr = win.devicePixelRatio || 1;
   return {
     x: round(x * dpr) / dpr || 0,
     y: round(y * dpr) / dpr || 0
   };
 }
 function mapToStyles(_ref2) {
   var _Object$assign2;
   var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
   var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
   var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
     x,
     y
   }) : {
     x,
     y
   };
   x = _ref3.x;
   y = _ref3.y;
   var hasX = offsets.hasOwnProperty("x");
   var hasY = offsets.hasOwnProperty("y");
   var sideX = left;
   var sideY = top;
   var win = window;
   if (adaptive) {
     var offsetParent = getOffsetParent(popper2);
     var heightProp = "clientHeight";
     var widthProp = "clientWidth";
     if (offsetParent === getWindow(popper2)) {
       offsetParent = getDocumentElement(popper2);
       if (getComputedStyle$1(offsetParent).position !== "static" && position === "absolute") {
         heightProp = "scrollHeight";
         widthProp = "scrollWidth";
       }
     }
     offsetParent = offsetParent;
     if (placement === top || (placement === left || placement === right) && variation === end) {
       sideY = bottom;
       var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
         // $FlowFixMe[prop-missing]
         offsetParent[heightProp]
       );
       y -= offsetY - popperRect.height;
       y *= gpuAcceleration ? 1 : -1;
     }
     if (placement === left || (placement === top || placement === bottom) && variation === end) {
       sideX = right;
       var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
         // $FlowFixMe[prop-missing]
         offsetParent[widthProp]
       );
       x -= offsetX - popperRect.width;
       x *= gpuAcceleration ? 1 : -1;
     }
   }
   var commonStyles = Object.assign({
     position
   }, adaptive && unsetSides);
   var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
     x,
     y
   }) : {
     x,
     y
   };
   x = _ref4.x;
   y = _ref4.y;
   if (gpuAcceleration) {
     var _Object$assign;
     return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
   }
   return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
 }
 function computeStyles(_ref5) {
   var state = _ref5.state, options = _ref5.options;
   var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
   var commonStyles = {
     placement: getBasePlacement(state.placement),
     variation: getVariation(state.placement),
     popper: state.elements.popper,
     popperRect: state.rects.popper,
     gpuAcceleration,
     isFixed: state.options.strategy === "fixed"
   };
   if (state.modifiersData.popperOffsets != null) {
     state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
       offsets: state.modifiersData.popperOffsets,
       position: state.options.strategy,
       adaptive,
       roundOffsets
     })));
   }
   if (state.modifiersData.arrow != null) {
     state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
       offsets: state.modifiersData.arrow,
       position: "absolute",
       adaptive: false,
       roundOffsets
     })));
   }
   state.attributes.popper = Object.assign({}, state.attributes.popper, {
     "data-popper-placement": state.placement
   });
 }
 const computeStyles$1 = {
   name: "computeStyles",
   enabled: true,
   phase: "beforeWrite",
   fn: computeStyles,
   data: {}
 };
 var passive = {
   passive: true
 };
 function effect(_ref) {
   var state = _ref.state, instance = _ref.instance, options = _ref.options;
   var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
   var window2 = getWindow(state.elements.popper);
   var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
   if (scroll) {
     scrollParents.forEach(function(scrollParent) {
       scrollParent.addEventListener("scroll", instance.update, passive);
     });
   }
   if (resize) {
     window2.addEventListener("resize", instance.update, passive);
   }
   return function() {
     if (scroll) {
       scrollParents.forEach(function(scrollParent) {
         scrollParent.removeEventListener("scroll", instance.update, passive);
       });
     }
     if (resize) {
       window2.removeEventListener("resize", instance.update, passive);
     }
   };
 }
 const eventListeners = {
   name: "eventListeners",
   enabled: true,
   phase: "write",
   fn: function fn() {
   },
   effect,
   data: {}
 };
 var hash$1 = {
   left: "right",
   right: "left",
   bottom: "top",
   top: "bottom"
 };
 function getOppositePlacement(placement) {
   return placement.replace(/left|right|bottom|top/g, function(matched) {
     return hash$1[matched];
   });
 }
 var hash = {
   start: "end",
   end: "start"
 };
 function getOppositeVariationPlacement(placement) {
   return placement.replace(/start|end/g, function(matched) {
     return hash[matched];
   });
 }
 function getWindowScroll(node) {
   var win = getWindow(node);
   var scrollLeft = win.pageXOffset;
   var scrollTop = win.pageYOffset;
   return {
     scrollLeft,
     scrollTop
   };
 }
 function getWindowScrollBarX(element) {
   return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
 }
 function getViewportRect(element, strategy) {
   var win = getWindow(element);
   var html = getDocumentElement(element);
   var visualViewport = win.visualViewport;
   var width = html.clientWidth;
   var height = html.clientHeight;
   var x = 0;
   var y = 0;
   if (visualViewport) {
     width = visualViewport.width;
     height = visualViewport.height;
     var layoutViewport = isLayoutViewport();
     if (layoutViewport || !layoutViewport && strategy === "fixed") {
       x = visualViewport.offsetLeft;
       y = visualViewport.offsetTop;
     }
   }
   return {
     width,
     height,
     x: x + getWindowScrollBarX(element),
     y
   };
 }
 function getDocumentRect(element) {
   var _element$ownerDocumen;
   var html = getDocumentElement(element);
   var winScroll = getWindowScroll(element);
   var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
   var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
   var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
   var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
   var y = -winScroll.scrollTop;
   if (getComputedStyle$1(body || html).direction === "rtl") {
     x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
   }
   return {
     width,
     height,
     x,
     y
   };
 }
 function isScrollParent(element) {
   var _getComputedStyle = getComputedStyle$1(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
   return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
 }
 function getScrollParent(node) {
   if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
     return node.ownerDocument.body;
   }
   if (isHTMLElement(node) && isScrollParent(node)) {
     return node;
   }
   return getScrollParent(getParentNode(node));
 }
 function listScrollParents(element, list) {
   var _element$ownerDocumen;
   if (list === void 0) {
     list = [];
   }
   var scrollParent = getScrollParent(element);
   var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
   var win = getWindow(scrollParent);
   var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
   var updatedList = list.concat(target);
   return isBody ? updatedList : (
     // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
     updatedList.concat(listScrollParents(getParentNode(target)))
   );
 }
 function rectToClientRect(rect) {
   return Object.assign({}, rect, {
     left: rect.x,
     top: rect.y,
     right: rect.x + rect.width,
     bottom: rect.y + rect.height
   });
 }
 function getInnerBoundingClientRect(element, strategy) {
   var rect = getBoundingClientRect(element, false, strategy === "fixed");
   rect.top = rect.top + element.clientTop;
   rect.left = rect.left + element.clientLeft;
   rect.bottom = rect.top + element.clientHeight;
   rect.right = rect.left + element.clientWidth;
   rect.width = element.clientWidth;
   rect.height = element.clientHeight;
   rect.x = rect.left;
   rect.y = rect.top;
   return rect;
 }
 function getClientRectFromMixedType(element, clippingParent, strategy) {
   return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
 }
 function getClippingParents(element) {
   var clippingParents2 = listScrollParents(getParentNode(element));
   var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle$1(element).position) >= 0;
   var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
   if (!isElement(clipperElement)) {
     return [];
   }
   return clippingParents2.filter(function(clippingParent) {
     return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
   });
 }
 function getClippingRect(element, boundary, rootBoundary, strategy) {
   var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
   var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
   var firstClippingParent = clippingParents2[0];
   var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
     var rect = getClientRectFromMixedType(element, clippingParent, strategy);
     accRect.top = max(rect.top, accRect.top);
     accRect.right = min(rect.right, accRect.right);
     accRect.bottom = min(rect.bottom, accRect.bottom);
     accRect.left = max(rect.left, accRect.left);
     return accRect;
   }, getClientRectFromMixedType(element, firstClippingParent, strategy));
   clippingRect.width = clippingRect.right - clippingRect.left;
   clippingRect.height = clippingRect.bottom - clippingRect.top;
   clippingRect.x = clippingRect.left;
   clippingRect.y = clippingRect.top;
   return clippingRect;
 }
 function computeOffsets(_ref) {
   var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
   var basePlacement = placement ? getBasePlacement(placement) : null;
   var variation = placement ? getVariation(placement) : null;
   var commonX = reference2.x + reference2.width / 2 - element.width / 2;
   var commonY = reference2.y + reference2.height / 2 - element.height / 2;
   var offsets;
   switch (basePlacement) {
     case top:
       offsets = {
         x: commonX,
         y: reference2.y - element.height
       };
       break;
     case bottom:
       offsets = {
         x: commonX,
         y: reference2.y + reference2.height
       };
       break;
     case right:
       offsets = {
         x: reference2.x + reference2.width,
         y: commonY
       };
       break;
     case left:
       offsets = {
         x: reference2.x - element.width,
         y: commonY
       };
       break;
     default:
       offsets = {
         x: reference2.x,
         y: reference2.y
       };
   }
   var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
   if (mainAxis != null) {
     var len = mainAxis === "y" ? "height" : "width";
     switch (variation) {
       case start:
         offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
         break;
       case end:
         offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
         break;
     }
   }
   return offsets;
 }
 function detectOverflow(state, options) {
   if (options === void 0) {
     options = {};
   }
   var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
   var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
   var altContext = elementContext === popper ? reference : popper;
   var popperRect = state.rects.popper;
   var element = state.elements[altBoundary ? altContext : elementContext];
   var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
   var referenceClientRect = getBoundingClientRect(state.elements.reference);
   var popperOffsets2 = computeOffsets({
     reference: referenceClientRect,
     element: popperRect,
     strategy: "absolute",
     placement
   });
   var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
   var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
   var overflowOffsets = {
     top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
     bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
     left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
     right: elementClientRect.right - clippingClientRect.right + paddingObject.right
   };
   var offsetData = state.modifiersData.offset;
   if (elementContext === popper && offsetData) {
     var offset2 = offsetData[placement];
     Object.keys(overflowOffsets).forEach(function(key) {
       var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
       var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
       overflowOffsets[key] += offset2[axis] * multiply;
     });
   }
   return overflowOffsets;
 }
 function computeAutoPlacement(state, options) {
   if (options === void 0) {
     options = {};
   }
   var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
   var variation = getVariation(placement);
   var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
     return getVariation(placement2) === variation;
   }) : basePlacements;
   var allowedPlacements = placements$1.filter(function(placement2) {
     return allowedAutoPlacements.indexOf(placement2) >= 0;
   });
   if (allowedPlacements.length === 0) {
     allowedPlacements = placements$1;
   }
   var overflows = allowedPlacements.reduce(function(acc, placement2) {
     acc[placement2] = detectOverflow(state, {
       placement: placement2,
       boundary,
       rootBoundary,
       padding
     })[getBasePlacement(placement2)];
     return acc;
   }, {});
   return Object.keys(overflows).sort(function(a, b) {
     return overflows[a] - overflows[b];
   });
 }
 function getExpandedFallbackPlacements(placement) {
   if (getBasePlacement(placement) === auto) {
     return [];
   }
   var oppositePlacement = getOppositePlacement(placement);
   return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
 }
 function flip(_ref) {
   var state = _ref.state, options = _ref.options, name = _ref.name;
   if (state.modifiersData[name]._skip) {
     return;
   }
   var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
   var preferredPlacement = state.options.placement;
   var basePlacement = getBasePlacement(preferredPlacement);
   var isBasePlacement = basePlacement === preferredPlacement;
   var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
   var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
     return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
       placement: placement2,
       boundary,
       rootBoundary,
       padding,
       flipVariations,
       allowedAutoPlacements
     }) : placement2);
   }, []);
   var referenceRect = state.rects.reference;
   var popperRect = state.rects.popper;
   var checksMap = /* @__PURE__ */ new Map();
   var makeFallbackChecks = true;
   var firstFittingPlacement = placements2[0];
   for (var i = 0; i < placements2.length; i++) {
     var placement = placements2[i];
     var _basePlacement = getBasePlacement(placement);
     var isStartVariation = getVariation(placement) === start;
     var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
     var len = isVertical ? "width" : "height";
     var overflow = detectOverflow(state, {
       placement,
       boundary,
       rootBoundary,
       altBoundary,
       padding
     });
     var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
     if (referenceRect[len] > popperRect[len]) {
       mainVariationSide = getOppositePlacement(mainVariationSide);
     }
     var altVariationSide = getOppositePlacement(mainVariationSide);
     var checks = [];
     if (checkMainAxis) {
       checks.push(overflow[_basePlacement] <= 0);
     }
     if (checkAltAxis) {
       checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
     }
     if (checks.every(function(check) {
       return check;
     })) {
       firstFittingPlacement = placement;
       makeFallbackChecks = false;
       break;
     }
     checksMap.set(placement, checks);
   }
   if (makeFallbackChecks) {
     var numberOfChecks = flipVariations ? 3 : 1;
     var _loop = function _loop2(_i2) {
       var fittingPlacement = placements2.find(function(placement2) {
         var checks2 = checksMap.get(placement2);
         if (checks2) {
           return checks2.slice(0, _i2).every(function(check) {
             return check;
           });
         }
       });
       if (fittingPlacement) {
         firstFittingPlacement = fittingPlacement;
         return "break";
       }
     };
     for (var _i = numberOfChecks; _i > 0; _i--) {
       var _ret = _loop(_i);
       if (_ret === "break")
         break;
     }
   }
   if (state.placement !== firstFittingPlacement) {
     state.modifiersData[name]._skip = true;
     state.placement = firstFittingPlacement;
     state.reset = true;
   }
 }
 const flip$1 = {
   name: "flip",
   enabled: true,
   phase: "main",
   fn: flip,
   requiresIfExists: ["offset"],
   data: {
     _skip: false
   }
 };
 function getSideOffsets(overflow, rect, preventedOffsets) {
   if (preventedOffsets === void 0) {
     preventedOffsets = {
       x: 0,
       y: 0
     };
   }
   return {
     top: overflow.top - rect.height - preventedOffsets.y,
     right: overflow.right - rect.width + preventedOffsets.x,
     bottom: overflow.bottom - rect.height + preventedOffsets.y,
     left: overflow.left - rect.width - preventedOffsets.x
   };
 }
 function isAnySideFullyClipped(overflow) {
   return [top, right, bottom, left].some(function(side) {
     return overflow[side] >= 0;
   });
 }
 function hide(_ref) {
   var state = _ref.state, name = _ref.name;
   var referenceRect = state.rects.reference;
   var popperRect = state.rects.popper;
   var preventedOffsets = state.modifiersData.preventOverflow;
   var referenceOverflow = detectOverflow(state, {
     elementContext: "reference"
   });
   var popperAltOverflow = detectOverflow(state, {
     altBoundary: true
   });
   var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
   var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
   var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
   var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
   state.modifiersData[name] = {
     referenceClippingOffsets,
     popperEscapeOffsets,
     isReferenceHidden,
     hasPopperEscaped
   };
   state.attributes.popper = Object.assign({}, state.attributes.popper, {
     "data-popper-reference-hidden": isReferenceHidden,
     "data-popper-escaped": hasPopperEscaped
   });
 }
 const hide$1 = {
   name: "hide",
   enabled: true,
   phase: "main",
   requiresIfExists: ["preventOverflow"],
   fn: hide
 };
 function distanceAndSkiddingToXY(placement, rects, offset2) {
   var basePlacement = getBasePlacement(placement);
   var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
   var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
     placement
   })) : offset2, skidding = _ref[0], distance = _ref[1];
   skidding = skidding || 0;
   distance = (distance || 0) * invertDistance;
   return [left, right].indexOf(basePlacement) >= 0 ? {
     x: distance,
     y: skidding
   } : {
     x: skidding,
     y: distance
   };
 }
 function offset(_ref2) {
   var state = _ref2.state, options = _ref2.options, name = _ref2.name;
   var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
   var data2 = placements.reduce(function(acc, placement) {
     acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
     return acc;
   }, {});
   var _data$state$placement = data2[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
   if (state.modifiersData.popperOffsets != null) {
     state.modifiersData.popperOffsets.x += x;
     state.modifiersData.popperOffsets.y += y;
   }
   state.modifiersData[name] = data2;
 }
 const offset$1 = {
   name: "offset",
   enabled: true,
   phase: "main",
   requires: ["popperOffsets"],
   fn: offset
 };
 function popperOffsets(_ref) {
   var state = _ref.state, name = _ref.name;
   state.modifiersData[name] = computeOffsets({
     reference: state.rects.reference,
     element: state.rects.popper,
     strategy: "absolute",
     placement: state.placement
   });
 }
 const popperOffsets$1 = {
   name: "popperOffsets",
   enabled: true,
   phase: "read",
   fn: popperOffsets,
   data: {}
 };
 function getAltAxis(axis) {
   return axis === "x" ? "y" : "x";
 }
 function preventOverflow(_ref) {
   var state = _ref.state, options = _ref.options, name = _ref.name;
   var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
   var overflow = detectOverflow(state, {
     boundary,
     rootBoundary,
     padding,
     altBoundary
   });
   var basePlacement = getBasePlacement(state.placement);
   var variation = getVariation(state.placement);
   var isBasePlacement = !variation;
   var mainAxis = getMainAxisFromPlacement(basePlacement);
   var altAxis = getAltAxis(mainAxis);
   var popperOffsets2 = state.modifiersData.popperOffsets;
   var referenceRect = state.rects.reference;
   var popperRect = state.rects.popper;
   var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
     placement: state.placement
   })) : tetherOffset;
   var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
     mainAxis: tetherOffsetValue,
     altAxis: tetherOffsetValue
   } : Object.assign({
     mainAxis: 0,
     altAxis: 0
   }, tetherOffsetValue);
   var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
   var data2 = {
     x: 0,
     y: 0
   };
   if (!popperOffsets2) {
     return;
   }
   if (checkMainAxis) {
     var _offsetModifierState$;
     var mainSide = mainAxis === "y" ? top : left;
     var altSide = mainAxis === "y" ? bottom : right;
     var len = mainAxis === "y" ? "height" : "width";
     var offset2 = popperOffsets2[mainAxis];
     var min$1 = offset2 + overflow[mainSide];
     var max$1 = offset2 - overflow[altSide];
     var additive = tether ? -popperRect[len] / 2 : 0;
     var minLen = variation === start ? referenceRect[len] : popperRect[len];
     var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
     var arrowElement = state.elements.arrow;
     var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
       width: 0,
       height: 0
     };
     var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
     var arrowPaddingMin = arrowPaddingObject[mainSide];
     var arrowPaddingMax = arrowPaddingObject[altSide];
     var arrowLen = within(0, referenceRect[len], arrowRect[len]);
     var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
     var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
     var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
     var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
     var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
     var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
     var tetherMax = offset2 + maxOffset - offsetModifierValue;
     var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
     popperOffsets2[mainAxis] = preventedOffset;
     data2[mainAxis] = preventedOffset - offset2;
   }
   if (checkAltAxis) {
     var _offsetModifierState$2;
     var _mainSide = mainAxis === "x" ? top : left;
     var _altSide = mainAxis === "x" ? bottom : right;
     var _offset = popperOffsets2[altAxis];
     var _len = altAxis === "y" ? "height" : "width";
     var _min = _offset + overflow[_mainSide];
     var _max = _offset - overflow[_altSide];
     var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
     var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
     var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
     var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
     var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
     popperOffsets2[altAxis] = _preventedOffset;
     data2[altAxis] = _preventedOffset - _offset;
   }
   state.modifiersData[name] = data2;
 }
 const preventOverflow$1 = {
   name: "preventOverflow",
   enabled: true,
   phase: "main",
   fn: preventOverflow,
   requiresIfExists: ["offset"]
 };
 function getHTMLElementScroll(element) {
   return {
     scrollLeft: element.scrollLeft,
     scrollTop: element.scrollTop
   };
 }
 function getNodeScroll(node) {
   if (node === getWindow(node) || !isHTMLElement(node)) {
     return getWindowScroll(node);
   } else {
     return getHTMLElementScroll(node);
   }
 }
 function isElementScaled(element) {
   var rect = element.getBoundingClientRect();
   var scaleX = round(rect.width) / element.offsetWidth || 1;
   var scaleY = round(rect.height) / element.offsetHeight || 1;
   return scaleX !== 1 || scaleY !== 1;
 }
 function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
   if (isFixed === void 0) {
     isFixed = false;
   }
   var isOffsetParentAnElement = isHTMLElement(offsetParent);
   var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
   var documentElement = getDocumentElement(offsetParent);
   var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
   var scroll = {
     scrollLeft: 0,
     scrollTop: 0
   };
   var offsets = {
     x: 0,
     y: 0
   };
   if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
     if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
     isScrollParent(documentElement)) {
       scroll = getNodeScroll(offsetParent);
     }
     if (isHTMLElement(offsetParent)) {
       offsets = getBoundingClientRect(offsetParent, true);
       offsets.x += offsetParent.clientLeft;
       offsets.y += offsetParent.clientTop;
     } else if (documentElement) {
       offsets.x = getWindowScrollBarX(documentElement);
     }
   }
   return {
     x: rect.left + scroll.scrollLeft - offsets.x,
     y: rect.top + scroll.scrollTop - offsets.y,
     width: rect.width,
     height: rect.height
   };
 }
 function order(modifiers) {
   var map = /* @__PURE__ */ new Map();
   var visited = /* @__PURE__ */ new Set();
   var result = [];
   modifiers.forEach(function(modifier) {
     map.set(modifier.name, modifier);
   });
   function sort(modifier) {
     visited.add(modifier.name);
     var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
     requires.forEach(function(dep) {
       if (!visited.has(dep)) {
         var depModifier = map.get(dep);
         if (depModifier) {
           sort(depModifier);
         }
       }
     });
     result.push(modifier);
   }
   modifiers.forEach(function(modifier) {
     if (!visited.has(modifier.name)) {
       sort(modifier);
     }
   });
   return result;
 }
 function orderModifiers(modifiers) {
   var orderedModifiers = order(modifiers);
   return modifierPhases.reduce(function(acc, phase) {
     return acc.concat(orderedModifiers.filter(function(modifier) {
       return modifier.phase === phase;
     }));
   }, []);
 }
 function debounce(fn2) {
   var pending;
   return function() {
     if (!pending) {
       pending = new Promise(function(resolve) {
         Promise.resolve().then(function() {
           pending = void 0;
           resolve(fn2());
         });
       });
     }
     return pending;
   };
 }
 function mergeByName(modifiers) {
   var merged = modifiers.reduce(function(merged2, current) {
     var existing = merged2[current.name];
     merged2[current.name] = existing ? Object.assign({}, existing, current, {
       options: Object.assign({}, existing.options, current.options),
       data: Object.assign({}, existing.data, current.data)
     }) : current;
     return merged2;
   }, {});
   return Object.keys(merged).map(function(key) {
     return merged[key];
   });
 }
 var DEFAULT_OPTIONS = {
   placement: "bottom",
   modifiers: [],
   strategy: "absolute"
 };
 function areValidElements() {
   for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
     args[_key] = arguments[_key];
   }
   return !args.some(function(element) {
     return !(element && typeof element.getBoundingClientRect === "function");
   });
 }
 function popperGenerator(generatorOptions) {
   if (generatorOptions === void 0) {
     generatorOptions = {};
   }
   var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
   return function createPopper2(reference2, popper2, options) {
     if (options === void 0) {
       options = defaultOptions;
     }
     var state = {
       placement: "bottom",
       orderedModifiers: [],
       options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
       modifiersData: {},
       elements: {
         reference: reference2,
         popper: popper2
       },
       attributes: {},
       styles: {}
     };
     var effectCleanupFns = [];
     var isDestroyed = false;
     var instance = {
       state,
       setOptions: function setOptions(setOptionsAction) {
         var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
         cleanupModifierEffects();
         state.options = Object.assign({}, defaultOptions, state.options, options2);
         state.scrollParents = {
           reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
           popper: listScrollParents(popper2)
         };
         var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
         state.orderedModifiers = orderedModifiers.filter(function(m) {
           return m.enabled;
         });
         runModifierEffects();
         return instance.update();
       },
       // Sync update – it will always be executed, even if not necessary. This
       // is useful for low frequency updates where sync behavior simplifies the
       // logic.
       // For high frequency updates (e.g. `resize` and `scroll` events), always
       // prefer the async Popper#update method
       forceUpdate: function forceUpdate() {
         if (isDestroyed) {
           return;
         }
         var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
         if (!areValidElements(reference3, popper3)) {
           return;
         }
         state.rects = {
           reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
           popper: getLayoutRect(popper3)
         };
         state.reset = false;
         state.placement = state.options.placement;
         state.orderedModifiers.forEach(function(modifier) {
           return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
         });
         for (var index = 0; index < state.orderedModifiers.length; index++) {
           if (state.reset === true) {
             state.reset = false;
             index = -1;
             continue;
           }
           var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
           if (typeof fn2 === "function") {
             state = fn2({
               state,
               options: _options,
               name,
               instance
             }) || state;
           }
         }
       },
       // Async and optimistically optimized update – it will not be executed if
       // not necessary (debounced to run at most once-per-tick)
       update: debounce(function() {
         return new Promise(function(resolve) {
           instance.forceUpdate();
           resolve(state);
         });
       }),
       destroy: function destroy() {
         cleanupModifierEffects();
         isDestroyed = true;
       }
     };
     if (!areValidElements(reference2, popper2)) {
       return instance;
     }
     instance.setOptions(options).then(function(state2) {
       if (!isDestroyed && options.onFirstUpdate) {
         options.onFirstUpdate(state2);
       }
     });
     function runModifierEffects() {
       state.orderedModifiers.forEach(function(_ref3) {
         var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect2 = _ref3.effect;
         if (typeof effect2 === "function") {
           var cleanupFn = effect2({
             state,
             name,
             instance,
             options: options2
           });
           var noopFn = function noopFn2() {
           };
           effectCleanupFns.push(cleanupFn || noopFn);
         }
       });
     }
     function cleanupModifierEffects() {
       effectCleanupFns.forEach(function(fn2) {
         return fn2();
       });
       effectCleanupFns = [];
     }
     return instance;
   };
 }
 var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
 var createPopper = /* @__PURE__ */ popperGenerator({
   defaultModifiers
 });
 const popcorn = document.querySelector("#popcorn");
 const tooltip = document.querySelector("#tooltip");
 createPopper(popcorn, tooltip, {
   placement: "top"
 });
 hello();
 const main = "";
 var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
 var carouselExports = {};
 var carousel = {
   get exports() {
     return carouselExports;
   },
   set exports(v) {
     carouselExports = v;
   }
 };
 var utilExports = {};
 var util = {
   get exports() {
     return utilExports;
   },
   set exports(v) {
     utilExports = v;
   }
 };
 /*!
   * Bootstrap index.js v5.3.0-alpha1 (https://getbootstrap.com/)
   * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   */
 var hasRequiredUtil;
 function requireUtil() {
   if (hasRequiredUtil)
     return utilExports;
   hasRequiredUtil = 1;
   (function(module, exports) {
     (function(global2, factory) {
       factory(exports);
     })(commonjsGlobal, function(exports2) {
       const MAX_UID = 1e6;
       const MILLISECONDS_MULTIPLIER = 1e3;
       const TRANSITION_END = "transitionend";
       const parseSelector = (selector) => {
         if (selector && window.CSS && window.CSS.escape) {
           selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
         }
         return selector;
       };
       const toType = (object) => {
         if (object === null || object === void 0) {
           return `${object}`;
         }
         return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
       };
       const getUID = (prefix) => {
         do {
           prefix += Math.floor(Math.random() * MAX_UID);
         } while (document.getElementById(prefix));
         return prefix;
       };
       const getTransitionDurationFromElement = (element) => {
         if (!element) {
           return 0;
         }
         let {
           transitionDuration,
           transitionDelay
         } = window.getComputedStyle(element);
         const floatTransitionDuration = Number.parseFloat(transitionDuration);
         const floatTransitionDelay = Number.parseFloat(transitionDelay);
         if (!floatTransitionDuration && !floatTransitionDelay) {
           return 0;
         }
         transitionDuration = transitionDuration.split(",")[0];
         transitionDelay = transitionDelay.split(",")[0];
         return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
       };
       const triggerTransitionEnd = (element) => {
         element.dispatchEvent(new Event(TRANSITION_END));
       };
       const isElement2 = (object) => {
         if (!object || typeof object !== "object") {
           return false;
         }
         if (typeof object.jquery !== "undefined") {
           object = object[0];
         }
         return typeof object.nodeType !== "undefined";
       };
       const getElement = (object) => {
         if (isElement2(object)) {
           return object.jquery ? object[0] : object;
         }
         if (typeof object === "string" && object.length > 0) {
           return document.querySelector(parseSelector(object));
         }
         return null;
       };
       const isVisible = (element) => {
         if (!isElement2(element) || element.getClientRects().length === 0) {
           return false;
         }
         const elementIsVisible = getComputedStyle(element).getPropertyValue("visibility") === "visible";
         const closedDetails = element.closest("details:not([open])");
         if (!closedDetails) {
           return elementIsVisible;
         }
         if (closedDetails !== element) {
           const summary = element.closest("summary");
           if (summary && summary.parentNode !== closedDetails) {
             return false;
           }
           if (summary === null) {
             return false;
           }
         }
         return elementIsVisible;
       };
       const isDisabled = (element) => {
         if (!element || element.nodeType !== Node.ELEMENT_NODE) {
           return true;
         }
         if (element.classList.contains("disabled")) {
           return true;
         }
         if (typeof element.disabled !== "undefined") {
           return element.disabled;
         }
         return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
       };
       const findShadowRoot = (element) => {
         if (!document.documentElement.attachShadow) {
           return null;
         }
         if (typeof element.getRootNode === "function") {
           const root = element.getRootNode();
           return root instanceof ShadowRoot ? root : null;
         }
         if (element instanceof ShadowRoot) {
           return element;
         }
         if (!element.parentNode) {
           return null;
         }
         return findShadowRoot(element.parentNode);
       };
       const noop = () => {
       };
       const reflow = (element) => {
         element.offsetHeight;
       };
       const getjQuery = () => {
         if (window.jQuery && !document.body.hasAttribute("data-bs-no-jquery")) {
           return window.jQuery;
         }
         return null;
       };
       const DOMContentLoadedCallbacks = [];
       const onDOMContentLoaded = (callback) => {
         if (document.readyState === "loading") {
           if (!DOMContentLoadedCallbacks.length) {
             document.addEventListener("DOMContentLoaded", () => {
               for (const callback2 of DOMContentLoadedCallbacks) {
                 callback2();
               }
             });
           }
           DOMContentLoadedCallbacks.push(callback);
         } else {
           callback();
         }
       };
       const isRTL = () => document.documentElement.dir === "rtl";
       const defineJQueryPlugin = (plugin) => {
         onDOMContentLoaded(() => {
           const $ = getjQuery();
           if ($) {
             const name = plugin.NAME;
             const JQUERY_NO_CONFLICT = $.fn[name];
             $.fn[name] = plugin.jQueryInterface;
             $.fn[name].Constructor = plugin;
             $.fn[name].noConflict = () => {
               $.fn[name] = JQUERY_NO_CONFLICT;
               return plugin.jQueryInterface;
             };
           }
         });
       };
       const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
         return typeof possibleCallback === "function" ? possibleCallback(...args) : defaultValue;
       };
       const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
         if (!waitForTransition) {
           execute(callback);
           return;
         }
         const durationPadding = 5;
         const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
         let called = false;
         const handler = ({
           target
         }) => {
           if (target !== transitionElement) {
             return;
           }
           called = true;
           transitionElement.removeEventListener(TRANSITION_END, handler);
           execute(callback);
         };
         transitionElement.addEventListener(TRANSITION_END, handler);
         setTimeout(() => {
           if (!called) {
             triggerTransitionEnd(transitionElement);
           }
         }, emulatedDuration);
       };
       const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
         const listLength = list.length;
         let index = list.indexOf(activeElement);
         if (index === -1) {
           return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
         }
         index += shouldGetNext ? 1 : -1;
         if (isCycleAllowed) {
           index = (index + listLength) % listLength;
         }
         return list[Math.max(0, Math.min(index, listLength - 1))];
       };
       exports2.defineJQueryPlugin = defineJQueryPlugin;
       exports2.execute = execute;
       exports2.executeAfterTransition = executeAfterTransition;
       exports2.findShadowRoot = findShadowRoot;
       exports2.getElement = getElement;
       exports2.getNextActiveElement = getNextActiveElement;
       exports2.getTransitionDurationFromElement = getTransitionDurationFromElement;
       exports2.getUID = getUID;
       exports2.getjQuery = getjQuery;
       exports2.isDisabled = isDisabled;
       exports2.isElement = isElement2;
       exports2.isRTL = isRTL;
       exports2.isVisible = isVisible;
       exports2.noop = noop;
       exports2.onDOMContentLoaded = onDOMContentLoaded;
       exports2.parseSelector = parseSelector;
       exports2.reflow = reflow;
       exports2.toType = toType;
       exports2.triggerTransitionEnd = triggerTransitionEnd;
       Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
     });
   })(util, utilExports);
   return utilExports;
 }
 var eventHandlerExports = {};
 var eventHandler = {
   get exports() {
     return eventHandlerExports;
   },
   set exports(v) {
     eventHandlerExports = v;
   }
 };
 /*!
   * Bootstrap event-handler.js v5.3.0-alpha1 (https://getbootstrap.com/)
   * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   */
 var hasRequiredEventHandler;
 function requireEventHandler() {
   if (hasRequiredEventHandler)
     return eventHandlerExports;
   hasRequiredEventHandler = 1;
   (function(module, exports) {
     (function(global2, factory) {
       module.exports = factory(requireUtil());
     })(commonjsGlobal, function(index_js) {
       const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
       const stripNameRegex = /\..*/;
       const stripUidRegex = /::\d+$/;
       const eventRegistry = {};
       let uidEvent = 1;
       const customEvents = {
         mouseenter: "mouseover",
         mouseleave: "mouseout"
       };
       const nativeEvents = /* @__PURE__ */ new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
       function makeEventUid(element, uid) {
         return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
       }
       function getElementEvents(element) {
         const uid = makeEventUid(element);
         element.uidEvent = uid;
         eventRegistry[uid] = eventRegistry[uid] || {};
         return eventRegistry[uid];
       }
       function bootstrapHandler(element, fn2) {
         return function handler(event) {
           hydrateObj(event, {
             delegateTarget: element
           });
           if (handler.oneOff) {
             EventHandler.off(element, event.type, fn2);
           }
           return fn2.apply(element, [event]);
         };
       }
       function bootstrapDelegationHandler(element, selector, fn2) {
         return function handler(event) {
           const domElements = element.querySelectorAll(selector);
           for (let {
             target
           } = event; target && target !== this; target = target.parentNode) {
             for (const domElement of domElements) {
               if (domElement !== target) {
                 continue;
               }
               hydrateObj(event, {
                 delegateTarget: target
               });
               if (handler.oneOff) {
                 EventHandler.off(element, event.type, selector, fn2);
               }
               return fn2.apply(target, [event]);
             }
           }
         };
       }
       function findHandler(events, callable, delegationSelector = null) {
         return Object.values(events).find((event) => event.callable === callable && event.delegationSelector === delegationSelector);
       }
       function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
         const isDelegated = typeof handler === "string";
         const callable = isDelegated ? delegationFunction : handler || delegationFunction;
         let typeEvent = getTypeEvent(originalTypeEvent);
         if (!nativeEvents.has(typeEvent)) {
           typeEvent = originalTypeEvent;
         }
         return [isDelegated, callable, typeEvent];
       }
       function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
         if (typeof originalTypeEvent !== "string" || !element) {
           return;
         }
         let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
         if (originalTypeEvent in customEvents) {
           const wrapFunction = (fn3) => {
             return function(event) {
               if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
                 return fn3.call(this, event);
               }
             };
           };
           callable = wrapFunction(callable);
         }
         const events = getElementEvents(element);
         const handlers = events[typeEvent] || (events[typeEvent] = {});
         const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
         if (previousFunction) {
           previousFunction.oneOff = previousFunction.oneOff && oneOff;
           return;
         }
         const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
         const fn2 = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
         fn2.delegationSelector = isDelegated ? handler : null;
         fn2.callable = callable;
         fn2.oneOff = oneOff;
         fn2.uidEvent = uid;
         handlers[uid] = fn2;
         element.addEventListener(typeEvent, fn2, isDelegated);
       }
       function removeHandler(element, events, typeEvent, handler, delegationSelector) {
         const fn2 = findHandler(events[typeEvent], handler, delegationSelector);
         if (!fn2) {
           return;
         }
         element.removeEventListener(typeEvent, fn2, Boolean(delegationSelector));
         delete events[typeEvent][fn2.uidEvent];
       }
       function removeNamespacedHandlers(element, events, typeEvent, namespace) {
         const storeElementEvent = events[typeEvent] || {};
         for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
           if (handlerKey.includes(namespace)) {
             removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
           }
         }
       }
       function getTypeEvent(event) {
         event = event.replace(stripNameRegex, "");
         return customEvents[event] || event;
       }
       const EventHandler = {
         on(element, event, handler, delegationFunction) {
           addHandler(element, event, handler, delegationFunction, false);
         },
         one(element, event, handler, delegationFunction) {
           addHandler(element, event, handler, delegationFunction, true);
         },
         off(element, originalTypeEvent, handler, delegationFunction) {
           if (typeof originalTypeEvent !== "string" || !element) {
             return;
           }
           const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
           const inNamespace = typeEvent !== originalTypeEvent;
           const events = getElementEvents(element);
           const storeElementEvent = events[typeEvent] || {};
           const isNamespace = originalTypeEvent.startsWith(".");
           if (typeof callable !== "undefined") {
             if (!Object.keys(storeElementEvent).length) {
               return;
             }
             removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
             return;
           }
           if (isNamespace) {
             for (const elementEvent of Object.keys(events)) {
               removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
             }
           }
           for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
             const handlerKey = keyHandlers.replace(stripUidRegex, "");
             if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
               removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
             }
           }
         },
         trigger(element, event, args) {
           if (typeof event !== "string" || !element) {
             return null;
           }
           const $ = index_js.getjQuery();
           const typeEvent = getTypeEvent(event);
           const inNamespace = event !== typeEvent;
           let jQueryEvent = null;
           let bubbles = true;
           let nativeDispatch = true;
           let defaultPrevented = false;
           if (inNamespace && $) {
             jQueryEvent = $.Event(event, args);
             $(element).trigger(jQueryEvent);
             bubbles = !jQueryEvent.isPropagationStopped();
             nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
             defaultPrevented = jQueryEvent.isDefaultPrevented();
           }
           let evt = new Event(event, {
             bubbles,
             cancelable: true
           });
           evt = hydrateObj(evt, args);
           if (defaultPrevented) {
             evt.preventDefault();
           }
           if (nativeDispatch) {
             element.dispatchEvent(evt);
           }
           if (evt.defaultPrevented && jQueryEvent) {
             jQueryEvent.preventDefault();
           }
           return evt;
         }
       };
       function hydrateObj(obj, meta = {}) {
         for (const [key, value] of Object.entries(meta)) {
           try {
             obj[key] = value;
           } catch (_unused) {
             Object.defineProperty(obj, key, {
               configurable: true,
               get() {
                 return value;
               }
             });
           }
         }
         return obj;
       }
       return EventHandler;
     });
   })(eventHandler);
   return eventHandlerExports;
 }
 var manipulatorExports = {};
 var manipulator = {
   get exports() {
     return manipulatorExports;
   },
   set exports(v) {
     manipulatorExports = v;
   }
 };
 /*!
   * Bootstrap manipulator.js v5.3.0-alpha1 (https://getbootstrap.com/)
   * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   */
 var hasRequiredManipulator;
 function requireManipulator() {
   if (hasRequiredManipulator)
     return manipulatorExports;
   hasRequiredManipulator = 1;
   (function(module, exports) {
     (function(global2, factory) {
       module.exports = factory();
     })(commonjsGlobal, function() {
       function normalizeData(value) {
         if (value === "true") {
           return true;
         }
         if (value === "false") {
           return false;
         }
         if (value === Number(value).toString()) {
           return Number(value);
         }
         if (value === "" || value === "null") {
           return null;
         }
         if (typeof value !== "string") {
           return value;
         }
         try {
           return JSON.parse(decodeURIComponent(value));
         } catch (_unused) {
           return value;
         }
       }
       function normalizeDataKey(key) {
         return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
       }
       const Manipulator = {
         setDataAttribute(element, key, value) {
           element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
         },
         removeDataAttribute(element, key) {
           element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
         },
         getDataAttributes(element) {
           if (!element) {
             return {};
           }
           const attributes = {};
           const bsKeys = Object.keys(element.dataset).filter((key) => key.startsWith("bs") && !key.startsWith("bsConfig"));
           for (const key of bsKeys) {
             let pureKey = key.replace(/^bs/, "");
             pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
             attributes[pureKey] = normalizeData(element.dataset[key]);
           }
           return attributes;
         },
         getDataAttribute(element, key) {
           return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
         }
       };
       return Manipulator;
     });
   })(manipulator);
   return manipulatorExports;
 }
 var selectorEngineExports = {};
 var selectorEngine = {
   get exports() {
     return selectorEngineExports;
   },
   set exports(v) {
     selectorEngineExports = v;
   }
 };
 /*!
   * Bootstrap selector-engine.js v5.3.0-alpha1 (https://getbootstrap.com/)
   * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   */
 var hasRequiredSelectorEngine;
 function requireSelectorEngine() {
   if (hasRequiredSelectorEngine)
     return selectorEngineExports;
   hasRequiredSelectorEngine = 1;
   (function(module, exports) {
     (function(global2, factory) {
       module.exports = factory(requireUtil());
     })(commonjsGlobal, function(index_js) {
       const getSelector = (element) => {
         let selector = element.getAttribute("data-bs-target");
         if (!selector || selector === "#") {
           let hrefAttribute = element.getAttribute("href");
           if (!hrefAttribute || !hrefAttribute.includes("#") && !hrefAttribute.startsWith(".")) {
             return null;
           }
           if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) {
             hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
           }
           selector = hrefAttribute && hrefAttribute !== "#" ? hrefAttribute.trim() : null;
         }
         return index_js.parseSelector(selector);
       };
       const SelectorEngine = {
         find(selector, element = document.documentElement) {
           return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
         },
         findOne(selector, element = document.documentElement) {
           return Element.prototype.querySelector.call(element, selector);
         },
         children(element, selector) {
           return [].concat(...element.children).filter((child) => child.matches(selector));
         },
         parents(element, selector) {
           const parents = [];
           let ancestor = element.parentNode.closest(selector);
           while (ancestor) {
             parents.push(ancestor);
             ancestor = ancestor.parentNode.closest(selector);
           }
           return parents;
         },
         prev(element, selector) {
           let previous = element.previousElementSibling;
           while (previous) {
             if (previous.matches(selector)) {
               return [previous];
             }
             previous = previous.previousElementSibling;
           }
           return [];
         },
         // TODO: this is now unused; remove later along with prev()
         next(element, selector) {
           let next = element.nextElementSibling;
           while (next) {
             if (next.matches(selector)) {
               return [next];
             }
             next = next.nextElementSibling;
           }
           return [];
         },
         focusableChildren(element) {
           const focusables = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map((selector) => `${selector}:not([tabindex^="-"])`).join(",");
           return this.find(focusables, element).filter((el) => !index_js.isDisabled(el) && index_js.isVisible(el));
         },
         getSelectorFromElement(element) {
           const selector = getSelector(element);
           if (selector) {
             return SelectorEngine.findOne(selector) ? selector : null;
           }
           return null;
         },
         getElementFromSelector(element) {
           const selector = getSelector(element);
           return selector ? SelectorEngine.findOne(selector) : null;
         },
         getMultipleElementsFromSelector(element) {
           const selector = getSelector(element);
           return selector ? SelectorEngine.find(selector) : [];
         }
       };
       return SelectorEngine;
     });
   })(selectorEngine);
   return selectorEngineExports;
 }
 var swipeExports = {};
 var swipe = {
   get exports() {
     return swipeExports;
   },
   set exports(v) {
     swipeExports = v;
   }
 };
 var configExports = {};
 var config = {
   get exports() {
     return configExports;
   },
   set exports(v) {
     configExports = v;
   }
 };
 /*!
   * Bootstrap config.js v5.3.0-alpha1 (https://getbootstrap.com/)
   * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   */
 var hasRequiredConfig;
 function requireConfig() {
   if (hasRequiredConfig)
     return configExports;
   hasRequiredConfig = 1;
   (function(module, exports) {
     (function(global2, factory) {
       module.exports = factory(requireUtil(), requireManipulator());
     })(commonjsGlobal, function(index_js, Manipulator) {
       class Config {
         // Getters
         static get Default() {
           return {};
         }
         static get DefaultType() {
           return {};
         }
         static get NAME() {
           throw new Error('You have to implement the static method "NAME", for each component!');
         }
         _getConfig(config2) {
           config2 = this._mergeConfigObj(config2);
           config2 = this._configAfterMerge(config2);
           this._typeCheckConfig(config2);
           return config2;
         }
         _configAfterMerge(config2) {
           return config2;
         }
         _mergeConfigObj(config2, element) {
           const jsonConfig = index_js.isElement(element) ? Manipulator.getDataAttribute(element, "config") : {};
           return {
             ...this.constructor.Default,
             ...typeof jsonConfig === "object" ? jsonConfig : {},
             ...index_js.isElement(element) ? Manipulator.getDataAttributes(element) : {},
             ...typeof config2 === "object" ? config2 : {}
           };
         }
         _typeCheckConfig(config2, configTypes = this.constructor.DefaultType) {
           for (const [property, expectedTypes] of Object.entries(configTypes)) {
             const value = config2[property];
             const valueType = index_js.isElement(value) ? "element" : index_js.toType(value);
             if (!new RegExp(expectedTypes).test(valueType)) {
               throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
             }
           }
         }
       }
       return Config;
     });
   })(config);
   return configExports;
 }
 /*!
   * Bootstrap swipe.js v5.3.0-alpha1 (https://getbootstrap.com/)
   * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   */
 var hasRequiredSwipe;
 function requireSwipe() {
   if (hasRequiredSwipe)
     return swipeExports;
   hasRequiredSwipe = 1;
   (function(module, exports) {
     (function(global2, factory) {
       module.exports = factory(requireConfig(), requireEventHandler(), requireUtil());
     })(commonjsGlobal, function(Config, EventHandler, index_js) {
       const NAME = "swipe";
       const EVENT_KEY = ".bs.swipe";
       const EVENT_TOUCHSTART = `touchstart${EVENT_KEY}`;
       const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY}`;
       const EVENT_TOUCHEND = `touchend${EVENT_KEY}`;
       const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`;
       const EVENT_POINTERUP = `pointerup${EVENT_KEY}`;
       const POINTER_TYPE_TOUCH = "touch";
       const POINTER_TYPE_PEN = "pen";
       const CLASS_NAME_POINTER_EVENT = "pointer-event";
       const SWIPE_THRESHOLD = 40;
       const Default = {
         endCallback: null,
         leftCallback: null,
         rightCallback: null
       };
       const DefaultType = {
         endCallback: "(function|null)",
         leftCallback: "(function|null)",
         rightCallback: "(function|null)"
       };
       class Swipe extends Config {
         constructor(element, config2) {
           super();
           this._element = element;
           if (!element || !Swipe.isSupported()) {
             return;
           }
           this._config = this._getConfig(config2);
           this._deltaX = 0;
           this._supportPointerEvents = Boolean(window.PointerEvent);
           this._initEvents();
         }
         // Getters
         static get Default() {
           return Default;
         }
         static get DefaultType() {
           return DefaultType;
         }
         static get NAME() {
           return NAME;
         }
         // Public
         dispose() {
           EventHandler.off(this._element, EVENT_KEY);
         }
         // Private
         _start(event) {
           if (!this._supportPointerEvents) {
             this._deltaX = event.touches[0].clientX;
             return;
           }
           if (this._eventIsPointerPenTouch(event)) {
             this._deltaX = event.clientX;
           }
         }
         _end(event) {
           if (this._eventIsPointerPenTouch(event)) {
             this._deltaX = event.clientX - this._deltaX;
           }
           this._handleSwipe();
           index_js.execute(this._config.endCallback);
         }
         _move(event) {
           this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
         }
         _handleSwipe() {
           const absDeltaX = Math.abs(this._deltaX);
           if (absDeltaX <= SWIPE_THRESHOLD) {
             return;
           }
           const direction = absDeltaX / this._deltaX;
           this._deltaX = 0;
           if (!direction) {
             return;
           }
           index_js.execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
         }
         _initEvents() {
           if (this._supportPointerEvents) {
             EventHandler.on(this._element, EVENT_POINTERDOWN, (event) => this._start(event));
             EventHandler.on(this._element, EVENT_POINTERUP, (event) => this._end(event));
             this._element.classList.add(CLASS_NAME_POINTER_EVENT);
           } else {
             EventHandler.on(this._element, EVENT_TOUCHSTART, (event) => this._start(event));
             EventHandler.on(this._element, EVENT_TOUCHMOVE, (event) => this._move(event));
             EventHandler.on(this._element, EVENT_TOUCHEND, (event) => this._end(event));
           }
         }
         _eventIsPointerPenTouch(event) {
           return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
         }
         // Static
         static isSupported() {
           return "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0;
         }
       }
       return Swipe;
     });
   })(swipe);
   return swipeExports;
 }
 var baseComponentExports = {};
 var baseComponent = {
   get exports() {
     return baseComponentExports;
   },
   set exports(v) {
     baseComponentExports = v;
   }
 };
 var dataExports = {};
 var data = {
   get exports() {
     return dataExports;
   },
   set exports(v) {
     dataExports = v;
   }
 };
 /*!
   * Bootstrap data.js v5.3.0-alpha1 (https://getbootstrap.com/)
   * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   */
 var hasRequiredData;
 function requireData() {
   if (hasRequiredData)
     return dataExports;
   hasRequiredData = 1;
   (function(module, exports) {
     (function(global2, factory) {
       module.exports = factory();
     })(commonjsGlobal, function() {
       const elementMap = /* @__PURE__ */ new Map();
       const data2 = {
         set(element, key, instance) {
           if (!elementMap.has(element)) {
             elementMap.set(element, /* @__PURE__ */ new Map());
           }
           const instanceMap = elementMap.get(element);
           if (!instanceMap.has(key) && instanceMap.size !== 0) {
             console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
             return;
           }
           instanceMap.set(key, instance);
         },
         get(element, key) {
           if (elementMap.has(element)) {
             return elementMap.get(element).get(key) || null;
           }
           return null;
         },
         remove(element, key) {
           if (!elementMap.has(element)) {
             return;
           }
           const instanceMap = elementMap.get(element);
           instanceMap.delete(key);
           if (instanceMap.size === 0) {
             elementMap.delete(element);
           }
         }
       };
       return data2;
     });
   })(data);
   return dataExports;
 }
 /*!
   * Bootstrap base-component.js v5.3.0-alpha1 (https://getbootstrap.com/)
   * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   */
 var hasRequiredBaseComponent;
 function requireBaseComponent() {
   if (hasRequiredBaseComponent)
     return baseComponentExports;
   hasRequiredBaseComponent = 1;
   (function(module, exports) {
     (function(global2, factory) {
       module.exports = factory(requireData(), requireUtil(), requireEventHandler(), requireConfig());
     })(commonjsGlobal, function(Data, index_js, EventHandler, Config) {
       const VERSION = "5.3.0-alpha1";
       class BaseComponent extends Config {
         constructor(element, config2) {
           super();
           element = index_js.getElement(element);
           if (!element) {
             return;
           }
           this._element = element;
           this._config = this._getConfig(config2);
           Data.set(this._element, this.constructor.DATA_KEY, this);
         }
         // Public
         dispose() {
           Data.remove(this._element, this.constructor.DATA_KEY);
           EventHandler.off(this._element, this.constructor.EVENT_KEY);
           for (const propertyName of Object.getOwnPropertyNames(this)) {
             this[propertyName] = null;
           }
         }
         _queueCallback(callback, element, isAnimated = true) {
           index_js.executeAfterTransition(callback, element, isAnimated);
         }
         _getConfig(config2) {
           config2 = this._mergeConfigObj(config2, this._element);
           config2 = this._configAfterMerge(config2);
           this._typeCheckConfig(config2);
           return config2;
         }
         // Static
         static getInstance(element) {
           return Data.get(index_js.getElement(element), this.DATA_KEY);
         }
         static getOrCreateInstance(element, config2 = {}) {
           return this.getInstance(element) || new this(element, typeof config2 === "object" ? config2 : null);
         }
         static get VERSION() {
           return VERSION;
         }
         static get DATA_KEY() {
           return `bs.${this.NAME}`;
         }
         static get EVENT_KEY() {
           return `.${this.DATA_KEY}`;
         }
         static eventName(name) {
           return `${name}${this.EVENT_KEY}`;
         }
       }
       return BaseComponent;
     });
   })(baseComponent);
   return baseComponentExports;
 }
 /*!
   * Bootstrap carousel.js v5.3.0-alpha1 (https://getbootstrap.com/)
   * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   */
 (function(module, exports) {
   (function(global2, factory) {
     module.exports = factory(requireUtil(), requireEventHandler(), requireManipulator(), requireSelectorEngine(), requireSwipe(), requireBaseComponent());
   })(commonjsGlobal, function(index_js, EventHandler, Manipulator, SelectorEngine, Swipe, BaseComponent) {
     const NAME = "carousel";
     const DATA_KEY = "bs.carousel";
     const EVENT_KEY = `.${DATA_KEY}`;
     const DATA_API_KEY = ".data-api";
     const ARROW_LEFT_KEY = "ArrowLeft";
     const ARROW_RIGHT_KEY = "ArrowRight";
     const TOUCHEVENT_COMPAT_WAIT = 500;
     const ORDER_NEXT = "next";
     const ORDER_PREV = "prev";
     const DIRECTION_LEFT = "left";
     const DIRECTION_RIGHT = "right";
     const EVENT_SLIDE = `slide${EVENT_KEY}`;
     const EVENT_SLID = `slid${EVENT_KEY}`;
     const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
     const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`;
     const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`;
     const EVENT_DRAG_START = `dragstart${EVENT_KEY}`;
     const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
     const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
     const CLASS_NAME_CAROUSEL = "carousel";
     const CLASS_NAME_ACTIVE = "active";
     const CLASS_NAME_SLIDE = "slide";
     const CLASS_NAME_END = "carousel-item-end";
     const CLASS_NAME_START = "carousel-item-start";
     const CLASS_NAME_NEXT = "carousel-item-next";
     const CLASS_NAME_PREV = "carousel-item-prev";
     const SELECTOR_ACTIVE = ".active";
     const SELECTOR_ITEM = ".carousel-item";
     const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
     const SELECTOR_ITEM_IMG = ".carousel-item img";
     const SELECTOR_INDICATORS = ".carousel-indicators";
     const SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]";
     const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
     const KEY_TO_DIRECTION = {
       [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
       [ARROW_RIGHT_KEY]: DIRECTION_LEFT
     };
     const Default = {
       interval: 5e3,
       keyboard: true,
       pause: "hover",
       ride: false,
       touch: true,
       wrap: true
     };
     const DefaultType = {
       interval: "(number|boolean)",
       // TODO:v6 remove boolean support
       keyboard: "boolean",
       pause: "(string|boolean)",
       ride: "(boolean|string)",
       touch: "boolean",
       wrap: "boolean"
     };
     class Carousel extends BaseComponent {
       constructor(element, config2) {
         super(element, config2);
         this._interval = null;
         this._activeElement = null;
         this._isSliding = false;
         this.touchTimeout = null;
         this._swipeHelper = null;
         this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
         this._addEventListeners();
         if (this._config.ride === CLASS_NAME_CAROUSEL) {
           this.cycle();
         }
       }
       // Getters
       static get Default() {
         return Default;
       }
       static get DefaultType() {
         return DefaultType;
       }
       static get NAME() {
         return NAME;
       }
       // Public
       next() {
         this._slide(ORDER_NEXT);
       }
       nextWhenVisible() {
         if (!document.hidden && index_js.isVisible(this._element)) {
           this.next();
         }
       }
       prev() {
         this._slide(ORDER_PREV);
       }
       pause() {
         if (this._isSliding) {
           index_js.triggerTransitionEnd(this._element);
         }
         this._clearInterval();
       }
       cycle() {
         this._clearInterval();
         this._updateInterval();
         this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
       }
       _maybeEnableCycle() {
         if (!this._config.ride) {
           return;
         }
         if (this._isSliding) {
           EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
           return;
         }
         this.cycle();
       }
       to(index) {
         const items = this._getItems();
         if (index > items.length - 1 || index < 0) {
           return;
         }
         if (this._isSliding) {
           EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
           return;
         }
         const activeIndex = this._getItemIndex(this._getActive());
         if (activeIndex === index) {
           return;
         }
         const order2 = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
         this._slide(order2, items[index]);
       }
       dispose() {
         if (this._swipeHelper) {
           this._swipeHelper.dispose();
         }
         super.dispose();
       }
       // Private
       _configAfterMerge(config2) {
         config2.defaultInterval = config2.interval;
         return config2;
       }
       _addEventListeners() {
         if (this._config.keyboard) {
           EventHandler.on(this._element, EVENT_KEYDOWN, (event) => this._keydown(event));
         }
         if (this._config.pause === "hover") {
           EventHandler.on(this._element, EVENT_MOUSEENTER, () => this.pause());
           EventHandler.on(this._element, EVENT_MOUSELEAVE, () => this._maybeEnableCycle());
         }
         if (this._config.touch && Swipe.isSupported()) {
           this._addTouchEventListeners();
         }
       }
       _addTouchEventListeners() {
         for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
           EventHandler.on(img, EVENT_DRAG_START, (event) => event.preventDefault());
         }
         const endCallBack = () => {
           if (this._config.pause !== "hover") {
             return;
           }
           this.pause();
           if (this.touchTimeout) {
             clearTimeout(this.touchTimeout);
           }
           this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
         };
         const swipeConfig = {
           leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
           rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
           endCallback: endCallBack
         };
         this._swipeHelper = new Swipe(this._element, swipeConfig);
       }
       _keydown(event) {
         if (/input|textarea/i.test(event.target.tagName)) {
           return;
         }
         const direction = KEY_TO_DIRECTION[event.key];
         if (direction) {
           event.preventDefault();
           this._slide(this._directionToOrder(direction));
         }
       }
       _getItemIndex(element) {
         return this._getItems().indexOf(element);
       }
       _setActiveIndicatorElement(index) {
         if (!this._indicatorsElement) {
           return;
         }
         const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
         activeIndicator.classList.remove(CLASS_NAME_ACTIVE);
         activeIndicator.removeAttribute("aria-current");
         const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
         if (newActiveIndicator) {
           newActiveIndicator.classList.add(CLASS_NAME_ACTIVE);
           newActiveIndicator.setAttribute("aria-current", "true");
         }
       }
       _updateInterval() {
         const element = this._activeElement || this._getActive();
         if (!element) {
           return;
         }
         const elementInterval = Number.parseInt(element.getAttribute("data-bs-interval"), 10);
         this._config.interval = elementInterval || this._config.defaultInterval;
       }
       _slide(order2, element = null) {
         if (this._isSliding) {
           return;
         }
         const activeElement = this._getActive();
         const isNext = order2 === ORDER_NEXT;
         const nextElement = element || index_js.getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
         if (nextElement === activeElement) {
           return;
         }
         const nextElementIndex = this._getItemIndex(nextElement);
         const triggerEvent = (eventName) => {
           return EventHandler.trigger(this._element, eventName, {
             relatedTarget: nextElement,
             direction: this._orderToDirection(order2),
             from: this._getItemIndex(activeElement),
             to: nextElementIndex
           });
         };
         const slideEvent = triggerEvent(EVENT_SLIDE);
         if (slideEvent.defaultPrevented) {
           return;
         }
         if (!activeElement || !nextElement) {
           return;
         }
         const isCycling = Boolean(this._interval);
         this.pause();
         this._isSliding = true;
         this._setActiveIndicatorElement(nextElementIndex);
         this._activeElement = nextElement;
         const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
         const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
         nextElement.classList.add(orderClassName);
         index_js.reflow(nextElement);
         activeElement.classList.add(directionalClassName);
         nextElement.classList.add(directionalClassName);
         const completeCallBack = () => {
           nextElement.classList.remove(directionalClassName, orderClassName);
           nextElement.classList.add(CLASS_NAME_ACTIVE);
           activeElement.classList.remove(CLASS_NAME_ACTIVE, orderClassName, directionalClassName);
           this._isSliding = false;
           triggerEvent(EVENT_SLID);
         };
         this._queueCallback(completeCallBack, activeElement, this._isAnimated());
         if (isCycling) {
           this.cycle();
         }
       }
       _isAnimated() {
         return this._element.classList.contains(CLASS_NAME_SLIDE);
       }
       _getActive() {
         return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
       }
       _getItems() {
         return SelectorEngine.find(SELECTOR_ITEM, this._element);
       }
       _clearInterval() {
         if (this._interval) {
           clearInterval(this._interval);
           this._interval = null;
         }
       }
       _directionToOrder(direction) {
         if (index_js.isRTL()) {
           return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
         }
         return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
       }
       _orderToDirection(order2) {
         if (index_js.isRTL()) {
           return order2 === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
         }
         return order2 === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
       }
       // Static
       static jQueryInterface(config2) {
         return this.each(function() {
           const data2 = Carousel.getOrCreateInstance(this, config2);
           if (typeof config2 === "number") {
             data2.to(config2);
             return;
           }
           if (typeof config2 === "string") {
             if (data2[config2] === void 0 || config2.startsWith("_") || config2 === "constructor") {
               throw new TypeError(`No method named "${config2}"`);
             }
             data2[config2]();
           }
         });
       }
     }
     EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_SLIDE, function(event) {
       const target = SelectorEngine.getElementFromSelector(this);
       if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
         return;
       }
       event.preventDefault();
       const carousel2 = Carousel.getOrCreateInstance(target);
       const slideIndex = this.getAttribute("data-bs-slide-to");
       if (slideIndex) {
         carousel2.to(slideIndex);
         carousel2._maybeEnableCycle();
         return;
       }
       if (Manipulator.getDataAttribute(this, "slide") === "next") {
         carousel2.next();
         carousel2._maybeEnableCycle();
         return;
       }
       carousel2.prev();
       carousel2._maybeEnableCycle();
     });
     EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
       const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
       for (const carousel2 of carousels) {
         Carousel.getOrCreateInstance(carousel2);
       }
     });
     index_js.defineJQueryPlugin(Carousel);
     return Carousel;
   });
 })(carousel);

const carouselSection = document.querySelector('.carousel-section');
const carouselContent = document.querySelector('.carousel-cover__content--bottom');
(function adjustHeight () {
   if(!carouselContent) return;
   let heigthContent = carouselContent.getBoundingClientRect().height;
   let carouselHeigth = carouselSection.getBoundingClientRect().height;
   console.log(`${ carouselHeigth - (heigthContent * 0.4)}px`)
   carouselSection.style.height = `${ carouselHeigth - (heigthContent * 0.4)}px`
})();
 