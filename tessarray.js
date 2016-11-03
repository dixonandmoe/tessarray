// ------ Tessarray ------
// Copyright 2016 Dixon and Moe
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.


// ------ Flickr Justified Layout ------
// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license.
require=function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){"use strict";var merge=require("merge");var Row=module.exports=function(params){this.top=params.top;this.left=params.left;this.width=params.width;this.spacing=params.spacing;this.targetRowHeight=params.targetRowHeight;this.targetRowHeightTolerance=params.targetRowHeightTolerance;this.minAspectRatio=this.width/params.targetRowHeight*(1-params.targetRowHeightTolerance);this.maxAspectRatio=this.width/params.targetRowHeight*(1+params.targetRowHeightTolerance);this.edgeCaseMinRowHeight=params.edgeCaseMinRowHeight||Number.NEGATIVE_INFINITY;this.edgeCaseMaxRowHeight=params.edgeCaseMaxRowHeight||Number.POSITIVE_INFINITY;this.rightToLeft=params.rightToLeft;this.isBreakoutRow=params.isBreakoutRow;this.items=[];this.height=0};Row.prototype={addItem:function addItem(itemData){var newItems=this.items.concat(itemData),rowWidthWithoutSpacing=this.width-(newItems.length-1)*this.spacing,newAspectRatio=newItems.reduce(function(sum,item){return sum+item.aspectRatio},0),targetAspectRatio=rowWidthWithoutSpacing/this.targetRowHeight,previousRowWidthWithoutSpacing,previousAspectRatio,previousTargetAspectRatio;if(this.isBreakoutRow){if(this.items.length===0){if(itemData.aspectRatio>=1){this.items.push(itemData);this.completeLayout(rowWidthWithoutSpacing/itemData.aspectRatio);return true}}}if(newAspectRatio===0){return false}if(newAspectRatio<this.minAspectRatio){this.items.push(merge(itemData));return true}else if(newAspectRatio>this.maxAspectRatio){if(this.items.length===0){this.items.push(merge(itemData));this.completeLayout(rowWidthWithoutSpacing/newAspectRatio);return true}previousRowWidthWithoutSpacing=this.width-(this.items.length-1)*this.spacing;previousAspectRatio=this.items.reduce(function(sum,item){return sum+item.aspectRatio},0);previousTargetAspectRatio=previousRowWidthWithoutSpacing/this.targetRowHeight;if(Math.abs(newAspectRatio-targetAspectRatio)>Math.abs(previousAspectRatio-previousTargetAspectRatio)){this.completeLayout(previousRowWidthWithoutSpacing/previousAspectRatio);return false}else{this.items.push(merge(itemData));this.completeLayout(rowWidthWithoutSpacing/newAspectRatio);return true}}else{this.items.push(merge(itemData));this.completeLayout(rowWidthWithoutSpacing/newAspectRatio);return true}},isLayoutComplete:function isLayoutComplete(){return this.height>0},completeLayout:function completeLayout(newHeight,justify){var itemWidthSum=this.rightToLeft?-this.left:this.left,rowWidthWithoutSpacing=this.width-(this.items.length-1)*this.spacing,clampedToNativeRatio,roundedHeight,clampedHeight,errorWidthPerItem,roundedCumulativeErrors,singleItemGeometry,self=this;if(typeof justify==="undefined"){justify=true}roundedHeight=Math.round(newHeight);clampedHeight=Math.max(this.edgeCaseMinRowHeight,Math.min(roundedHeight,this.edgeCaseMaxRowHeight));if(roundedHeight!==clampedHeight){this.height=clampedHeight;clampedToNativeRatio=rowWidthWithoutSpacing/clampedHeight/(rowWidthWithoutSpacing/roundedHeight)}else{this.height=roundedHeight;clampedToNativeRatio=1}this.items.forEach(function(item,i){item.top=self.top;item.width=Math.round(item.aspectRatio*self.height*clampedToNativeRatio);item.height=self.height;if(self.rightToLeft){item.left=self.width-itemWidthSum-item.width}else{item.left=itemWidthSum}itemWidthSum+=item.width+self.spacing});if(justify){if(!this.rightToLeft){itemWidthSum-=this.spacing+this.left}errorWidthPerItem=(itemWidthSum-this.width)/this.items.length;roundedCumulativeErrors=this.items.map(function(item,i){return Math.round((i+1)*errorWidthPerItem)});if(this.items.length===1){singleItemGeometry=this.items[0];singleItemGeometry.width-=Math.round(errorWidthPerItem);if(this.rightToLeft){singleItemGeometry.left+=Math.round(errorWidthPerItem)}}else{this.items.forEach(function(item,i){if(i>0){item.left-=roundedCumulativeErrors[i-1];item.width-=roundedCumulativeErrors[i]-roundedCumulativeErrors[i-1]}else{item.width-=roundedCumulativeErrors[i]}})}}},forceComplete:function forceComplete(fitToWidth,rowHeight){var rowWidthWithoutSpacing=this.width-(this.items.length-1)*this.spacing,currentAspectRatio=this.items.reduce(function(sum,item){return sum+item.aspectRatio},0);if(typeof rowHeight==="number"){this.completeLayout(rowHeight,false)}else if(fitToWidth){this.completeLayout(rowWidthWithoutSpacing/currentAspectRatio)}else{this.completeLayout(this.targetRowHeight,false)}},getItems:function getItems(){return this.items}}},{merge:2}],2:[function(require,module,exports){(function(isNode){var Public=function(clone){return merge(clone===true,false,arguments)},publicName="merge";Public.recursive=function(clone){return merge(clone===true,true,arguments)};Public.clone=function(input){var output=input,type=typeOf(input),index,size;if(type==="array"){output=[];size=input.length;for(index=0;index<size;++index)output[index]=Public.clone(input[index])}else if(type==="object"){output={};for(index in input)output[index]=Public.clone(input[index])}return output};function merge_recursive(base,extend){if(typeOf(base)!=="object")return extend;for(var key in extend){if(typeOf(base[key])==="object"&&typeOf(extend[key])==="object"){base[key]=merge_recursive(base[key],extend[key])}else{base[key]=extend[key]}}return base}function merge(clone,recursive,argv){var result=argv[0],size=argv.length;if(clone||typeOf(result)!=="object")result={};for(var index=0;index<size;++index){var item=argv[index],type=typeOf(item);if(type!=="object")continue;for(var key in item){var sitem=clone?Public.clone(item[key]):item[key];if(recursive){result[key]=merge_recursive(result[key],sitem)}else{result[key]=sitem}}}return result}function typeOf(input){return{}.toString.call(input).slice(8,-1).toLowerCase()}if(isNode){module.exports=Public}else{window[publicName]=Public}})(typeof module==="object"&&module&&typeof module.exports==="object"&&module.exports)},{}],"justified-layout":[function(require,module,exports){"use strict";var merge=require("merge"),Row=require("./row"),layoutConfig={},layoutData={},currentRow=false;module.exports=function(input){var config=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];var defaults={containerWidth:1060,containerPadding:10,boxSpacing:10,targetRowHeight:320,targetRowHeightTolerance:.25,maxNumRows:Number.POSITIVE_INFINITY,forceAspectRatio:false,showWidows:true,fullWidthBreakoutRowCadence:false};layoutConfig=merge(defaults,config);var containerPadding={};var boxSpacing={};containerPadding.top=!isNaN(parseFloat(layoutConfig.containerPadding.top))?layoutConfig.containerPadding.top:layoutConfig.containerPadding;containerPadding.right=!isNaN(parseFloat(layoutConfig.containerPadding.right))?layoutConfig.containerPadding.right:layoutConfig.containerPadding;containerPadding.bottom=!isNaN(parseFloat(layoutConfig.containerPadding.bottom))?layoutConfig.containerPadding.bottom:layoutConfig.containerPadding;containerPadding.left=!isNaN(parseFloat(layoutConfig.containerPadding.left))?layoutConfig.containerPadding.left:layoutConfig.containerPadding;boxSpacing.horizontal=!isNaN(parseFloat(layoutConfig.boxSpacing.horizontal))?layoutConfig.boxSpacing.horizontal:layoutConfig.boxSpacing;boxSpacing.vertical=!isNaN(parseFloat(layoutConfig.boxSpacing.vertical))?layoutConfig.boxSpacing.vertical:layoutConfig.boxSpacing;layoutConfig.containerPadding=containerPadding;layoutConfig.boxSpacing=boxSpacing;layoutData._layoutItems=[];layoutData._awakeItems=[];layoutData._inViewportItems=[];layoutData._leadingOrphans=[];layoutData._trailingOrphans=[];layoutData._containerHeight=layoutConfig.containerPadding.top;layoutData._rows=[];layoutData._orphans=[];return computeLayout(input.map(function(item){if(item.width&&item.width){return{aspectRatio:item.width/item.height}}else{return{aspectRatio:item}}}))};function computeLayout(itemLayoutData){var notAddedNotComplete,laidOutItems=[],itemAdded,currentRow,nextToLastRowHeight;if(layoutConfig.forceAspectRatio){itemLayoutData.forEach(function(itemData){itemData.forcedAspectRatio=true;itemData.aspectRatio=layoutConfig.forceAspectRatio})}itemLayoutData.some(function(itemData,i){notAddedNotComplete=false;if(!currentRow){currentRow=createNewRow()}itemAdded=currentRow.addItem(itemData);if(currentRow.isLayoutComplete()){laidOutItems=laidOutItems.concat(addRow(currentRow));if(layoutData._rows.length>=layoutConfig.maxNumRows){currentRow=null;return true}currentRow=createNewRow();if(!itemAdded){itemAdded=currentRow.addItem(itemData);if(currentRow.isLayoutComplete()){laidOutItems=laidOutItems.concat(addRow(currentRow));if(layoutData._rows.length>=layoutConfig.maxNumRows){currentRow=null;return true}currentRow=createNewRow()}else if(!itemAdded){notAddedNotComplete=true}}}else{if(!itemAdded){notAddedNotComplete=true}}});if(currentRow&&currentRow.getItems().length&&layoutConfig.showWidows){if(layoutData._rows.length){if(layoutData._rows[layoutData._rows.length-1].isBreakoutRow){nextToLastRowHeight=layoutData._rows[layoutData._rows.length-1].targetRowHeight}else{nextToLastRowHeight=layoutData._rows[layoutData._rows.length-1].height}currentRow.forceComplete(false,nextToLastRowHeight||layoutConfig.targetRowHeight)}else{currentRow.forceComplete(false)}laidOutItems=laidOutItems.concat(addRow(currentRow))}layoutData._containerHeight=layoutData._containerHeight-layoutConfig.boxSpacing.vertical;layoutData._containerHeight=layoutData._containerHeight+layoutConfig.containerPadding.bottom;return{containerHeight:layoutData._containerHeight,boxes:layoutData._layoutItems}}function createNewRow(){if(layoutConfig.fullWidthBreakoutRowCadence!==false){if((layoutData._rows.length+1)%layoutConfig.fullWidthBreakoutRowCadence===0){var isBreakoutRow=true}}return new Row({top:layoutData._containerHeight,left:layoutConfig.containerPadding.left,width:layoutConfig.containerWidth-layoutConfig.containerPadding.left-layoutConfig.containerPadding.right,spacing:layoutConfig.boxSpacing.horizontal,targetRowHeight:layoutConfig.targetRowHeight,targetRowHeightTolerance:layoutConfig.targetRowHeightTolerance,edgeCaseMinRowHeight:.5*layoutConfig.targetRowHeight,edgeCaseMaxRowHeight:2*layoutConfig.targetRowHeight,rightToLeft:false,isBreakoutRow:isBreakoutRow})}function addRow(row){layoutData._rows.push(row);layoutData._layoutItems=layoutData._layoutItems.concat(row.getItems());layoutData._containerHeight+=row.height+layoutConfig.boxSpacing.vertical;return row.items}},{"./row":1,merge:2}]},{},[]);


