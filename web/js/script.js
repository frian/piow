$(function() {

	var done = 0; // flag : 1 if all images are loaded
	var page = 1; // page number

	var numPics, previewWidth, gridHeight;

	[ numPics, previewWidth, gridHeight ] = getPicsPerScreen();

	$('#frame').css('height', gridHeight);
	
	done = loadPics(page, numPics, previewWidth, done);
	
	page++;


	// click on preview
    $(document).on("click","a",function(e) {
    	
    	e.preventDefault();
    	showImage(this);
    });
	
    
    // close picture frame
    $(document).on("click","#imgFrame",function(e) {
    	this.remove();
    });
    
    

    // scroll event
	window.onscroll = function(ev) {
		if ($(window).scrollTop() + $(window).height() == $(document).height()) {
			
			if (typeof flag != 'undefined' && flag) return;

			flag = true;

			if (!done) {

				console.log('fired');
				
				var height = $('#frame').height() + gridHeight;

				$('#frame').css('height', height);

				setTimeout(function() {
					window.scrollBy(0, gridHeight - 150);
				}, 100);

				setTimeout(function() {
					done = loadPics(page, numPics, previewWidth, done);
					page++;
				}, 200);
				
			}
			
			setTimeout(function() {
				flag = undefined;
			}, 700);
		}
	};


	// resize function
	$(window).resize(function() {

		  if (window.RT) {
			  clearTimeout(window.RT);
		  }

		  window.RT = setTimeout(function()  {
		    this.location.reload(false); /* false to get page from cache */
		  }, 10);
	});

});



function showImage(that) {


	// create the overlay frame
	var frame = $("<div/>").attr('id', 'imgFrame');
	
	// get and set top position of the frame
	var top  = window.pageYOffset || document.documentElement.scrollTop;
	frame.css('top', top);

	// createa new image
	var img = new Image();

	// apply base class
	$(img).addClass('fullPic');


	// when image is loaded ...
    img.onload = function() {

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
    	
    }

    // set image source
	img.src= $(that).attr('href');
	
	// put image in frame and append to body
	frame.html(img).appendTo($('body'));
	
	var anim = {opacity: 1};
	$(img).animate( anim, 1000 );

}




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


// load previews
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
				    		$(img).css('width', previewWidth).css('height', Math.ceil(previewWidth * 0.75));
				    		$('#frame').append(link);
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

function getScreenOrientation() {

  if ( getWidth() > getHeight() ) {
    return 'l';
  }
  return 'p';
}


function getScreenRatio() {
	return getWidth() / getHeight();
}

function getImageOrientation(item) {

	if ( item.width > item.height ) {
		return 'l';
	}
	return 'p';
}

function getImageRatio(item) {
	return item.width / item.height;
}



function getWidth() {
 return $(window).width();
}


function getHeight() {
  return $(window).height();
}

// eof
