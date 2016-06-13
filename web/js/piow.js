/**
 * 
 * @param that
 */
function showImage(that) {


	// create the overlay frame
	var frame = $("<div/>").attr('id', 'imgFrame');
	
	// get and set top position of the frame
	var top  = window.pageYOffset || document.documentElement.scrollTop;
	frame.css('top', top);
	
	var img = _getImage();
	
	// put image in frame and append to body
	frame.html(img).appendTo($('body'));
	
	// create the navigation frame
	var navFrame = $("<div/>").attr('id', 'navFrame');

	// add navigation links
	var nextLink = $("<a/>").attr( 'href', '#' ).addClass("next");
	var prevLink = $("<a/>").attr( 'href', '#' ).addClass("prev");

	navFrame.append(nextLink);
	navFrame.append(prevLink);

	var close = $("<div/>").attr( 'id', 'close' ).html("<i class='icon-cancel'></i>");

//	close.css('top', top);
	navFrame.css('top', top);

	navFrame.append(close);
	
	
	$('body').append(navFrame);
	
	img.src= $(that).attr('href');
	
}


/**
 * 
 * @param direction (prev/next)
 */
function navigateImage(direction) {

	// get current image
	var old =  $(".current");

	var currentLink = undefined;
	
	if ( direction == 'prev' ) {

		currentLink = old.parent().prev("div").find("a");
	}
	else if ( direction == 'next' ) {
		currentLink = old.parent().next("div").find("a");
	}

	
	var currentImage = currentLink.attr("href");

	if ( typeof currentImage == 'undefined' && direction == 'prev' ) {
		return;
	}
	
	if ( typeof currentImage == 'undefined' && direction == 'next' ) {
		return 1;
	}

	old.removeClass();
	
	$(currentLink).addClass("current");

	$("#imgFrame img").remove();

	console.log( 'getting image' );
	var img = _getImage();

	img.src = currentImage;
	
	console.log(currentImage);
	
	$("#imgFrame").append(img);
}


/**
 * 
 * @returns {___anonymous994_996}
 */
 function _getImage(path) {


	// createa new image
	var img = new Image();

	// apply base class
	$(img).addClass('fullPic');


	// when image is loaded ...
    img.onload = function() {
    	console.log('image loaded');
		var screenRatio = getScreenRatio();
		var imageRatio = getImageRatio(img);

    	if ( getScreenOrientation() == 'l' && screenRatio > imageRatio ) {

    		// get image orientation


        	// get image width for left margin
        	var imgWidth = getHeight() / img.height * img.width;
        	
        	// get left margin
        	var leftPos = (getWidth() - imgWidth) / 2;

        	// apply left margin
        	$(img).css( 'left', leftPos );
    	}
    	else {

        	// get image height for top margin
        	var imgHeight = getWidth() / img.width * img.height;
        	
        	// get left margin
        	var topPos = (getHeight() - imgHeight) / 2;

        	// apply left margin
        	$(img).css( 'top', topPos );
    	}

		var anim = {opacity: 1};
		$(img).animate( anim, 1000 );
    }

    return img;
}


/**
 * 
 * @returns {Array}
 */
function getPicsPerScreen() {

	// get screen size
	var width = $(window).width();
	var height = $(window).height();

	// get grid infos
	[ picsPerRow, picsPerCol, previewWidth, previewHeight ] = getGridInfos(width,height);

	// if we need a scrollbar
	if ( picsPerCol * previewHeight > height ) {

		var scrollWidth = getScrollWidth();

		width -= scrollWidth;

		[ picsPerRow, picsPerCol, previewWidth, previewHeight ] = getGridInfos(width,height);
	}
	
	// get # pics per screen
	var numPics = picsPerCol * picsPerRow;
	
	var gridHeight = picsPerCol * previewHeight;
	
	return [ numPics, previewWidth, gridHeight ];
}


/**
 * 
 * @param page
 * @param numPics
 * @param previewWidth
 * @param done
 * @returns {Number}
 */
function loadPics(page, numPics, previewWidth, done) {

	url = '/' + page + '/' + numPics;

	$.ajax({
		url : url,
		type : "get",
		async : false,
		cache : false,
		success : function(data) {

			if (data.length < numPics) {
				done = 1;
			}

			var time = 100;

			$.each(data, function(k, v) {

				setTimeout(function() {

				    var previewPath = '/images/' + v;

				    var img = new Image();

				    // create link to image
					var link = $('<a />');
				    var imgName = v.replace("prev-", "");
					link.attr("href", "/images/" + imgName);

					// put image in link
					$(link).html(img);
					
				    img.onload = function() {

				    	// detect image orientation
				    	if ( img.width < img.height ) {
				    		
				    		// keep original pic height for top padding calculation
				    		var picHeight = img.height;
				    		
				    		// add wrapper
				    		var wrapper = $("<div/>");
				    		wrapper.addClass('previewWrapper');
				    		wrapper.css('height', Math.ceil(previewWidth * 0.75)).css('width', previewWidth);
				    		
				    		// get top padding
				    		var topPadding = - Math.ceil((picHeight - ( previewWidth * 0.75 )) / 2);
				    		
				    		$(img).css('position', 'relative').css('top', topPadding ).css('width', previewWidth);
				    		
				    		wrapper.append(link);
				    		$('#frame').append(wrapper);
				    	}
				    	else {
				    		
				    		// add wrapper
				    		var wrapper = $("<div/>");

				    		$(img).css('width', previewWidth).css('height', Math.ceil(previewWidth * 0.75));
				    		wrapper.append(link);
				    		$('#frame').append(wrapper);
				    	}
				    };
				    
				    $(img).addClass('preview');
				    
				    img.src = previewPath;
				    
				}, time += 50)
			});
		},
		error : function() {
			$("#frame").html('There is error while submit');
		}
	});
	return done;
}


/**
 * 
 * @returns {Number}
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
 * 
 * @param width
 * @param height
 * @returns {Array}
 */
function getGridInfos(width, height) {

	var previewWidth = 150;
	var imageRatio = 0.75;

	// get # pics per row
	var picsPerRow = Math.ceil(width / previewWidth);

	// get preview width
	previewWidth = parseInt(width / picsPerRow);

	// get preview height
	var previewHeight = Math.ceil(previewWidth * imageRatio);

	// get # pics per row
	var picsPerCol = parseInt(height / previewHeight) + 1;

	return [ picsPerRow, picsPerCol, previewWidth, previewHeight ];
}


/**
 * 
 * @returns {String}
 */
function getScreenOrientation() {

  if ( getWidth() > getHeight() ) {
    return 'l';
  }
  return 'p';
}


/**
 * 
 * @returns {Number}
 */
function getScreenRatio() {
	return getWidth() / getHeight();
}


/**
 * 
 * @param item
 * @returns {String}
 */
function getImageOrientation(item) {

	if ( item.width > item.height ) {
		return 'l';
	}
	return 'p';
}


/**
 * 
 * @param item
 * @returns {Number}
 */
function getImageRatio(item) {
	return item.width / item.height;
}


/**
 * 
 * @returns
 */
function getWidth() {
 return $(window).width();
}


/**
 * 
 * @returns
 */
function getHeight() {
  return $(window).height();
}


// eof