// ------ Tessaray Initialization ------
var Tessarray = function(boxClass, options) {
	// Set default values for options
	this.options = options || {};
	this.setOptionValue("containerClass", false);
	this.setOptionValue("selectorClass", false);
	this.setOptionValue("imageClass", false);
	this.setOptionValue("defaultCategory", false);
	this.setOptionValue("resize", true);
	this.setOptionValue("timingFunction", "ease-in");
	this.setOptionValue("duration", 375);
	this.setOptionValue("delay", 0);
	this.setOptionValue("containerTransition", {
		duration: 375,
		timingFunction: "ease-in",
		delay: 0
	});
	this.setOptionValue("flickr", {});

	// Instantiate variables to keep track of whether or not Tessarray needs to wait to load the image dimensions before rendering
	this.dimensionsLoaded = [];
	this.containerHasLoaded = false;
	// For each box, create an object that contains the data, and a reference to the node
	this.boxObjects = [];
	this.boxNodes = [];
	// If containerClass is given, scope boxes to containerClass
	var boxes;
	if (this.options.containerClass) {
		boxes = document.getElementsByClassName(this.options.containerClass)[0].getElementsByClassName(boxClass);
	} else {
		boxes = document.getElementsByClassName(boxClass);
	}
	var transition = "transform "+ this.options.duration +"ms "+ this.options.timingFunction + " " + this.options.delay +"ms, height "+ this.options.duration +"ms "+ this.options.timingFunction + " " + this.options.delay +"ms, left "+ this.options.duration +"ms "+ this.options.timingFunction + " " + this.options.delay +"ms, top "+ this.options.duration +"ms "+ this.options.timingFunction + " " + this.options.delay +"ms, width "+ this.options.duration +"ms "+ this.options.timingFunction + " " + this.options.delay +"ms";

  this.addTransition = function() {
    console.log("added transition");
    this.style.transition = transition;
    this.style["-webkit-transition"] = transition;
    this.removeEventListener('transitionend', arguments.callee);
  }

	for (var i = 0; i < boxes.length; i++) {
		this.boxNodes[i] = boxes[i];
    this.boxNodes[i].style.transition = "transform 0ms ease-in 0ms, height 0ms ease-in 0ms, left 0ms ease-in 0ms, top 0ms ease-in 0ms, width 0ms ease-in 0ms";
    this.boxNodes[i].style.position = "absolute";
    this.boxNodes[i].addEventListener('transitionend', this.addTransition)
    console.log(i, this.addTransition, this.boxNodes[i]);
    this.boxNodes[i].style["-webkit-transition"] = "transform 0ms ease-in 0ms, height 0ms ease-in 0ms, left 0ms ease-in 0ms, top 0ms ease-in 0ms, width 0ms ease-in 0ms";
		this.boxObjects[i] = new TessarrayBox(boxes[i], i, this);
	}

	// Check if user specified containerWidth
	this.specifiedContainerWidth = !!this.options.flickr.containerWidth;

	// If containerClass is given
	if (this.options.containerClass) {
		this.container = document.getElementsByClassName(this.options.containerClass)[0];
		this.container.style.opacity = "0"; 
		if (this.options.containerTransition) {
			var containerTransition = "opacity "+ this.options.containerTransition.duration +"ms "+ this.options.containerTransition.timingFunction + " " + this.options.containerTransition.delay + "ms";
			this.container.style.transition = containerTransition;
			this.container.style["-webkit-transition"] = containerTransition;
		}
		this.setContainerWidth();

		// Give container relative positioning if it has none
		if (this.container.style.position === "") {
			this.container.style.position = "relative";
		}
		
		// Check if user specified containerPadding, this is used to calculate container height
		if (this.options.flickr.containerPadding) {
			if (this.options.flickr.containerPadding.bottom) {
				this.containerPaddingBottom = this.options.flickr.containerPadding.bottom;
			} else {
				this.containerPaddingBottom = this.options.flickr.containerPadding;
			}
		} else {
			// Flickr default containerPaddingBottom
			this.containerPaddingBottom = 10;
		}

		// Resize container upon window size change if container size is modified
		if (this.options.resize) {
			window.addEventListener("resize", this.renderIfNecessary.bind(this))
		}
		this.containerLoad();
	}

	// If given selectorClass is given, bind selectors
	if (this.options.selectorClass) {
		this.selectors = document.getElementsByClassName(this.options.selectorClass);
		for (var i = 0; i < this.selectors.length; i++) {
			var category = this.selectors[i].getAttribute('data-category');
			this.selectors[i].addEventListener("click", this.sortByCategory.bind(this, category));
		}
	}
}


