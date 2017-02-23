// ------ Tessarray ------
// Copyright 2016 Dixon and Moe
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

// ------ Flickr Justified Layout ------
// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.
require=function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '" +o+ "'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){"use strict";var merge=require("merge");var Row=module.exports=function(params){this.top=params.top;this.left=params.left;this.width=params.width;this.spacing=params.spacing;this.targetRowHeight=params.targetRowHeight;this.targetRowHeightTolerance=params.targetRowHeightTolerance;this.minAspectRatio=this.width/params.targetRowHeight*(1-params.targetRowHeightTolerance);this.maxAspectRatio=this.width/params.targetRowHeight*(1+params.targetRowHeightTolerance);this.edgeCaseMinRowHeight=params.edgeCaseMinRowHeight||Number.NEGATIVE_INFINITY;this.edgeCaseMaxRowHeight=params.edgeCaseMaxRowHeight||Number.POSITIVE_INFINITY;this.rightToLeft=params.rightToLeft;this.isBreakoutRow=params.isBreakoutRow;this.items=[];this.height=0};Row.prototype={addItem:function addItem(itemData){var newItems=this.items.concat(itemData),rowWidthWithoutSpacing=this.width-(newItems.length-1)*this.spacing,newAspectRatio=newItems.reduce(function(sum,item){return sum+item.aspectRatio},0),targetAspectRatio=rowWidthWithoutSpacing/this.targetRowHeight,previousRowWidthWithoutSpacing,previousAspectRatio,previousTargetAspectRatio;if(this.isBreakoutRow){if(this.items.length===0){if(itemData.aspectRatio>=1){this.items.push(itemData);this.completeLayout(rowWidthWithoutSpacing/itemData.aspectRatio);return true}}}if(newAspectRatio===0){return false}if(newAspectRatio<this.minAspectRatio){this.items.push(merge(itemData));return true}else if(newAspectRatio>this.maxAspectRatio){if(this.items.length===0){this.items.push(merge(itemData));this.completeLayout(rowWidthWithoutSpacing/newAspectRatio);return true}previousRowWidthWithoutSpacing=this.width-(this.items.length-1)*this.spacing;previousAspectRatio=this.items.reduce(function(sum,item){return sum+item.aspectRatio},0);previousTargetAspectRatio=previousRowWidthWithoutSpacing/this.targetRowHeight;if(Math.abs(newAspectRatio-targetAspectRatio)>Math.abs(previousAspectRatio-previousTargetAspectRatio)){this.completeLayout(previousRowWidthWithoutSpacing/previousAspectRatio);return false}else{this.items.push(merge(itemData));this.completeLayout(rowWidthWithoutSpacing/newAspectRatio);return true}}else{this.items.push(merge(itemData));this.completeLayout(rowWidthWithoutSpacing/newAspectRatio);return true}},isLayoutComplete:function isLayoutComplete(){return this.height>0},completeLayout:function completeLayout(newHeight,justify){var itemWidthSum=this.rightToLeft?-this.left:this.left,rowWidthWithoutSpacing=this.width-(this.items.length-1)*this.spacing,clampedToNativeRatio,roundedHeight,clampedHeight,errorWidthPerItem,roundedCumulativeErrors,singleItemGeometry,self=this;if(typeof justify==="undefined"){justify=true}roundedHeight=Math.round(newHeight);clampedHeight=Math.max(this.edgeCaseMinRowHeight,Math.min(roundedHeight,this.edgeCaseMaxRowHeight));if(roundedHeight!==clampedHeight){this.height=clampedHeight;clampedToNativeRatio=rowWidthWithoutSpacing/clampedHeight/(rowWidthWithoutSpacing/roundedHeight)}else{this.height=roundedHeight;clampedToNativeRatio=1}this.items.forEach(function(item,i){item.top=self.top;item.width=Math.round(item.aspectRatio*self.height*clampedToNativeRatio);item.height=self.height;if(self.rightToLeft){item.left=self.width-itemWidthSum-item.width}else{item.left=itemWidthSum}itemWidthSum+=item.width+self.spacing});if(justify){if(!this.rightToLeft){itemWidthSum-=this.spacing+this.left}errorWidthPerItem=(itemWidthSum-this.width)/this.items.length;roundedCumulativeErrors=this.items.map(function(item,i){return Math.round((i+1)*errorWidthPerItem)});if(this.items.length===1){singleItemGeometry=this.items[0];singleItemGeometry.width-=Math.round(errorWidthPerItem);if(this.rightToLeft){singleItemGeometry.left+=Math.round(errorWidthPerItem)}}else{this.items.forEach(function(item,i){if(i>0){item.left-=roundedCumulativeErrors[i-1];item.width-=roundedCumulativeErrors[i]-roundedCumulativeErrors[i-1]}else{item.width-=roundedCumulativeErrors[i]}})}}},forceComplete:function forceComplete(fitToWidth,rowHeight){var rowWidthWithoutSpacing=this.width-(this.items.length-1)*this.spacing,currentAspectRatio=this.items.reduce(function(sum,item){return sum+item.aspectRatio},0);if(typeof rowHeight==="number"){this.completeLayout(rowHeight,false)}else if(fitToWidth){this.completeLayout(rowWidthWithoutSpacing/currentAspectRatio)}else{this.completeLayout(this.targetRowHeight,false)}},getItems:function getItems(){return this.items}}},{merge:2}],2:[function(require,module,exports){(function(isNode){var Public=function(clone){return merge(clone===true,false,arguments)},publicName="merge";Public.recursive=function(clone){return merge(clone===true,true,arguments)};Public.clone=function(input){var output=input,type=typeOf(input),index,size;if(type==="array"){output=[];size=input.length;for(index=0;index<size;++index)output[index]=Public.clone(input[index])}else if(type==="object"){output={};for(index in input)output[index]=Public.clone(input[index])}return output};function merge_recursive(base,extend){if(typeOf(base)!=="object")return extend;for(var key in extend){if(typeOf(base[key])==="object"&&typeOf(extend[key])==="object"){base[key]=merge_recursive(base[key],extend[key])}else{base[key]=extend[key]}}return base}function merge(clone,recursive,argv){var result=argv[0],size=argv.length;if(clone||typeOf(result)!=="object")result={};for(var index=0;index<size;++index){var item=argv[index],type=typeOf(item);if(type!=="object")continue;for(var key in item){var sitem=clone?Public.clone(item[key]):item[key];if(recursive){result[key]=merge_recursive(result[key],sitem)}else{result[key]=sitem}}}return result}function typeOf(input){return{}.toString.call(input).slice(8,-1).toLowerCase()}if(isNode){module.exports=Public}else{window[publicName]=Public}})(typeof module==="object"&&module&&typeof module.exports==="object"&&module.exports)},{}],"justified-layout":[function(require,module,exports){"use strict";var merge=require("merge"),Row=require("./row"),layoutConfig={},layoutData={},currentRow=false;module.exports=function(input){var config=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];var defaults={containerWidth:1060,containerPadding:10,boxSpacing:10,targetRowHeight:320,targetRowHeightTolerance:.25,maxNumRows:Number.POSITIVE_INFINITY,forceAspectRatio:false,showWidows:true,fullWidthBreakoutRowCadence:false};layoutConfig=merge(defaults,config);var containerPadding={};var boxSpacing={};containerPadding.top=!isNaN(parseFloat(layoutConfig.containerPadding.top))?layoutConfig.containerPadding.top:layoutConfig.containerPadding;containerPadding.right=!isNaN(parseFloat(layoutConfig.containerPadding.right))?layoutConfig.containerPadding.right:layoutConfig.containerPadding;containerPadding.bottom=!isNaN(parseFloat(layoutConfig.containerPadding.bottom))?layoutConfig.containerPadding.bottom:layoutConfig.containerPadding;containerPadding.left=!isNaN(parseFloat(layoutConfig.containerPadding.left))?layoutConfig.containerPadding.left:layoutConfig.containerPadding;boxSpacing.horizontal=!isNaN(parseFloat(layoutConfig.boxSpacing.horizontal))?layoutConfig.boxSpacing.horizontal:layoutConfig.boxSpacing;boxSpacing.vertical=!isNaN(parseFloat(layoutConfig.boxSpacing.vertical))?layoutConfig.boxSpacing.vertical:layoutConfig.boxSpacing;layoutConfig.containerPadding=containerPadding;layoutConfig.boxSpacing=boxSpacing;layoutData._layoutItems=[];layoutData._awakeItems=[];layoutData._inViewportItems=[];layoutData._leadingOrphans=[];layoutData._trailingOrphans=[];layoutData._containerHeight=layoutConfig.containerPadding.top;layoutData._rows=[];layoutData._orphans=[];return computeLayout(input.map(function(item){if(item.width&&item.width){return{aspectRatio:item.width/item.height}}else{return{aspectRatio:item}}}))};function computeLayout(itemLayoutData){var notAddedNotComplete,laidOutItems=[],itemAdded,currentRow,nextToLastRowHeight;if(layoutConfig.forceAspectRatio){itemLayoutData.forEach(function(itemData){itemData.forcedAspectRatio=true;itemData.aspectRatio=layoutConfig.forceAspectRatio})}itemLayoutData.some(function(itemData,i){notAddedNotComplete=false;if(!currentRow){currentRow=createNewRow()}itemAdded=currentRow.addItem(itemData);if(currentRow.isLayoutComplete()){laidOutItems=laidOutItems.concat(addRow(currentRow));if(layoutData._rows.length>=layoutConfig.maxNumRows){currentRow=null;return true}currentRow=createNewRow();if(!itemAdded){itemAdded=currentRow.addItem(itemData);if(currentRow.isLayoutComplete()){laidOutItems=laidOutItems.concat(addRow(currentRow));if(layoutData._rows.length>=layoutConfig.maxNumRows){currentRow=null;return true}currentRow=createNewRow()}else if(!itemAdded){notAddedNotComplete=true}}}else{if(!itemAdded){notAddedNotComplete=true}}});if(currentRow&&currentRow.getItems().length&&layoutConfig.showWidows){if(layoutData._rows.length){if(layoutData._rows[layoutData._rows.length-1].isBreakoutRow){nextToLastRowHeight=layoutData._rows[layoutData._rows.length-1].targetRowHeight}else{nextToLastRowHeight=layoutData._rows[layoutData._rows.length-1].height}currentRow.forceComplete(false,nextToLastRowHeight||layoutConfig.targetRowHeight)}else{currentRow.forceComplete(false)}laidOutItems=laidOutItems.concat(addRow(currentRow))}layoutData._containerHeight=layoutData._containerHeight-layoutConfig.boxSpacing.vertical;layoutData._containerHeight=layoutData._containerHeight+layoutConfig.containerPadding.bottom;return{containerHeight:layoutData._containerHeight,boxes:layoutData._layoutItems}}function createNewRow(){if(layoutConfig.fullWidthBreakoutRowCadence!==false){if((layoutData._rows.length+1)%layoutConfig.fullWidthBreakoutRowCadence===0){var isBreakoutRow=true}}return new Row({top:layoutData._containerHeight,left:layoutConfig.containerPadding.left,width:layoutConfig.containerWidth-layoutConfig.containerPadding.left-layoutConfig.containerPadding.right,spacing:layoutConfig.boxSpacing.horizontal,targetRowHeight:layoutConfig.targetRowHeight,targetRowHeightTolerance:layoutConfig.targetRowHeightTolerance,edgeCaseMinRowHeight:.5*layoutConfig.targetRowHeight,edgeCaseMaxRowHeight:2*layoutConfig.targetRowHeight,rightToLeft:false,isBreakoutRow:isBreakoutRow})}function addRow(row){layoutData._rows.push(row);layoutData._layoutItems=layoutData._layoutItems.concat(row.getItems());layoutData._containerHeight+=row.height+layoutConfig.boxSpacing.vertical;return row.items}},{"./row":1,merge:2}]},{},[]);

