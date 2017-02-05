/*jshint esversion: 6 */

/**
 * show an image when a preview is clicked
 *
 * @param       imagePath
 */
function showImage(imagePath) {

    /*
     * Create and position overlay frame
     */
	// -- create the frame
	var frame = $("<div/>").attr('id', 'imgFrame');

	// -- get and set top position of the frame
	var top  = window.pageYOffset || document.documentElement.scrollTop;
	frame.css('top', top);


    /*
     * Get image and display
     */
    // -- get styled image object
	var img = _getImage();

    // -- load image
	img.src = imagePath;

	// -- put image in frame and append to body
	frame.html(img).appendTo($('body'));

    var loader = $("<div>", {'class': 'loader'});

    loader.appendTo($('body'));

    /*
     * Create navigation frame
     */
	// -- create the navigation frame
	var navFrame = $("<div/>").attr('id', 'navFrame');

    // -- set position
    navFrame.css('top', top);

	// -- create and add navigation links
	var nextLink = $("<a/>").attr( 'href', '#' ).addClass("next");
	var prevLink = $("<a/>").attr( 'href', '#' ).addClass("prev");

	navFrame.append(nextLink);
	navFrame.append(prevLink);

    // -- create close button
	var close = $("<div/>").attr( 'id', 'close' ).html("<i class='icon-cancel'></i>");

    // -- add close button
	navFrame.append(close);

    // -- append to body
	$('body').append(navFrame);

    // animate close button
	animateButtonLoad($("#close"));
}


/**
 * show next or previous image
 *
 * @param       direction (prev/next)
 */
function navigateImage(direction) {

	// -- get old image link
	var oldLink =  $(".current");

    // -- get link to next or previous image
	var currentLink;

	if ( direction == 'prev' ) {
		currentLink = oldLink.parent().prev("div").find("a");
	}
	else if ( direction == 'next' ) {
		currentLink = oldLink.parent().next("div").find("a");
	}

    // -- get href of the link
	var currentImage = currentLink.attr("href");

	if ( typeof currentImage == 'undefined' ) {
		return;
	}

    // -- remove class current from old
	oldLink.removeClass();

    // -- add class current to current
	$(currentLink).addClass("current");


    $("#imgFrame img").animate({
        opacity: 0,
    }, 1000, function() {
        // Animation complete.
        $("#imgFrame img").remove();
        $("#imgFrame").append(img);
    });



    // -- remove old image
	// $("#imgFrame img").remove();

    // -- get styled image object
	var img = _getImage();

    // -- load image
	img.src = currentImage;

    // append to frame
	// $("#imgFrame").append(img);
}


/**
 * create and style and image object
 *
 * @returns     {Object}    image object
 */
function _getImage() {

	// -- createa new image
	var img = new Image();

	// -- apply base class
	$(img).addClass('fullPic');

	// -- when image is loaded ...
    img.onload = function() {

        // -- get screen and image ratio
		var screenRatio = getScreenWidth() / getScreenHeight();
		var imageRatio = img.width / img.height;

        // -- get left or top margin based on image and screen orientation
    	if ( getScreenOrientation() == 'l' && screenRatio > imageRatio ) {

        	// -- get image width for left margin
        	var imgWidth = getScreenHeight() / img.height * img.width;

        	// -- get left margin
        	var leftPos = (getScreenWidth() - imgWidth) / 2;

        	// -- apply left margin
        	$(img).css( 'left', leftPos );
    	}
    	else {

        	// -- get image height for top margin
        	var imgHeight = getScreenWidth() / img.width * img.height;

        	// -- get left margin
        	var topPos = (getScreenHeight() - imgHeight) / 2;

        	// -- apply left margin
        	$(img).css( 'top', topPos );
    	}

        // -- set and define image animation
		var anim = {opacity: 1};
		$(img).delay(1000).animate( anim, 1000);
	};

    return img;
}


/**
 *
 * @returns     {Array}     {numPics, previewWidth, gridHeight}
 */
function getPicsInfos(reload) {

	reload = reload || 0;

	// -- get screen size
	var width = $("#frame").width();
	var height = $(window).height();

	// -- get grid infos
	[ picsPerRow, picsPerCol, previewWidth, previewHeight ] = _getGridInfos(width,height);

	// -- adapt width if we need a scrollbar
	if ( picsPerCol * previewHeight > height ) {

		var scrollWidth = getScrollWidth();

		if ( ! reload ) {
			width -= scrollWidth;
		}

        // get grid infos
		[ picsPerRow, picsPerCol, previewWidth, previewHeight ] = _getGridInfos(width,height);
	}

	// -- get # pics per screen and grid height
	var numPics = picsPerCol * picsPerRow;

	var gridHeight = picsPerCol * previewHeight;

    // -- return array
	return [ numPics, previewWidth, gridHeight ];
}


/**
 * load on page of preview images
 *
 * @param       page
 * @param       numPics
 * @param       previewWidth
 * @param       done
 * @returns     {Boolean}   done
 */