// ------ TessarrayBox Initialization ------
// Creates JavaScript Object that is representative of the htmlNode
var TessarrayBox = function(box, index, tessarray) {
	this.index = index;
	this.tessarray = tessarray;

	// Create TessarrayBox with an attribute of each class that returns the position value or null
	this.classes = {};
	var classes = box.getAttribute('class').split(" ");
	for (var i = 0; i < classes.length; i++) {
		this.classes[classes[i]] = box.dataset[classes[i]] || null;
	}

	// Set the image to be rendered in the box. If imageClass is given, use that class to find the element
	if (tessarray.options.imageClass) {
		this.image = box.getElementsByClassName(tessarray.options.imageClass)[0];
	} else {
		this.image = box.querySelector('img');
	}
	this.image.style.opacity = "0"; 
	this.image.style.transition = "opacity "+ tessarray.options.duration +"ms "+ "ease-in";

	tessarray.dimensionsLoaded[index] = false; 
	// If data attribute for aspect ratio is set or data attribute for height and width are set
	if (box.getAttribute('data-aspect-ratio') || (box.getAttribute('data-height') && box.getAttribute('data-width'))) {
		this.givenAspectRatio = true;
		this.setAspectRatio(tessarray, box, index);
	} else {
		// Else, get aspect ratio by loading the image source into Javascript
		this.givenAspectRatio = false;
		var source = this.image.getAttribute('src');
		var img = new Image();
		var thisBox = this;
		img.onload = function() {
			thisBox.aspectRatio = this.width / this.height;
			tessarray.confirmLoad(index);
		}
		img.src = source;
	}
}

 
// ------ Tessarray Functions ------
// This sets default values for options, checks against undefined rather than falsey
Tessarray.prototype.setOptionValue = function(key, defaultValue) {
	if (this.options[key] === undefined) {
		this.options[key] = defaultValue;
	}
}

