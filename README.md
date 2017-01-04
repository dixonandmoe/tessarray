# Tessarray

Easy application of Flickr's Justified Layout with optional sorting and filtering.

## Install
### Download
+ CSS:
  - [flickity.min.css](https://unpkg.com/flickity@2.0/dist/flickity.min.css) minified, or
  - [flickity.css](https://unpkg.com/flickity@2.0/dist/flickity.css) un-minified
+ JavaScript:
  - [flickity.pkgd.min.js](https://unpkg.com/flickity@2.0/dist/flickity.pkgd.min.js) minified, or
  - [flickity.pkgd.js](https://unpkg.com/flickity@2.0/dist/flickity.pkgd.js) un-minified

### CDN
Link directly to Flickity files on [unpkg](https://unpkg.com).

``` html
<link rel="stylesheet" href="https://unpkg.com/flickity@2.0/dist/flickity.min.css">
<!-- or -->
<link rel="stylesheet" href="https://unpkg.com/flickity@2.0/dist/flickity.css">
```

``` html
<script src="https://unpkg.com/flickity@2.0/dist/flickity.pkgd.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/flickity@2.0/dist/flickity.pkgd.js"></script>
```

### Package managers
Bower: `bower install flickity --save`
npm: `npm install flickity --save`

## Usage

Flickity works with a container element and a set of child cell elements

```html
<div class="box">
  <img class="image" style="height: 100%; width: 100%;" src="#" />
</div>
<div class="box">
  <img class="image" style="height: 100%; width: 100%;" src="#" />
</div>
```

### Options

``` js
var tessarray = new Tessarray( 'box', {
  // options, defaults listed

  autoPlay: false,
  // advances to the next cell
  // if true, default is 3 seconds

});
```

## License
Open Source Licensed under the MIT license.

---
By [Dixon and Moe](https://dixonandmoe.com)

<!-- http://dillinger.io/ -->