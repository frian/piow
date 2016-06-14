$(function() {

	var done = 0; // flag : 1 if all images are loaded
	var page = 1; // page number
	var helpOn = 0; // flag

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

	animateButtonLoad($("#help"));

	addHelpEventHandler();


    /**
     * trigger : hover over close
     * 
     * result : show close button
     */
    $(document).on("mouseenter","#close",function(e) {
    	$(this).animate( {opacity: 1} , 500 );
    });
    
    $(document).on("mouseleave","#close",function(e) {
    	$(this).delay(1000).animate( {opacity: .3} , 500 );
    	
    });

    
    /**
     * trigger : click on help
     * 
     * result : show help
     */
    $(document).on("click","#help",function(e) {

    	$("#help").css("opacity", .3);
    	
    	console.log("disabling events");
    	$(document).off("mouseenter","#help");
    	$(document).off("mouseleave","#help")
    	console.log("done");
    	
    	helpOn = 1;
    	
		$.ajax({
			url : '/help',
			type : "get",
			success : function(data) {
				$("body").append(data);

				
			},
		});
		
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
    	
    	$(document).off("mouseenter","#help");
    	$(document).off("mouseleave","#help")
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
    	
		setTimeout(function() {
			addHelpEventHandler();
		}, 1000);
		
		// disable pics loading on scroll
		helpOn = 0;
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

    	if ( ! helpOn ) {
    	
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
	    	
			setTimeout(function() {
				addHelpEventHandler();
			}, 1000);
			
			// disable pics loading on scroll
			helpOn = 0;
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