function loadPics(page, numPics, previewWidth, done) {

    // -- create url
	url = '/' + page + '/' + numPics;

    // -- call url
	$.ajax({
		url : url,
		type : "get",
		async : false,
		cache : false,
		success : function(data) {

            // -- If no image show message
            if ( page == 1 && data.length == 0) {

                error = $('<div>', {class: 'error', text: "No image in images folder"})

                $("#frame").html(error);

                return false;
            }

            // -- check if there are more pics
			if (data.length < numPics) {
				done = 1;
			}

            // -- default timeout
			var time = 100;

            // -- loop images
			$.each(data, function(k, v) {

				setTimeout(function() {

                    // -- create preview path
				    var previewPath = '/images/' + v;

                    // -- create image object
				    var img = new Image();

				    // create link to image
					var link = $('<a />');
				    var imgName = v.replace("prev-", "");
					link.attr("href", "/images/" + imgName);

					// -- put image in link
					$(link).html(img);

				    img.onload = function() {

				    	// -- detect image orientation
				    	if ( img.width < img.height ) {

				    		// -- keep original pic height for top padding calculation
				    		var picHeight = img.height;

				    		// -- create and style wrapper
				    		var wrapper = $("<div/>");
				    		wrapper.addClass('previewWrapper');
				    		wrapper.css('height', Math.ceil(previewWidth * 0.75)).css('width', previewWidth);

				    		// -- get preview top padding
				    		var topPadding = - Math.ceil( (( previewWidth / 0.75 ) - (picHeight * 0.75) ) / 2);

                            // -- set preview css
				    		$(img).css('position', 'relative').css('top', topPadding ).css('width', previewWidth);
				    	}
				    	else {

				    		// create wrapper
				    		var wrapper = $("<div/>");

				    		$(img).css('width', previewWidth).css('height', Math.ceil(previewWidth * 0.75));
				    	}

                        // -- add link to wrapper
                        wrapper.append(link);

                        // -- add wrapper to frame
                        $('#frame').append(wrapper);
				    };

                    // -- add css
				    $(img).addClass('preview');

                    // -- load image
				    img.src = previewPath;

				}, time += 50);
			});
		},
		error : function() {
			$("#frame").html('There is error while submit');
		}
	});

	return done;
}


/**
 * get scrollbar width
 *
 * @returns     {Number}    scrollbarWidth
 */
function getScrollWidth() {

	// Create the measurement node
	var scrollDiv = document.createElement("div");
	scrollDiv.className = "scrollbar-measure";
	document.body.appendChild(scrollDiv);

	// Get the scrollbar width
	var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

	// Delete the DIV
	document.body.removeChild(scrollDiv);

	return scrollbarWidth;

}


/**
 * get grid infos
 *
 * @param       width
 * @param       height
 * @returns     {Array}     picsPerRow, picsPerCol, previewWidth, previewHeight
 */
function _getGridInfos(width, height) {

	var previewWidth = 150;
	var imageRatio = 0.75;

	// get # pics per row
	var picsPerRow = Math.floor(width / previewWidth);

	// get preview width
	previewWidth = parseInt(width / picsPerRow);

	// get preview height
	var previewHeight = Math.floor(previewWidth * imageRatio);

	// get # pics per row
	var picsPerCol = parseInt(height / previewHeight) + 1;

	return [ picsPerRow, picsPerCol, previewWidth, previewHeight ];
}


/**
 * get screen orientation
 *
 * @returns     {String}    l(andscape)|p(ortrait)
 */
function getScreenOrientation() {

  if ( getScreenWidth() > getScreenHeight() ) {
    return 'l';
  }
  return 'p';
}


/**
 * get image orientation
 *
 * @param       image
 * @returns     {String}    l(andscape)|p(ortrait)
 */
function getImageOrientation(image) {

	if ( image.width > image.height ) {
		return 'l';
	}
	return 'p';
}


/**
 * get screen width
 *
 * @returns     {Interger}
 */
function getScreenWidth() {
    return $(window).width();
}


/**
* get screen height
*
* @returns     {Interger}
 */
function getScreenHeight() {
    return $(window).height();
}


/**
 * animate help button hover
 *
 * @param       button
 */
function animateButtonLoad(button) {

	var anim = {opacity: 1};
	var anim2 = {opacity: 0.3};

	button.animate( anim, 500 ).delay(1000).animate( anim2, 1000 );

	setTimeout(function() {
		button.css("background-color", "red");
	}, 1300);

	setTimeout(function() {
		button.css("background-color", "#666");
	}, 2500);
}


/**
 * add help button hover handler
 */
function addHelpHoverHandler() {

    $(document).on("mouseenter","#help",function(e) {
    	$(this).animate( {opacity: 1} , 500 );
    });

    $(document).on("mouseleave","#help",function(e) {
    	$(this).delay(1000).animate( {opacity: 0.3} , 500 );
    });
}


/**
 * -- Prevent scrolling -------------------------------------------------------
 */

/**
 * left: 37, up: 38, right: 39, down: 40,
 * spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
 */
var keys = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1};

function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault)
		e.preventDefault();
	e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
	if (keys[e.keyCode]) {
		preventDefault(e);
		return false;
	}
}

function disableScroll() {
	if (window.addEventListener) // older FF
		window.addEventListener('DOMMouseScroll', preventDefault, false);
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	window.ontouchmove  = preventDefault; // mobile
	document.onkeydown  = preventDefaultForScrollKeys;

	unloadScrollBars();
}

function enableScroll() {

	if (window.removeEventListener)
		window.removeEventListener('DOMMouseScroll', preventDefault, false);
	window.onmousewheel = document.onmousewheel = null;
	window.onwheel = null;
	window.ontouchmove = null;
	document.onkeydown = null;

	reloadScrollBars();
}

function reloadScrollBars() {
    document.documentElement.style.overflow = 'auto';  // firefox, chrome
    document.body.scroll = "yes"; // ie only
}

function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}


// eof
