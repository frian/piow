#piow

![Silex](https://frian.github.io/img/piow.png)

a simple one page web gallery built on [Silex](http://silex.sensiolabs.org/) and [Jquery](https://jquery.com/).

##images

- there's no image processing (resize, preview creation), there are enough tools for that.
- recommended image size 2400x1800p
- recommended preview size 150x113px
- previews must be named : prev-&lt;original_file_name&gt;
- upload all images in the images folder

##configuration

if installed in a sub-domain you may need to edit config/piow.php

```php
    $imagesDir = '/images/';
```
to something like

```php
    $imagesDir = '/<subdomain>/<optionnal folder>/images/'
```


##usage

- view image : click on a preview
- view next image : click on right side of image or keyboard 'arrow right'
- view previous image : click on left side of image or keyboard 'arrow left'
- close image : click on top right cross or keyboard 'x' or keyboard 'ESC'