// ------ Tessaray Initialization ------
var Tessarray = function(containerSelector, boxSelector, options) {
  this.container = document.querySelector(containerSelector);
  this.eventListeners = {};
  // Is this what I should name these?
  this.allFilters = [];
  this.allSorts = {};

  this._setOptions();

  this._styleContainer();

  this._defineTransitions();

  // Should this go in set Transitions
  if (this.options.containerTransition) {
    this.container.style.transition = this.containerTransition;
  }

  this._setContainerPadding();

  this._setEventListeners();

  this._bindAndPrepareFilteringAndSorting();

  // Create boxNodes and boxObjects for Tessarray instance
  this._createBoxes(boxSelector);

  // Set values to numbers if possible
  this._changeSortValuesToNumbersIfPossible();

  // Confirm that this.container has the correct data and is ready to render
  this._setContainerState();
};

Tessarray.prototype._setOptions = function() {
  this.options = options || {};
  
  // Set default values for options
  this._setOptionValue("selectorClass", false);
  this._setOptionValue("defaultFilter", false);
  this._setOptionValue("defaultSort", false);
  this._setOptionValue("resize", true);
  this._setOptionValue("containerTransition", {
    duration: 300,
    timingFunction: "ease-in",
    delay: 0
  });
  this._setOptionValue("boxTransition", {
    duration: 500,
    timingFunction: "ease-in",
    delay: 0
  });
  this._setOptionValue("boxTransformOutTransition", {
    duration: 250,
    timingFunction: "ease-in",
    delay: 0
  });
  this._setOptionValue("containerLoadedClass", 'container-is-loaded');
  this._setOptionValue("boxLoadedClass", 'is-loaded');
  this._setOptionValue("onContainerLoad", false);
  this._setOptionValue("onBoxLoad", false);
  this._setOptionValue("onRender", false);
  this._setOptionValue("flickr", {});
};