// Update container width if it was not specified in flickr options
Tessarray.prototype.setContainerWidth = function() {
	if ((!this.specifiedContainerWidth) && (this.options.containerClass)) {
		this.options.flickr.containerWidth = this.container.clientWidth;
	}
}

TessarrayBox.prototype.setAspectRatio = function(tessarray, box, index) {
	if (box.getAttribute('data-aspect-ratio')) {
		this.aspectRatio = parseFloat(box.getAttribute('data-aspect-ratio'));
		tessarray.confirmLoad(index);
	} else if (box.getAttribute('data-height') && box.getAttribute('data-width')) {
		this.aspectRatio = parseFloat(box.getAttribute('data-height')) / parseFloat(box.getAttribute('data-width'));
		tessarray.confirmLoad(index);
	}	
	// var image = box.querySelector('img')
	// var thisBox = this;
	// image.addEventListener('load', function() {thisBox.image.style.opacity = "1";});
	var source = this.image.getAttribute('src');
	var img = new Image();
	var thisBox = this;
	img.onload = function() {
		thisBox.image.style.opacity = "";
		thisBox.image.style.transition = "";
	}
	img.src = source;
}

// Set index of dimensionsLoaded to be true. If every element in dimensionsLoaded is either
// true or undefined, then the intial render is called. 
Tessarray.prototype.confirmLoad = function(index) {
	this.dimensionsLoaded[index] = true;
	if ((this.deterimineIfBoxesLoaded()) && ((this.containerHasLoaded) || (!this.options.containerClass))) {
		this.initialRender();
	}
}

