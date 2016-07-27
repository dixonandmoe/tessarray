document.write('<script src="justified-layout.js" type="text/javascript"></script>');

// Grid needs styling. Opacity and positioning

var JustifiedGrid = function(gridClass, itemClass, selectorClass) {
	this.grid = document.getElementsByClassName(gridClass)[0];

	this.selectors = document.getElementsByClassName(selectorClass);
	for (var i = 0; i < this.selectors.length; i++) {
		var category = this.selectors[i].getAttribute('data-category');
		this.selectors[i].addEventListener("click", this.sortByCategory.bind(this, category));
	}

	this.itemObjects = [];
	this.itemNodes = [];

	var items = document.getElementsByClassName(itemClass);
	for (var i = 0; i < items.length; i++) {
		this.itemNodes[i] = items[i];
		this.itemNodes[i].style.position = "absolute";
		this.itemObjects[i] = new GridItem(items[i], i);
	}
}

var GridItem = function(item, index) {
	this.index = index;

	// Create GridItem with an attribute of each class that returns the position value or null
	this.classes = {};
	var classes = item.getAttribute('class').split(" ");
	for (var i = 0; i < classes.length; i++) {
		this.classes[classes[i]] = item.getAttribute("data-" + classes[i]) || null;
	}

	// Grab given aspect ratio
	this.aspectRatio = item.getAttribute('data-aspect-ratio');

	// Get aspect ratio by find the image, loading it with JavaScript, and getting widtha and height
	// There is an issue with how slowly this loads. When sort is called immediately, ratios 
	// have not yet been rendered.
	// var source = item.querySelector('img').getAttribute('src');
	// var img = new Image();
	// var thisGridItem = this;	
	// img.onload = function() {
	// 	thisGridItem.aspectRatio = this.width / this.height;
	// }
	// img.src = source;
}

JustifiedGrid.prototype.sortByCategory = function(category) {
	var filteredItems = this.itemObjects.filter(function(item) {
		return item.classes[category] !== undefined;
	});

	var sortedItems = filteredItems.sort(function(item) {
		return item.classes[category];
	});

	var indexes = sortedItems.map(function(item) {
		return item.index;
	});

	var ratios = sortedItems.map(function(item) {
		return item.aspectRatio;
	});

	console.log(ratios);

	var layoutGeometry = require('justified-layout')(ratios, {containerWidth: 1060});

	// Display none to begin
	for (var i = 0; i < this.itemNodes.length; i++) {
		this.itemNodes[i].style.display = "none";
	}

	console.log(ratios);
	console.log(layoutGeometry);
	this.grid.style.height = layoutGeometry.containerHeight;

	for (var i = 0; i < layoutGeometry.boxes.length; i++) {
		var itemNode = this.itemNodes[indexes[i]];
		var box = layoutGeometry.boxes[i];
		itemNode.style.display = "";
		itemNode.style.height = box.height;
		itemNode.style.left = box.left;
		itemNode.style.top = box.top;
		itemNode.style.width = box.width;
	}
}