Tessarray.prototype._setOptionValue = function(key, defaultValue) {
  if (this.options[key] === undefined) {
    this.options[key] = defaultValue;
  }
};

Tessarray.prototype._styleContainer = function() {
  this.container.style.position = "relative";

  // This will be changed to 1 once the first layout geometry is loaded
  this.container.style.opacity = "0"; 
  
  // This is needed to reflow before adding transition
  this.container.offsetTop;

  // Determine if user specifies containerWidth using flickr in initialization
  this.specifiedContainerWidth = !!this.options.flickr.containerWidth;

  // Set width that is passed to the Justified Layout to be the current width of the container
  this._setContainerWidth();
};

Tessarray.prototype._setContainerWidth = function() {
  if (!this.specifiedContainerWidth) {
    this.options.flickr.containerWidth = this.container.clientWidth;
  }
};

Tessarray.prototype._defineTransitions = function() {
  // containerTransition controls the container's transition from 0 opacity to 1 once the container is loaded.
  if (typeof this.options.containerTransition === "object") {
    this.containerTransition = "opacity " + this.options.containerTransition.duration + "ms " + this.options.containerTransition.timingFunction + " " + this.options.containerTransition.delay + "ms";
  } else if (typeof this.options.containerTransition === "string") {
    this.containerTransition = this.options.containerTransition;
  } else {
    this.containerTransition = false;
  }

  // boxTransition controls the movement of boxes, the resizing of boxes, and the scaling of boxes from 0 to 1.
  if (typeof this.options.boxTransition === "object") {
    this.boxTransition = "transform " + this.options.boxTransition.duration + "ms " + this.options.boxTransition.timingFunction + " " + this.options.boxTransition.delay + "ms, height " + this.options.boxTransition.duration + "ms " + this.options.boxTransition.timingFunction + " " + this.options.boxTransition.delay + "ms, width " + this.options.boxTransition.duration + "ms " + this.options.boxTransition.timingFunction + " " + this.options.boxTransition.delay + "ms";
  } else if (typeof this.options.boxTransition === "string") {
    this.boxTransition = this.options.boxTransition;
  } else {
    this.boxTransition = false;
  }

  // boxTransformOutTransition controls the scaling of boxes from 1 to 0. 
  if (typeof this.options.boxTransformOutTransition === "object") {
    this.boxTransformOutTransition = "transform " + this.options.boxTransformOutTransition.duration + "ms " + this.options.boxTransformOutTransition.timingFunction + " " + this.options.boxTransformOutTransition.delay + "ms";
  } else if (typeof this.options.boxTransformOutTransition === "string") {
    this.boxTransformOutTransition = this.options.boxTransformOutTransition;
  } else {
    this.boxTransformOutTransition = false;
  }
}

