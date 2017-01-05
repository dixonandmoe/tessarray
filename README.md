# Tessarray

Easy application of Flickr's Justified Layout with optional sorting and filtering.

## Install
### Download
+ JavaScript:
  - [flickity.pkgd.min.js](https://unpkg.com/flickity@2.0/dist/flickity.pkgd.min.js) minified, or
  - [flickity.pkgd.js](https://unpkg.com/flickity@2.0/dist/flickity.pkgd.js) un-minified

### CDN
Link directly to Flickity files on [unpkg](https://unpkg.com).

``` html
<script src="https://unpkg.com/flickity@2.0/dist/flickity.pkgd.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/flickity@2.0/dist/flickity.pkgd.js"></script>
```

### Package managers
Bower: `bower install flickity --save`
npm: `npm install flickity --save`

## Usage

Tessarray works with container and a set of boxes that contain images.

```html
<div class="container">
  <div class="box">
    <img style="height: 100%; width: 100%;" src="#" />
  </div>
  <div class="box">
    <img style="height: 100%; width: 100%;" src="#" />
  </div>
</div>
```

### Options

``` js
var tessarray = new Tessarray( 'box', {
  // Options, defaults listed

  containerClass: false,
  // Add container class to allow features such as resizing upon window resize,
  // container transitions, and explicit height setting.

  selectorClass: false,
  // Add selectorClass if you want to be able to sort and filter the boxes.
  // Each of the selectors should have the class of selectorClass, and a 
  // data-category value equal to the value they filter on.
  // If a box is supposed to show in a certain filter, give the box the class
  // of the data-category value on the corresponding selector.
  // If a box is supposed to render in a certain position, assign that position
  // with a data attribute of the filter class, and give it a numerical value.

  imageClass: false,
  // Specifies what element is the image is within the box.
  // By default, Tessarray searches for an <img> tag in each box.
  // If you have multiple <img> tags in a box or you are not using <img> tags,
  // give the image the class of your assigned imageClass instead.

  defaultCategory: false,
  // Filters by given category on initial render

  resize: true,
  // Allows the resizing of the window to trigger a re-rendering of the boxes 
  // if containerClass is given and the container is not statically sized

  timingFunction: 'ease-in',
  duration: 375,
  delay: 0,
  // Options for box transitions. This transition data is used when boxes are
  // faded in (upon load), resized, moved, and scaled in and out.

  containerTransition: {
    duration: 375,
    timingFunction: 'ease-in',
    delay: 0
  },
  // Options for container transition. Used once initial dimensions for 
  // each box are loaded. 

  flickr: {}
  // pass in flickr justified layout options
});
```
A complete list of Flickr's Justified Layout options can be found [here.](http://flickr.github.io/justified-layout)

## License
Open Source Licensed under the MIT license.

---
By [Dixon and Moe](https://dixonandmoe.com)