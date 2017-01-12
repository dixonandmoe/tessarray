// ------ Tessarray ------
// Copyright 2016 Dixon and Moe
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

// ------ Flickr Justified Layout ------
// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license.
require=function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '" +o+ "'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){"use strict";var merge=require("merge");var Row=module.exports=function(params){this.top=params.top;this.left=params.left;this.width=params.width;this.spacing=params.spacing;this.targetRowHeight=params.targetRowHeight;this.targetRowHeightTolerance=params.targetRowHeightTolerance;this.minAspectRatio=this.width/params.targetRowHeight*(1-params.targetRowHeightTolerance);this.maxAspectRatio=this.width/params.targetRowHeight*(1+params.targetRowHeightTolerance);this.edgeCaseMinRowHeight=params.edgeCaseMinRowHeight||Number.NEGATIVE_INFINITY;this.edgeCaseMaxRowHeight=params.edgeCaseMaxRowHeight||Number.POSITIVE_INFINITY;this.rightToLeft=params.rightToLeft;this.isBreakoutRow=params.isBreakoutRow;this.items=[];this.height=0};Row.prototype={addItem:function addItem(itemData){var newItems=this.items.concat(itemData),rowWidthWithoutSpacing=this.width-(newItems.length-1)*this.spacing,newAspectRatio=newItems.reduce(function(sum,item){return sum+item.aspectRatio},0),targetAspectRatio=rowWidthWithoutSpacing/this.targetRowHeight,previousRowWidthWithoutSpacing,previousAspectRatio,previousTargetAspectRatio;if(this.isBreakoutRow){if(this.items.length===0){if(itemData.aspectRatio>=1){this.items.push(itemData);this.completeLayout(rowWidthWithoutSpacing/itemData.aspectRatio);return true}}}if(newAspectRatio===0){return false}if(newAspectRatio<this.minAspectRatio){this.items.push(merge(itemData));return true}else if(newAspectRatio>this.maxAspectRatio){if(this.items.length===0){this.items.push(merge(itemData));this.completeLayout(rowWidthWithoutSpacing/newAspectRatio);return true}previousRowWidthWithoutSpacing=this.width-(this.items.length-1)*this.spacing;previousAspectRatio=this.items.reduce(function(sum,item){return sum+item.aspectRatio},0);previousTargetAspectRatio=previousRowWidthWithoutSpacing/this.targetRowHeight;if(Math.abs(newAspectRatio-targetAspectRatio)>Math.abs(previousAspectRatio-previousTargetAspectRatio)){this.completeLayout(previousRowWidthWithoutSpacing/previousAspectRatio);return false}else{this.items.push(merge(itemData));this.completeLayout(rowWidthWithoutSpacing/newAspectRatio);return true}}else{this.items.push(merge(itemData));this.completeLayout(rowWidthWithoutSpacing/newAspectRatio);return true}},isLayoutComplete:function isLayoutComplete(){return this.height>0},completeLayout:function completeLayout(newHeight,justify){var itemWidthSum=this.rightToLeft?-this.left:this.left,rowWidthWithoutSpacing=this.width-(this.items.length-1)*this.spacing,clampedToNativeRatio,roundedHeight,clampedHeight,errorWidthPerItem,roundedCumulativeErrors,singleItemGeometry,self=this;if(typeof justify==="undefined"){justify=true}roundedHeight=Math.round(newHeight);clampedHeight=Math.max(this.edgeCaseMinRowHeight,Math.min(roundedHeight,this.edgeCaseMaxRowHeight));if(roundedHeight!==clampedHeight){this.height=clampedHeight;clampedToNativeRatio=rowWidthWithoutSpacing/clampedHeight/(rowWidthWithoutSpacing/roundedHeight)}else{this.height=roundedHeight;clampedToNativeRatio=1}this.items.forEach(function(item,i){item.top=self.top;item.width=Math.round(item.aspectRatio*self.height*clampedToNativeRatio);item.height=self.height;if(self.rightToLeft){item.left=self.width-itemWidthSum-item.width}else{item.left=itemWidthSum}itemWidthSum+=item.width+self.spacing});if(justify){if(!this.rightToLeft){itemWidthSum-=this.spacing+this.left}errorWidthPerItem=(itemWidthSum-this.width)/this.items.length;roundedCumulativeErrors=this.items.map(function(item,i){return Math.round((i+1)*errorWidthPerItem)});if(this.items.length===1){singleItemGeometry=this.items[0];singleItemGeometry.width-=Math.round(errorWidthPerItem);if(this.rightToLeft){singleItemGeometry.left+=Math.round(errorWidthPerItem)}}else{this.items.forEach(function(item,i){if(i>0){item.left-=roundedCumulativeErrors[i-1];item.width-=roundedCumulativeErrors[i]-roundedCumulativeErrors[i-1]}else{item.width-=roundedCumulativeErrors[i]}})}}},forceComplete:function forceComplete(fitToWidth,rowHeight){var rowWidthWithoutSpacing=this.width-(this.items.length-1)*this.spacing,currentAspectRatio=this.items.reduce(function(sum,item){return sum+item.aspectRatio},0);if(typeof rowHeight==="number"){this.completeLayout(rowHeight,false)}else if(fitToWidth){this.completeLayout(rowWidthWithoutSpacing/currentAspectRatio)}else{this.completeLayout(this.targetRowHeight,false)}},getItems:function getItems(){return this.items}}},{merge:2}],2:[function(require,module,exports){(function(isNode){var Public=function(clone){return merge(clone===true,false,arguments)},publicName="merge";Public.recursive=function(clone){return merge(clone===true,true,arguments)};Public.clone=function(input){var output=input,type=typeOf(input),index,size;if(type==="array"){output=[];size=input.length;for(index=0;index<size;++index)output[index]=Public.clone(input[index])}else if(type==="object"){output={};for(index in input)output[index]=Public.clone(input[index])}return output};function merge_recursive(base,extend){if(typeOf(base)!=="object")return extend;for(var key in extend){if(typeOf(base[key])==="object"&&typeOf(extend[key])==="object"){base[key]=merge_recursive(base[key],extend[key])}else{base[key]=extend[key]}}return base}function merge(clone,recursive,argv){var result=argv[0],size=argv.length;if(clone||typeOf(result)!=="object")result={};for(var index=0;index<size;++index){var item=argv[index],type=typeOf(item);if(type!=="object")continue;for(var key in item){var sitem=clone?Public.clone(item[key]):item[key];if(recursive){result[key]=merge_recursive(result[key],sitem)}else{result[key]=sitem}}}return result}function typeOf(input){return{}.toString.call(input).slice(8,-1).toLowerCase()}if(isNode){module.exports=Public}else{window[publicName]=Public}})(typeof module==="object"&&module&&typeof module.exports==="object"&&module.exports)},{}],"justified-layout":[function(require,module,exports){"use strict";var merge=require("merge"),Row=require("./row"),layoutConfig={},layoutData={},currentRow=false;module.exports=function(input){var config=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];var defaults={containerWidth:1060,containerPadding:10,boxSpacing:10,targetRowHeight:320,targetRowHeightTolerance:.25,maxNumRows:Number.POSITIVE_INFINITY,forceAspectRatio:false,showWidows:true,fullWidthBreakoutRowCadence:false};layoutConfig=merge(defaults,config);var containerPadding={};var boxSpacing={};containerPadding.top=!isNaN(parseFloat(layoutConfig.containerPadding.top))?layoutConfig.containerPadding.top:layoutConfig.containerPadding;containerPadding.right=!isNaN(parseFloat(layoutConfig.containerPadding.right))?layoutConfig.containerPadding.right:layoutConfig.containerPadding;containerPadding.bottom=!isNaN(parseFloat(layoutConfig.containerPadding.bottom))?layoutConfig.containerPadding.bottom:layoutConfig.containerPadding;containerPadding.left=!isNaN(parseFloat(layoutConfig.containerPadding.left))?layoutConfig.containerPadding.left:layoutConfig.containerPadding;boxSpacing.horizontal=!isNaN(parseFloat(layoutConfig.boxSpacing.horizontal))?layoutConfig.boxSpacing.horizontal:layoutConfig.boxSpacing;boxSpacing.vertical=!isNaN(parseFloat(layoutConfig.boxSpacing.vertical))?layoutConfig.boxSpacing.vertical:layoutConfig.boxSpacing;layoutConfig.containerPadding=containerPadding;layoutConfig.boxSpacing=boxSpacing;layoutData._layoutItems=[];layoutData._awakeItems=[];layoutData._inViewportItems=[];layoutData._leadingOrphans=[];layoutData._trailingOrphans=[];layoutData._containerHeight=layoutConfig.containerPadding.top;layoutData._rows=[];layoutData._orphans=[];return computeLayout(input.map(function(item){if(item.width&&item.width){return{aspectRatio:item.width/item.height}}else{return{aspectRatio:item}}}))};function computeLayout(itemLayoutData){var notAddedNotComplete,laidOutItems=[],itemAdded,currentRow,nextToLastRowHeight;if(layoutConfig.forceAspectRatio){itemLayoutData.forEach(function(itemData){itemData.forcedAspectRatio=true;itemData.aspectRatio=layoutConfig.forceAspectRatio})}itemLayoutData.some(function(itemData,i){notAddedNotComplete=false;if(!currentRow){currentRow=createNewRow()}itemAdded=currentRow.addItem(itemData);if(currentRow.isLayoutComplete()){laidOutItems=laidOutItems.concat(addRow(currentRow));if(layoutData._rows.length>=layoutConfig.maxNumRows){currentRow=null;return true}currentRow=createNewRow();if(!itemAdded){itemAdded=currentRow.addItem(itemData);if(currentRow.isLayoutComplete()){laidOutItems=laidOutItems.concat(addRow(currentRow));if(layoutData._rows.length>=layoutConfig.maxNumRows){currentRow=null;return true}currentRow=createNewRow()}else if(!itemAdded){notAddedNotComplete=true}}}else{if(!itemAdded){notAddedNotComplete=true}}});if(currentRow&&currentRow.getItems().length&&layoutConfig.showWidows){if(layoutData._rows.length){if(layoutData._rows[layoutData._rows.length-1].isBreakoutRow){nextToLastRowHeight=layoutData._rows[layoutData._rows.length-1].targetRowHeight}else{nextToLastRowHeight=layoutData._rows[layoutData._rows.length-1].height}currentRow.forceComplete(false,nextToLastRowHeight||layoutConfig.targetRowHeight)}else{currentRow.forceComplete(false)}laidOutItems=laidOutItems.concat(addRow(currentRow))}layoutData._containerHeight=layoutData._containerHeight-layoutConfig.boxSpacing.vertical;layoutData._containerHeight=layoutData._containerHeight+layoutConfig.containerPadding.bottom;return{containerHeight:layoutData._containerHeight,boxes:layoutData._layoutItems}}function createNewRow(){if(layoutConfig.fullWidthBreakoutRowCadence!==false){if((layoutData._rows.length+1)%layoutConfig.fullWidthBreakoutRowCadence===0){var isBreakoutRow=true}}return new Row({top:layoutData._containerHeight,left:layoutConfig.containerPadding.left,width:layoutConfig.containerWidth-layoutConfig.containerPadding.left-layoutConfig.containerPadding.right,spacing:layoutConfig.boxSpacing.horizontal,targetRowHeight:layoutConfig.targetRowHeight,targetRowHeightTolerance:layoutConfig.targetRowHeightTolerance,edgeCaseMinRowHeight:.5*layoutConfig.targetRowHeight,edgeCaseMaxRowHeight:2*layoutConfig.targetRowHeight,rightToLeft:false,isBreakoutRow:isBreakoutRow})}function addRow(row){layoutData._rows.push(row);layoutData._layoutItems=layoutData._layoutItems.concat(row.getItems());layoutData._containerHeight+=row.height+layoutConfig.boxSpacing.vertical;return row.items}},{"./row":1,merge:2}]},{},[]);