Tessarray.prototype._setContainerPadding = function() {
  // If user specified containerPadding, use it to calculate height
  if (this.options.flickr.containerPadding) {

    // If user passed a number, use the number
    if (typeof this.options.flickr.containerPadding === "number") {
      this.containerPaddingBottom = this.options.flickr.containerPadding;

    // Else if user passed an object and bottom is truthy, use that value
    } else if (this.options.flickr.containerPadding.bottom) {
      this.containerPaddingBottom = this.options.flickr.containerPadding.bottom;

    // If user passed an object and bottom is not truthy, use 0
    // This prevents breaking if user does not put bottom in the object
    } else {
      this.containerPaddingBottom = 0;
    }

  // Else use the Flickr default containerPaddingBottom for height calculation
  } else {
    this.containerPaddingBottom = 10;
  }
}

Tessarray.prototype._setEventListeners = function() {

  // The eventListeners object is used to store functions have been added to which
  // elements so they can be removed in the destroy method.
  this.eventListeners.container = function(event) {
    if (event.target === this.container) {
      this._addTransitionToAllBoxNodes();
      this.container.removeEventListener('transitionend', this.eventListeners.container); 
    }
  }.bind(this);

  // If transition is set and its duration is greater than 0
  if ((this.options.containerTransition !== false) && (typeof this.options.containerTransition !== "object" || this.options.containerTransition.duration !== 0)) {
    try {
      this.container.addEventListener('transitionend', this.eventListeners.container);
    } catch (e) {
      console.error('Cannot find container with selectorString "' + containerSelector + '"');
    }
  }

  // If this.options.resize, resize the container upon window size change if 
  // container size is modified
  if (this.options.resize) {
    this.eventListeners.window = this.renderOnResize.bind(this);
    window.addEventListener("resize", this.eventListeners.window);
  }
}

