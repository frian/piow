$(function() {

	var done = 0; // flag : 1 if all images are loaded
	var page = 1; // page number

	var numPics, previewWidth, gridHeight;

	[ numPics, previewWidth, gridHeight ] = getPicsPerScreen();

	$('#frame').css('height', gridHeight);
	
	done = loadPics(page, numPics, previewWidth, done);
	
	page++;


	/**
	 * trigger : click on a preview
	 * 
	 * result : show image
	 */
    $(document).on("click","a:not( .next, .prev )",function(e) {
    	
    	e.preventDefault();
    	$(this).addClass('current'); // empty class used to find next and previous image
    	showImage(this);
    	
    	console.log("fired 2");
    });
	
    
    /**
     * trigger : click on close image
     * 
     * result : close image frame
     */
    $(document).on("click","#close",function(e) {

    	$("#imgFrame").remove();
    	$("#navFrame").remove();
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
    	navigateImage('next');
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


	// -- keyboard shortcuts
	// ----------------------------------------------------
	// right arrow : show next image 39
	// left arrow : show previous image 37
	$(document).keydown(
			function(e) {
				console.log(e.which);
				if (e.which == 39) {
					navigateImage('next');
				} else if (e.which == 37) {
					navigateImage('prev');
				}
			});
});


// eof