// ------ Tessaray Initialization ------
var Tessarray = function(boxSelector, containerSelector, options) {
  this.container = document.querySelector(containerSelector);
  this.boxSelector = boxSelector;
  this.options = options || {};

  // The eventListeners object is used to record what functions have been added to which
  // elements so they can be removed in the destroy method.
  this.eventListeners = {}
  
  // Set default values for options
  this.setOptionValue("selectorClass", false);
  this.setOptionValue("imageClass", false);
  this.setOptionValue("defaultCategory", false);
  this.setOptionValue("resize", true);
  this.setOptionValue("containerTransition", {
    duration: 300,
    timingFunction: "ease-in",
    delay: 0
  });
  this.setOptionValue("boxTransition", {
    duration: 500,
    timingFunction: "ease-in",
    delay: 0
  });
  this.setOptionValue("boxTransformOutTransition", {
    duration: 250,
    timingFunction: "ease-in",
    delay: 0
  });
  this.setOptionValue("containerLoadedClass", 'container-is-loaded');
  this.setOptionValue("boxLoadedClass", 'is-loaded');
  this.setOptionValue("containerLoadedCallback", false);
  this.setOptionValue("boxLoadedCallback", false);
  this.setOptionValue("flickr", {});


  // Instantiate variables to keep track of whether or not Tessarray needs to wait to load the image dimensions before rendering
  this.dimensionsLoaded = [];
  this.containerHasLoaded = false;

  // For each of the transitions, check the type. 
  // If it is an object, use the keys of the object to set the transition
  // If it is a string, set the transition directly

  // containerTransition controls the transition from 0 opacity to 1 once the container is loaded.
  if (typeof this.options.containerTransition === "object") {
    this.containerTransition = "opacity " + this.options.containerTransition.duration + "ms " + this.options.containerTransition.timingFunction + " " + this.options.containerTransition.delay + "ms";
  } else if (typeof this.options.containerTransition === "string") {
    this.containerTransition = this.options.containerTransition;
  }

  // boxTransition controls the movement of boxes, the resizing of boxes, and the scaling of boxes from 1 to 0.
  if (typeof this.options.boxTransition === "object") {
    this.boxTransition = "transform " + this.options.boxTransition.duration + "ms " + this.options.boxTransition.timingFunction + " " + this.options.boxTransition.delay + "ms, height " + this.options.boxTransition.duration + "ms " + this.options.boxTransition.timingFunction + " " + this.options.boxTransition.delay + "ms, width " + this.options.boxTransition.duration + "ms " + this.options.boxTransition.timingFunction + " " + this.options.boxTransition.delay + "ms";
  } else if (typeof this.options.boxTransition === "string") {
    this.boxTransition = this.options.boxTransition;
  }

  // boxTransformOutTransition controlls the scaling of boxes from 0 to 1. 
  if (typeof this.options.boxTransformOutTransition === "object") {
    this.boxTransformOutTransition = "transform " + this.options.boxTransformOutTransition.duration + "ms " + this.options.boxTransformOutTransition.timingFunction + " " + this.options.boxTransformOutTransition.delay + "ms";
  } else if (typeof this.options.boxTransformOutTransition === "string") {
    this.boxTransformOutTransition = this.options.boxTransformOutTransition;
  }

  // Check if user specified containerWidth
  this.specifiedContainerWidth = !!this.options.flickr.containerWidth;

  // Array of html nodes of each box
  this.boxNodes = [];

  // Array of javascript objects representing each box
  this.boxObjects = [];

  // Scope boxes to containerSelector
  var boxes = this.container.querySelectorAll(this.boxSelector);

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

  // Set width that is passed to the Justified Layout to be the current width of the container
  this.setContainerWidth();

  // Give container relative positioning 
  this.container.style.position = "relative";

  // Give container opacity of 0, this will be changed to 1 once a the first layout geometry is loaded
  // from Flickr's Justified Layout
  this.container.style.opacity = "0"; 

  // Set containerTransition to container if containerTransition exists. User could set containerTransition
  // to false for no container transitions.
  if (this.options.containerTransition) {
    this.container.style.transition = this.containerTransition;
  }

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

  // If this.options.resize, resize the container upon window size change if 
  // container size is modified
  if (this.options.resize) {
    this.eventListeners["window"] = this.renderIfNecessary.bind(this);
    window.addEventListener("resize", this.eventListeners["window"])
  }

  // Confirm that this.container has the correct data and is ready to render
  this.containerLoad();

  // If given selectorClass is given, bind sortByCategory to the click of each selector
  // Do not put in initialize function so multiple event listeners are not assigned
  if (this.options.selectorClass) {
    this.selectors = document.getElementsByClassName(this.options.selectorClass);
    for (var i = 0; i < this.selectors.length; i++) {
      var category = this.selectors[i].getAttribute('data-category');
      this.eventListeners[i] = this.sortByCategory.bind(this, category);
      this.selectors[i].addEventListener("click", this.eventListeners[i]);
    }
  }
}