Tessarray.prototype._bindAndPrepareFilteringAndSorting = function() {
  if (this.options.selectorClass) {
    this.selectors = document.getElementsByClassName(this.options.selectorClass);
    this.selectors.forEach(function(selector) {
      var filterString = selector.getAttribute("data-filter");
      var sortString = selector.getAttribute("data-sort");

      this._setAndBindSelectorEventListeners(filterString, sortString);

      this._addFilterToCollection(filterString);
      this._addSortToCollection(sortString);
    });
  }
}

Tessarray.prototype._setAndBindSelectorEventListeners = function(filterString, sortString) {
  // Add event listeners for filtering and sorting if filterString and sortString exist
  if ((filterString !== null) && (sortString !== null)) {
    this.eventListeners[j] = this.filterAndSort.bind(this, filterString, sortString);
  } else if (filterString !== null) {
    this.eventListeners[j] = this.filter.bind(this, filterString);
  } else if (sortString !== null) {
    this.eventListeners[j] = this.sort.bind(this, sortString);
  }

  // If there was a valid filterString or valid sortString, bind eventListeners[j] to click
  if (this.eventListeners[j]) {
    this.selectors[j].addEventListener("click", this.eventListeners[j]);
  }
}

Tessarray.prototype._addFilterToCollection = function(filterString) {
  if (filterString) {
    this.allFilters.push(filterString);
  }
}

Tessarray.prototype._addSortToCollection = function(sortString) {
  if (sortString) {
    this.allSorts[sortString] = true;
  }
}

Tessarray.prototype._changeSortValuesToNumbersIfPossible = function() {
  if (this.options.selectorClass) {
    for (var sortKey in this.allSorts) {
      if (this.allSorts[sortKey]) {
        this._changeSortValuesToNumbers(sortKey);
      }
    }
  }
}

Tessarray.prototype._changeSortValuesToNumbers = function(sortKey) {
  if (sortKey !== "") {
    this.boxObjects.forEach(function(boxObject) {
      if (boxObject.sortData[sortKey] !== false) {
        boxObject.sortData[sortKey] = +boxObject.sortData[sortKey].replace(/,/g, "");
      }
    });
  }
}

Tessarray.prototype._setContainerState = function() {
  this.containerIsReady = true;
  if (this.boxesAreReady()) {
    this.initialRender();
  }
};

// Determine if every element that needs to load has loaded its dimensions
Tessarray.prototype.boxesAreReady = function() {
  if (!this.boxesHaveBeenCreated) {
    return false; 
  } else {
    for (var i = 0; i < this.boxesAspectRatioStates.length; i++) {
      if (!this.boxesAspectRatioStates[i]) {
        return false;
      }
    }
  }
  return true;
};


