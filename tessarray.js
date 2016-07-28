document.write('<script src="justified-layout.js" type="text/javascript"></script>');

// Grid needs styling. Opacity and positioning

var Tessarray = function(boxClass, options) {
	// Set default values for options
	this.options = options || {};
	this.setOptionValue("containerClass", false);
	this.setOptionValue("selectorClass", false);
	this.setOptionValue("defaultCategory", false);
	this.setOptionValue("resize", true);
	this.setOptionValue("mountAnimationClass", false);
	this.setOptionValue("unmountAnimationClass", false);

	// For each box, create an object that contains the data, and a reference to the node
	this.boxObjects = [];
	this.boxNodes = [];
	var boxes = document.getElementsByClassName(boxClass);
	for (var i = 0; i < boxes.length; i++) {
		this.boxNodes[i] = boxes[i];
		this.boxNodes[i].style.position = "absolute";
		this.boxObjects[i] = new GridBox(boxes[i], i);
	}

	// If containerClass is given
	if (this.options.containerClass) {
		// Container class does nothing if resize or animations are not enabled
		if (this.options.resize || this.options.mountAnimationClass) {
			this.container = document.getElementsByClassName(this.options.containerClass)[0];
			this.containerWidth = this.container.clientWidth;
			this.container.style.position = "relative";
		}

		// Resize container upon window size change if container size is modified
		if (this.options.resize) {
			this.setSelectedBoxes([]);
			window.addEventListener("resize", this.renderIfNecessary.bind(this))
		}

		// Animate the mounting of boxes if 
		if (this.options.mountAnimationClass) {
			var mountAnimationClass = this.options.mountAnimationClass;
			this.container.addEventListener('webkitAnimationEnd', function(){
		  	this.classList.remove(mountAnimationClass);
			}, false);
		}
	}

	// If given selectorClass is given
	if (this.options.selectorClass) {
		this.selectors = document.getElementsByClassName(this.options.selectorClass);
		for (var i = 0; i < this.selectors.length; i++) {
			var category = this.selectors[i].getAttribute('data-category');
			this.selectors[i].addEventListener("click", this.sortByCategory.bind(this, category));
		}
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

Tessarray.prototype.setOptionValue = function(key, defaultValue) {
	if (this.options[key] === undefined) {
		this.options[key] = defaultValue;
	}
}

Tessarray.prototype.setSelectedBoxes = function(sortedBoxes) {
	this.selectedBoxes = sortedBoxes;

	this.indexes = this.selectedBoxes.map(function(box) {
		return box.index;
	});

	this.ratios = sortedBoxes.map(function(box) {
		return parseFloat(box.aspectRatio);
	});
}

var GridBox = function(box, index) {
	this.index = index;

	// Create GridBox with an attribute of each class that returns the position value or null
	this.classes = {};
	var classes = box.getAttribute('class').split(" ");
	for (var i = 0; i < classes.length; i++) {
		this.classes[classes[i]] = box.getAttribute("data-" + classes[i]) || null;
	}

	// Grab given aspect ratio
	if (box.getAttribute('data-aspect-ratio')) {
		this.aspectRatio = parseFloat(box.getAttribute('data-aspect-ratio'));
	} else if (box.getAttribute('data-height') && box.getAttribute('data-width')) {
		this.aspectRatio = parseFloat(box.getAttribute('data-height')) / parseFloat(box.getAttribute('data-width'));
	}
	// Else, get aspect ratio by find the image, loading it with JavaScript, and getting widtha and height
	// There is an issue with how slowly this loads. When sort is called immediately, ratios 
	// have not yet been rendered.
	// var source = box.querySelector('img').getAttribute('src');
	// var img = new Image();
	// var thisGridBox = this;	
	// img.onload = function() {
	// 	thisGridBox.aspectRatio = this.width / this.height;
	// }
	// img.src = source;
}

Tessarray.prototype.sortByCategory = function(category) {
	if (this.options.mountAnimationClass) {
		this.container.classList.add(this.options.mountAnimationClass);
	}

	var filteredBoxes = this.boxObjects.filter(function(box) {
		return box.classes[category] !== undefined;
	});

	var sortedBoxes = filteredBoxes.sort(function(box) {
		return box.classes[category];
	});

	this.setSelectedBoxes(sortedBoxes);
	this.renderBoxes();
}

Tessarray.prototype.renderIfNecessary = function() {
	if (this.containerWidth !== this.container.clientWidth) {
		this.renderBoxes();
	}
}

Tessarray.prototype.renderBoxes = function() {
	if (this.options.containerClass) {
		this.containerWidth = this.container.clientWidth;
	}

	var layoutGeometry = require('justified-layout')(this.ratios, {containerWidth: this.containerWidth || 1060});
	console.log(layoutGeometry);

	// Display none to begin
	for (var i = 0; i < this.boxNodes.length; i++) {
		this.boxNodes[i].style.display = "none";
	}

	// this.container.style.height = layoutGeometry.containerHeight;

	for (var i = 0; i < layoutGeometry.boxes.length; i++) {
		var boxNode = this.boxNodes[this.indexes[i]];
		var box = layoutGeometry.boxes[i];
		boxNode.style.display = "";
		boxNode.style.height = box.height;
		boxNode.style.left = box.left;
		boxNode.style.top = box.top;
		boxNode.style.width = box.width;
	}
}