// ------ TessarrayBox Initialization ------
// Create JavaScript Object that represents a html element
var TessarrayBox = function(box, index, tessarray) {
  this.index = index;
  this.classes = {};

  // Indicate to the tessarray object that the current image has not yet loaded
  tessarray.dimensionsLoaded[index] = false; 

  // Give this.classes key values of every category is belongs to and values of the position
  // if the position was given.
  var classes = box.getAttribute('class').split(" ");
  for (var i = 0; i < classes.length; i++) {
    this.classes[classes[i]] = box.dataset[classes[i]] || null;
  }

  // Find the image to be rendered in the box. If imageClass is given, use that class to find the element.
  // If the box itself is an image, use the box.
  if (tessarray.options.imageClass) {
    this.image = box.getElementsByClassName(tessarray.options.imageClass)[0];
  } else if (box.querySelector('img')) {
    this.image = box.querySelector('img');
  } else if (box.tagName === "IMG") {
    this.image = box;
  }

  // If data attribute for aspect ratio is set or data attribute for height and width are set, call setAspectRatio.
  if (box.getAttribute('data-aspect-ratio') || (box.getAttribute('data-height') && box.getAttribute('data-width'))) {
    this.givenAspectRatio = true;
    this.setAspectRatio(tessarray, box, index);

  // If the image doesn't exist and it does not have height and width or aspect ratio, 
  // call confirm load so the initial render does not wait on this image and raise an error.
  } else if (!this.image || !this.image.getAttribute('src')) {
    this.invalid = true; 
    tessarray.confirmLoad(index);
    console.log("One of your images does not exist.");

  // Else, get aspect ratio by loading the image source into Javascript, then confirmLoad once
  // the image has loaded.
  } else {
    this.givenAspectRatio = false;
    var source = this.image.getAttribute('src');
    var img = new Image();
    var thisBox = this;
    img.onload = function() {
      thisBox.aspectRatio = this.width / this.height;
      tessarray.confirmLoad(index);
      box.classList.add(tessarray.options.boxLoadedClass);
      if (typeof tessarray.options.boxLoadedCallback === "function") {
        tessarray.options.boxLoadedCallback(this);
      }
    }
    img.src = source;
  }
}

 
// ------ Tessarray Functions ------
// Sets default values for options, does so by checking if undefined rather than falsey
Tessarray.prototype.setOptionValue = function(key, defaultValue) {
  if (this.options[key] === undefined) {
    this.options[key] = defaultValue;
  }
}