// ------ TessarrayBox Initialization ------
Tessarray.prototype._createBoxes = function(boxSelector) {
  // For each box node create a newBoxObject
  var invalidBoxNodeCount = 0;
  for (var i = 0; i < boxes.length; i++) {
    var newBoxObject = new TessarrayBox(boxes[i], i, this);

    // Add this newBoxObject to this.boxObjects and the node to this.boxNodes if there is a valid image
    if (!newBoxObject.invalid) {
      this.boxObjects[i - invalidBoxNodeCount] = newBoxObject;
      this.boxNodes[i - invalidBoxNodeCount] = boxes[i];
      this.boxNodes[i - invalidBoxNodeCount].style.position = "absolute";

    // Else incremement counter to ensure there are not gaps in this.boxObjects or this.boxNodes arrays
    } else {
      invalidBoxNodeCount += 1;
    }
  }

  this.boxesHaveBeenCreated = true;
}

var TessarrayBox = function(box, index, tessarray) {
  this.index = index;
  this.boxNode = box;
  this.tessarray = tessarray;
  this.filters = [];
  this.sortData = {};

  // Indicate to the tessarray object that the current image has not yet loaded
  this.tessarray.boxesAspectRatioStates[index] = false; 

  if (this.tessarray.options.selectorClass) {
    this._setFilters();
    this._setSortData();
  }

  this._loadImagesAndSetAspectRatios();
};

TessarrayBox.prototype._setFilters = function() {
  this.tessarray.allFilters.forEach(function(filter) {
    if (box.classList.contains(filter)) {
      this.filters.push(filter);
    }
  }.bind(this));
}

TessarrayBox.prototype._setSortData = function() {
  for (var key in tessarray.allSorts) {
    var sortValue = this._setSortValue()

    // If sortValue is falsey, explicitly set to false
    if (!sortValue) {
      sortValue = false;

    // Check if it is still possibly a numeric field
    } else if (tessarray.allSorts[key]) {
      // If sortValue cannot be turned into a number, set value to false
      if (!this._isValidNumber(sortValue)) {
        tessarray.allSorts[key] = false;
      }
    }
    
    this.sortData[key] = sortValue;
  }
}

TessarrayBox.prototype._setSortValue = function(string) {
  // If key is prepended with "data-", search the box's data attributes for the value
  if (key.slice(0, 5) === "data-") {
    sortValue = box.dataset[this.camelCase(key.slice(5))];
  } else {

    // Else search for an element with the correct class and get its innerHTML 
    if (box.getElementsByClassName(key)[0]) {
      sortValue = box.getElementsByClassName(key)[0].innerHTML.toLowerCase().trim();
    } else {
      sortValue = false;
    }
  }
}