Tessarray.prototype.containerLoad = function() {
	this.containerHasLoaded = true;
	if (this.deterimineIfBoxesLoaded()) {
		this.initialRender();
	}
}

// Determines if every element that needs to load has loaded its dimensions
Tessarray.prototype.deterimineIfBoxesLoaded = function() {
	for (var i = 0; i < this.dimensionsLoaded.length; i++) {
		if (!this.dimensionsLoaded[i]) {
			return false;
		}
	}
	return true;
}

// Rerenders the boxes if the container width has not been specified and container width has changed since last render
Tessarray.prototype.renderIfNecessary = function() {
	if ((!this.specifiedContainerWidth) && (this.options.flickr.containerWidth !== this.container.clientWidth)) {
		this.renderBoxes();
	}
}

Tessarray.prototype.initialRender = function() {
	if (this.options.containerClass) {
		this.container.style.opacity = "1";
	}
	// If selectors are being used and there is a defaultCategory, render that category
	if (this.options.selectorClass && this.options.defaultCategory) {
		this.sortByCategory(this.options.defaultCategory);
	// Else, render every box
	} else {
		this.setSelectedBoxes(this.boxObjects);
		this.renderBoxes();
	}
}

// Filter boxes by class, and then sort them by data-attribute values for that class
// Update sortedBoxes attribute and re-render the boxes
Tessarray.prototype.sortByCategory = function(category) {
	if (category === "") {
		var sortedBoxes = this.boxObjects;
	} else {
		var filteredBoxes = this.boxObjects.filter(function(box) {
			return box.classes[category] !== undefined;
		});

		var sortedBoxes = filteredBoxes.sort(function(box) {
			return box.classes[category];
		});
	}

	this.setSelectedBoxes(sortedBoxes);
	this.renderBoxes();
}