// Update container width to be the width of the container element if container width was
// not specified
Tessarray.prototype.setContainerWidth = function() {
  if (!this.specifiedContainerWidth) {
    this.options.flickr.containerWidth = this.container.clientWidth;
  }
}

// Set aspect ratio for TessarrayBox and then confirmLoad.
// If TessarrayBox has an image, this loads image in javascript before setting 
// the boxLoadedClass and triggering the boxLoadedCallback
TessarrayBox.prototype.setAspectRatio = function(tessarray, box, index) {
  if (box.getAttribute('data-aspect-ratio')) {
    this.aspectRatio = parseFloat(box.getAttribute('data-aspect-ratio'));
    tessarray.confirmLoad(index);
  } else if (box.getAttribute('data-height') && box.getAttribute('data-width')) {
    this.aspectRatio = parseFloat(box.getAttribute('data-height')) / parseFloat(box.getAttribute('data-width'));
    tessarray.confirmLoad(index);
  } 

  // If image exists, load it
  if (this.image) {
    var source = this.image.getAttribute('src');
    var img = new Image();
    var thisBoxObj = this;
    img.onload = function() {
      box.classList.add(tessarray.options.boxLoadedClass);
      if (typeof tessarray.options.boxLoadedCallback === "function") {
        tessarray.options.boxLoadedCallback(this);
      }
    }
    img.src = source;

  // Else trigger boxLoaded immediately.
  } else {
    box.classList.add(tessarray.options.boxLoadedClass);
    if (typeof tessarray.options.boxLoadedCallback === "function") {
      tessarray.options.boxLoadedCallback(this);
    }
  }
}