TessarrayBox.prototype._camelCase = function(string) {
  return string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

TessarrayBox.prototype._isValidNumber = function(string) {
  return !(+string.replace(/,/g, "") !== +string.replace(/,/g, ""));
}

TessarrayBox.prototype._loadImagesAndSetAspectRatios = function(string) {
  // Find the image to be rendered in the box. If the box itself is an image, use the box.
  if (box.querySelector('img')) {
    this.image = box.querySelector('img');
  } else if (box.tagName === "IMG") {
    this.image = box;
  }

  // If data attribute for aspect ratio is set or data attribute for height and width are set, call setAspectRatio.
  if (box.getAttribute('data-aspect-ratio') || (box.getAttribute('data-height') && box.getAttribute('data-width'))) {
    this.setAspectRatio(this.tessarray, index);

  // If the image doesn't exist and it does not have height and width or aspect ratio, 
  // call confirm load so the initial render does not wait on this image and raise an error.
  } else if (!this.image || !this.image.getAttribute('src')) {
    this.invalid = true; 
    this.tessarray.boxIsReady(index);
    console.error("One of your images does not exist.");

  // Else, get aspect ratio by loading the image source into Javascript, then boxIsReady once
  // the image has loaded.
  } else {
    var source = this.image.getAttribute('src');
    var img = new Image();
    var thisBoxObj = this;
    img.onload = function() {
      thisBoxObj.aspectRatio = this.width / this.height;
      tessarray.boxIsReady(index);
      box.classList.add(tessarray.options.boxLoadedClass);
      if (typeof tessarray.options.onBoxLoad === "function") {
        tessarray.options.onBoxLoad(thisBoxObj);
      }
    };
    img.src = source;
  }
}
 
// Set aspect ratio for TessarrayBox and then boxIsReady.
// If TessarrayBox has an image, this loads image in javascript before setting 
// the boxLoadedClass and triggering the onBoxLoad
TessarrayBox.prototype.setAspectRatio = function(tessarray, index) {
  if (this.boxNode.getAttribute('data-aspect-ratio')) {
    this.aspectRatio = parseFloat(this.boxNode.getAttribute('data-aspect-ratio'));
  } else if (this.boxNode.getAttribute('data-height') && this.boxNode.getAttribute('data-width')) {
    this.aspectRatio = parseFloat(this.boxNode.getAttribute('data-width')) / parseFloat(this.boxNode.getAttribute('data-height'));
  } 
  tessarray.boxIsReady(index);

  // If image exists, load it
  if (this.image) {
    var source = this.image.getAttribute('src');
    var img = new Image();
    var thisBoxObj = this;
    img.onload = function() {
      thisBoxObj.boxNode.classList.add(tessarray.options.boxLoadedClass);
      if (typeof tessarray.options.onBoxLoad === "function") {
        tessarray.options.onBoxLoad(thisBoxObj);
      }
    };
    img.src = source;

  // Else trigger boxLoaded immediately.
  } else {
    this.boxNode.classList.add(tessarray.options.boxLoadedClass);
    if (typeof tessarray.options.onBoxLoad === "function") {
      tessarray.options.onBoxLoad(this);
    }
  }
};

// Set index of boxesAspectRatioStates to be true. If every element in boxesAspectRatioStates is either
// true or undefined, then the intial render is called. 
Tessarray.prototype.boxIsReady = function(index) {
  this.boxesAspectRatioStates[index] = true;
  if (this.boxesAreReady() && this.containerIsReady) {
    this.initialRender();
  }
};

// ------ Render Functions ------

// Rerender the boxes if the container width has not been specified and container width has changed since last render
Tessarray.prototype.renderOnResize = function() {
  if ((!this.specifiedContainerWidth) && (this.options.flickr.containerWidth !== this.container.clientWidth)) {
    this.debounce(this.render.bind(this), 100)();
  }
};

// Debounce used to prevent tessarray from calling render too frequently when resizing window.
Tessarray.prototype.debounce = function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// Render the boxes for the first time
Tessarray.prototype.initialRender = function() {

  // Make the container opaque, add containerLoaded class, and trigger onContainerLoad.
  this.container.style.opacity = "1";
  this.container.classList.add(this.options.containerLoadedClass);
  if (typeof this.options.onContainerLoad === "function") {
    this.options.onContainerLoad(this);
  }

  // If selectors are being used and there is a defaultFilter or defaultSort, sort and filter on those values
  // before initial render.
  if (this.options.selectorClass && this.options.defaultFilter && this.options.defaultSort) {
    // Pass true to indicate that this is the initial render
    this.filterAndSort(this.options.defaultFilter, this.options.defaultSort, true);

  // Else, render every box
  } else {
    this.selectedBoxes = this.boxObjects.slice();

    // Pass true to indicate that this is the initial render
    this.render(true);
  }
};

Tessarray.prototype.filterAndSort = function(filterString, sortString, initialRender) {
  // If not the first render and there have been no changes to filtering or sorting, break out of filterAndSort
  if ((!initialRender) && ((filterString === this.activeFilter) || (filterString === false)) && ((sortString === this.activeSort) || (sortString === false))) {
    return;
  }

  // Filter
  if ((filterString === this.activeFilter) || (filterString === false)) {
    // Do nothing
  } else if (filterString === "") {
    this.activeFilter = filterString;
    this.selectedBoxes = this.boxObjects.slice();
  } else {
    this.activeFilter = filterString;
    this.selectedBoxes = this.boxObjects.filter(function(box) {
      return box.filters.indexOf(filterString) >= 0;
    });
  }

  // Sort
  if ((sortString === this.activeSort) || (sortString === false)) {
    // Do nothing
  } else if (sortString === "") {
    this.activeSort = sortString;
    this.selectedBoxes = this.selectedBoxes.sort(function(boxA, boxB) {
      return boxA.index - boxB.index;
    });
  } else {
    this.activeSort = sortString;
    // Place boxes without values (thus given value of false) at the end
    this.selectedBoxes = this.selectedBoxes.sort(function(boxA, boxB) {
      if (boxA.sortData[sortString] === false) {
        return 1;
      } else if (boxB.sortData[sortString] === false) {
        return -1;
      } else if (boxA.sortData[sortString] < boxB.sortData[sortString]) {
        return -1;
      } else if (boxA.sortData[sortString] > boxB.sortData[sortString]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  // Change this with initialRender changes
  if (initialRender === true) {
    this.render(true);
  } else {
    this.render();
  }
}

Tessarray.prototype.filter = function(filterString) {
  this.filterAndSort(filterString, false);
}

Tessarray.prototype.sort = function(sortString) {
  this.filterAndSort(false, sortString);
}

// Helper method to change the scale of boxNodes without overwriting their translated position
Tessarray.prototype._scale = function(boxNode, scale) {
  if (this.boxTransformOutTransition) {
    boxNode.style.transition = this.boxTransformOutTransition;
  }

  var transformStyle = boxNode.style.transform;
  // If boxNode has a transform style already, change the scale but not the translation
  if (transformStyle !== "") {
    boxNode.style.transform = transformStyle.replace(/(scale\()(\d)(\))/, ("$1" + scale.toString() + "$3"));
  } else {
    boxNode.style.transform = "translate(0px, 0px) scale(" + scale.toString() + ")";
  }
};

// Add transition to boxes. This is called every render except for the initial render
Tessarray.prototype._addTransitionToAllBoxNodes = function() {
  if (this.boxTransition) {
    for (var i = 0; i < this.boxNodes.length; i++) {
      this.boxNodes[i].style.transition = this.boxTransition;
    }
  }
};

// Render the boxes with the correct coordinates
Tessarray.prototype.render = function(initialRender) {
  this._setContainerWidth();
  // Get coordinates from Flickr Justified Layout using an array of the aspect ratios of the selectedBoxes. 
  this.layoutGeometry = require('justified-layout')(this.selectedBoxes.map(function(box) { return box.aspectRatio; }), this.options.flickr);

  // Give container appropriate height for the images it contains.
  if (this.layoutGeometry.boxes.length > 0) {
    var height = this.layoutGeometry.boxes[this.layoutGeometry.boxes.length - 1].top + this.layoutGeometry.boxes[this.layoutGeometry.boxes.length - 1].height + this.containerPaddingBottom;
    this.container.style.height = height.toString() + "px";
  } else {
    this.container.style.height = "0px";
  }

  // If not the initial render, ensure that there are transitions for height, width and translate
  // for each box
  if (!initialRender) {
    this._addTransitionToAllBoxNodes();
  } 

  // For each boxNode
  for (var i = 0; i < this.boxObjects.length; i++) {

    // If this box is to be rendered in the current filteration
    var boxObjectIndex = this.selectedBoxes.indexOf(this.boxObjects[i]);
    if (boxObjectIndex >= 0) {

      // Grab the appropriate box information from Flickr Justified layout
      var box = this.layoutGeometry.boxes[boxObjectIndex];

      // Apply Flickr data to the selected box unless box is undefined. Box can be undefined if it was not
      // filtered out, but is not rendered due to Flickr options (such as showWidows: false).
      if (box !== undefined) {
        this.boxNodes[i].style.transform = "translate(" + box.left + "px, " + box.top + "px) scale(1)";
        this.boxNodes[i].style.height = box.height + "px";
        this.boxNodes[i].style.width = box.width + "px";

      // If it is undefined, scale it down to 0
      } else {
        this._scale(this.boxNodes[i], 0);
      }

    // Else remove the boxNode from sight
    } else {
      this._scale(this.boxNodes[i], 0);
    }
  }

  if (initialRender) {
    if (typeof this.options.onRender === "function") {
      this.options.onRender(this, true);
    }
  } else {
    if (typeof this.options.onRender === "function") {
      this.options.onRender(this, false);
    }
  }
  // Is this necessary for a reflow?
  this.container.offsetTop;
};

// Destroy method for Tessarray.
// Remove event listeners on selectors and window, remove transition from container and boxNodes.
// Remove pointers to boxObjects. Leaving position and such so the display does not change.
Tessarray.prototype.destroy = function() {
  if (this.eventListeners.window) {
    window.removeEventListener('resize', this.eventListeners.window);
  }
  if (this.eventListeners.container) {
    this.container.removeEventListener('transitionend', this.eventListeners.container);
  }

  if (this.options.containerTransition) {
    this.container.style.transition = "";
  }

  this.boxNodes.forEach(function(boxNode) {
    boxNode.style.transition = "";
  });
  
  if (this.selectors) {
    this.selectors.forEach(function(selector) {
      selector.removeEventListener('click', this.eventListeners[j]);
    });
  }

  delete this.boxObjects;
};