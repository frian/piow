$(function() {

	var done = 0; // flag : 1 if all images are loaded
	var page = 1; // page number

	var numPics, previewWidth, gridHeight;

	// get infos on previews grid
	[ numPics, previewWidth, gridHeight ] = getPicsPerScreen();

	// set frame height
	$('#frame').css('height', gridHeight);
	
	// load previews
	done = loadPics(page, numPics, previewWidth, done);
	
	// increment page number
	page++;
	
	var helpButton = $("<div/>").attr( 'id', 'help' ).html("<i class='icon-help'></i>");

	$('#frame').append(helpButton);


    /**
     * trigger : click on help
     * 
     * result : close image frame
     */
    $(document).on("click","#help",function(e) {

    	alert("catched");
    });


	/**
	 * trigger : click on a preview
	 * 
	 * result : show image
	 */
    $(document).on("click","a:not( .next, .prev )",function(e) {
    	
    	e.preventDefault();
    	$("#action").remove();
    	$(this).addClass('current'); // empty class used to find next and previous image
    	showImage(this);
    	disableScroll();
    });
	
    
    /**
     * trigger : click on close image
     * 
     * result : close image frame
     */
    $(document).on("click","#close",function(e) {

    	$("#imgFrame").remove();
    	$("#navFrame").remove();
    	enableScroll();
    });
    
    
    /**
     * trigger : click on prev link
     * 
     * keyboard : left arrow
     * 
     * result : show previous image
     */
    $(document).on("click",".prev",function(e) {
    	e.preventDefault();
    	navigateImage('prev');
    });


    /**
     * trigger : click on next link
     * 
     * keyboard : right arrow
     * 
     * result : show next image
     */
    // show next image
    $(document).on("click",".next",function(e) {
    	e.preventDefault();
    	temp = navigateImage('next');

    	 _reloadInNav(temp);
    });


    /**
     * trigger : scroll
     * 
     * result : load more previews
     */
    $(window).scroll(function(ev) {

    	// check of we reached bottom
		if ($(window).scrollTop() + $(window).height() == $(document).height()) {
			
			// return if we have a lock
			if (typeof lock != 'undefined' && lock) return;

			// set lock
			lock = true;

			// if we have still previews to load
			if (!done) {

				// set frame height
				var height = $('#frame').height() + gridHeight;
				$('#frame').css('height', height);

				// scroll
				setTimeout(function() {
					window.scrollBy(0, gridHeight - 150);
				}, 100);

				// load pics
				setTimeout(function() {
					done = loadPics(page, numPics, previewWidth, done);
					page++;
				}, 200);
				
			}
			
			// remove lock
			setTimeout(function() {
				lock = undefined;
			}, 700);
		}
	});


	/**
	 * trigger : resize
	 * 
	 * result : reload page
	 */
	$(window).resize(function() {

		if (window.RT) {
			clearTimeout(window.RT);
		}

		window.RT = setTimeout(function()  {
		    this.location.reload(false); /* false to get page from cache */
		}, 10);
	});


	/**
	 * keyboard shortcuts
	 * 
	 *   right arrow : show next image (39)
	 *   left arrow : show previous image (37)
	 *   x : close image frame (88)
	 */
	$(document).keydown( function(e) {
		console.log(e.which);
		if (e.which == 39) {
	    	temp = navigateImage('next');
	    	 _reloadInNav(temp);
		} else if (e.which == 37) {
			
			navigateImage('prev');
		}
		else if (e.which == 88) {
	    	$("#imgFrame").remove();
	    	$("#navFrame").remove();
	    	enableScroll();
		}
	});


	function _reloadInNav(temp) {

    	if (temp == 1) {
    		
    		if ( ! done ) {
    			done = loadPics(page, numPics, previewWidth, done);
    			page++;
    			
    			setTimeout(function() {
    				navigateImage('next');
    			}, 500);
    		}
    	}
	}
});


// eof