// Set index of dimensionsLoaded to be true. If every element in dimensionsLoaded is either
// true or undefined, then the intial render is called. 
Tessarray.prototype.confirmLoad = function(index) {
  this.dimensionsLoaded[index] = true;
  if (this.deterimineIfBoxesLoaded() && this.containerHasLoaded) {
    this.initialRender();
  }
}

// Confirm that container has loaded, and attempt initial render if boxes have loaded already
Tessarray.prototype.containerLoad = function() {
  this.containerHasLoaded = true;
  if (this.deterimineIfBoxesLoaded()) {
    this.initialRender();
  }
}

// Determine if every element that needs to load has loaded its dimensions
Tessarray.prototype.deterimineIfBoxesLoaded = function() {
  for (var i = 0; i < this.dimensionsLoaded.length; i++) {
    if (!this.dimensionsLoaded[i]) {
      return false;
    }
  }
  return true;
}

// Rerender the boxes if the container width has not been specified and container width has changed since last render
Tessarray.prototype.renderIfNecessary = function() {
  if ((!this.specifiedContainerWidth) && (this.options.flickr.containerWidth !== this.container.clientWidth)) {
    this.renderBoxes();
  }
}

// Render the boxes for the first time
Tessarray.prototype.initialRender = function() {

  // Make the container opaque, add containerLoaded class, and trigger containerLoadedCallback.
  this.container.style.opacity = "1";
  this.container.classList.add(this.options.containerLoadedClass);
  if (typeof this.options.containerLoadedCallback === "function") {
    this.options.containerLoadedCallback();
  }

  // If selectors are being used and there is a defaultCategory, render that category.
  if (this.options.selectorClass && this.options.defaultCategory) {

    // Pass in true to indicate that this is handling the initial render.
    this.sortByCategory(this.options.defaultCategory, true);

  // Else, render every box
  } else {
    this.setSelectedBoxes(this.boxObjects);

    // Pass true to indicate that this is the initial render
    this.renderBoxes(true);
  }
}