// This function grabs the necessary information of the selectedBoxes (ratio and index),
// while maintaining the selectedBoxes attribute for readability
Tessarray.prototype.setSelectedBoxes = function(sortedBoxes) {
	this.selectedBoxes = sortedBoxes;
	this.indexes ? this.oldIndexes = this.indexes : this.oldIndexes = [];
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
  boxNode.style.transform = transformStyle.replace(/(scale\()(\d)(\))/, ("$1" + scale.toString() + "$3"));
}

// Render boxes
Tessarray.prototype.renderBoxes = function() {
	this.setContainerWidth();

	// Get coordinates from Flickr Justified Layout
	var layoutGeometry = require('justified-layout')(this.ratios, this.options.flickr);

	// Give container appropriate height for the images it contains.
	if (this.options.containerClass) {
    if (layoutGeometry.boxes.length > 0) {
      var height = layoutGeometry.boxes[layoutGeometry.boxes.length - 1].top + layoutGeometry.boxes[layoutGeometry.boxes.length - 1].height + this.containerPaddingBottom;
      this.container.style.height = height.toString() + "px";
    } else {
      this.container.style.height = "0px";
    }
	}

	// For each boxNode
	for (var i = 0; i < this.boxNodes.length; i++) {
		var boxNode = this.boxNodes[i];
		// If this box is to be rendered in the current filteration
		if (this.indexes.includes(i)) {
			// Grab the appropriate box information from Flickr Justified layout
			var box = layoutGeometry.boxes[this.indexes.indexOf(i)];
			// If node is not supposed to be displayed, hide it. This means that it was not filtered out, but is 
			// not being rendered due to Flickr options (such as showWidows: false)
			if (box === undefined) {
        this.scale(boxNode, 0);
			// Else apply the Flickr data to selected
			} else {
        // boxNode.addEventListener('transitionend', function() {console.log('transition ended')})
        boxNode.style.transform = "translate(" + box.left + "px, " + box.top + "px) scale(1)";
        // console.log(i, "boxNode transformed");
        boxNode.style.height = box.height + "px";
        boxNode.style.width = box.width + "px";
				// If the box does not define an aspect ratio, the image will have loaded by the time this is called
				// and is ready to be made visible. Otherwise opacity = 1 will wait until image has loaded.
				if (!this.boxObjects[i].givenAspectRatio) {
					this.boxObjects[i].image.style.opacity = "";
					this.boxObjects[i].image.style.transition = "transform 0ms ease-in 0ms, height 0ms ease-in 0ms, left 0ms ease-in 0ms, top 0ms ease-in 0ms, width 0ms ease-in 0ms";;
				}
			}
		// Else if not rendered in current filtration, but was rendered in a previous filtration, remove the 
		// boxNode from sight
		} else if (this.oldIndexes.includes(i)) {
      this.scale(boxNode, 0);
		// Else if not in current or previous filtration (when a default category is selected), reduce scale to 0
		} else {		
      this.scale(boxNode, 0);
		}
	}	
}