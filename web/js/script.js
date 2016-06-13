$(function() {

	var done = 0; // flag : 1 if all images are loaded
	var page = 1; // page number

	var numPics, previewWidth, gridHeight;

	[ numPics, previewWidth, gridHeight ] = getPicsPerScreen();

	$('#frame').css('height', gridHeight);
	
	done = loadPics(page, numPics, previewWidth, done);
	
	page++;


	// click on preview
    $(document).on("click","a:not( .next, .prev )",function(e) {
    	
    	e.preventDefault();
    	$(this).addClass('current'); // empty class used to find next and previous image
    	showImage(this);
    });
	
    
    // close picture frame
    $(document).on("click","#imgFrame",function(e) {
    	this.remove();
    });
    
    
    // show previous image
    $(document).on("click",".prev",function(e) {
    	e.preventDefault();
    	navigateImage('prev');
    });

    
    // show next image
    $(document).on("click",".next",function(e) {
    	e.preventDefault();
    	navigateImage('next');
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