// Filter boxes by class, and then sort them by data-attribute values for that class
Tessarray.prototype.sortByCategory = function(category, initialRender) {
  if (category === "") {
    var sortedBoxes = this.boxObjects;
  } else {
    var filteredBoxes = this.boxObjects.filter(function(box) {
      return box.classes[category] !== undefined;
    });

    var sortedBoxes = filteredBoxes.sort(function(boxA, boxB) {
      return parseInt(boxA.classes[category]) - parseInt(boxB.classes[category]);
    });
  }

  // Update sortedBoxes attribute and re-render the boxes.
  // Can't pass in initialRender because event is inadvertently passed as a parameter
  // and it is truthy. Could add event.preventDefault() earlier, but it might overwrite
  // other functionality implemented by the user.
  this.setSelectedBoxes(sortedBoxes);
  if (initialRender === true) {
    this.renderBoxes(true);
  } else {
    this.renderBoxes();
  }
}

// Grab the necessary information of the selectedBoxes (ratio and index),
// while maintaining the selectedBoxes attribute for readability
Tessarray.prototype.setSelectedBoxes = function(sortedBoxes) {
  this.selectedBoxes = sortedBoxes;

  // Create new this.indexes.
  // this.indexes will be an array of indexes of boxes in the order that they are to be rendered.
  // For example, if there were three boxes and they were to be shown in reverse order, this.indexes
  // would be [2,1,0]
  this.indexes = this.selectedBoxes.map(function(box) {
    return box.index;
  });

  this.ratios = sortedBoxes.map(function(box) {
    return parseFloat(box.aspectRatio);
  });
}

