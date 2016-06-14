#piow

a simple one page web gallery built on [Silex](http://silex.sensiolabs.org/) and [Jquery](https://jquery.com/).

##images

- there's no image processing (resize, preview creation), there are enough tools for that.
- recommended image size 2400x1800px
- recommended preview size 150x90px
- previews must be named : prev-&lt;original_file_name&gt;
- upload all images in the images folder

##configuration

if installed in a sub-domain you may need to change
 
```javascript
    $imagesDir = '/images/';
```
to something like

```javascript
    $imagesDir = '/<subdomain>/<optionnal folder>/images/'
```


##usage

- view image : click on a preview
- view next image : click on right side of image or keyboard 'arrow right'
- view previous image : click on left side of image or keyboard 'arrow left'
- close image : clicl on top right cross or keyboard 'x'

 