// Helper method to change the scale of boxNodes without overwriting their translated position
Tessarray.prototype.scale = function(boxNode, scale) {
  var transformStyle = boxNode.style.transform;

  // If boxNode has a transform style already, change the scale but not the translation
  boxNode.style.transition = this.boxTransformOutTransition;
  if (transformStyle !== "") {
    boxNode.style.transform = transformStyle.replace(/(scale\()(\d)(\))/, ("$1" + scale.toString() + "$3"));
  } else {
    boxNode.style.transform = "translate(0px, 0px) scale(" + scale.toString() + ")";
  }
}

// Add transition to boxes. This is called every render except for the initial render
Tessarray.prototype.addTransitionToAllBoxNodes = function(callback) {
  for (var i = 0; i < this.boxNodes.length; i++) {
    this.boxNodes[i].style.transition = this.boxTransition;
  }
}

// Render the boxes with the correct coordinates
Tessarray.prototype.renderBoxes = function(initialRender) {
  this.setContainerWidth();

  // Get coordinates from Flickr Justified Layout
  var layoutGeometry = require('justified-layout')(this.ratios, this.options.flickr);

  // Give container appropriate height for the images it contains.
  if (layoutGeometry.boxes.length > 0) {
    var height = layoutGeometry.boxes[layoutGeometry.boxes.length - 1].top + layoutGeometry.boxes[layoutGeometry.boxes.length - 1].height + this.containerPaddingBottom;
    this.container.style.height = height.toString() + "px";
  } else {
    this.container.style.height = "0px";
  }

  // If not the initial render, ensure that there are transitions for height, width and translate
  // for each box
  if (!initialRender) {
    this.addTransitionToAllBoxNodes();
  } 

  // For each boxNode
  for (var i = 0; i < this.boxNodes.length; i++) {

    // If this box is to be rendered in the current filteration
    if (this.indexes.includes(i)) {

      // Grab the appropriate box information from Flickr Justified layout
      var box = layoutGeometry.boxes[this.indexes.indexOf(i)];

      // Apply Flickr data to the selected box unless box is undefined. Box can be undefined if it was not
      // filtered out, but is not rendered due to Flickr options (such as showWidows: false).
      if (box !== undefined) {
        this.boxNodes[i].style.transform = "translate(" + box.left + "px, " + box.top + "px) scale(1)";
        this.boxNodes[i].style.height = box.height + "px";
        this.boxNodes[i].style.width = box.width + "px";

      // If it is undefined, scale it down to 0
      } else {
        this.scale(this.boxNodes[i], 0);
      }

    // Else remove the boxNode from sight
    } else {
      this.scale(this.boxNodes[i], 0);
    }
  } 
}

// Destroy method for Tessarray.
// Remove event listeners on selectors and window, remove transition from container and boxNodes.
// Remove pointers to boxObjects. Leaving position and such so the display does not change.
Tessarray.prototype.destroy = function() {
  if (this.eventListeners["window"]) {
    window.removeEventListener('resize', this.eventListeners["window"]);
  }

  this.container.style.transition = "";
  // this.container.style.opacity = "";
  // this.container.style.position = "";
  // this.container.classList.remove(this.containerLoadedClass);

  for (i = 0; i < this.boxNodes.length; i++) {
    this.boxNodes[i].style.transition = "";
    // this.boxNodes[i].style.position = "";
    // this.classList.remove(this.boxLoadedClass);
  }
  
  for (j = 0; j < this.selectors.length; j++) {
    this.selectors[j].removeEventListener('click', this.eventListeners[j]);
  }

  this.boxObjects = null;
  delete this.boxObjects;
  this.eventListeners = null;
  delete this.eventListeners;
  delete this;
}