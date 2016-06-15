$(function() {

	var done = 0; // flag : 1 if all images are loaded
	var page = 1; // page number
	var helpOn = 0; // flag

	var numPics, previewWidth, gridHeight;

	_init();

	/**
	 * trigger : click on a preview
	 * 
	 * result : show image
	 */
    $(document).on("click","a:not( .next, .prev )",function(e) {
    	
    	e.preventDefault();
    	$(this).addClass('current'); // empty class used to find next and previous image
    	disableScroll();
    	showImage(this);
    	
    	// remove help mouse hover events
    	$(document).off("mouseenter","#help");
    	$(document).off("mouseleave","#help")
    });
	
    
    /**
     * trigger : click on close image
     * 
     * result : close image frame
     */
    $(document).on("click","#close",function(e) {
    	
    	_handleClose();
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
    	last = navigateImage('next');

    	 _reloadInNav(last);
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
				
				$( "#frame" ).empty();
				done = 0;
				page = 1;

				console.log("resize");
				
				_init("reload");
				
			}, 100);

	});


	/**
	 * keyboard shortcuts
	 * 
	 *   right arrow : show next image (39)
	 *   left arrow : show previous image (37)
	 *   x : close image frame (88)
	 */
	$(document).keydown( function(e) {
//		console.log(e.which);
		if (e.which == 39) {
	    	last = navigateImage('next');
	    	 _reloadInNav(last);
		} else if (e.which == 37) {
			
			navigateImage('prev');
		}
		else if (e.which == 88) {

			_handleClose();
		}
	});


	/**
	 * lazy internal functions
	 * 
	 */
	function _init(reload) {
		
		var reload = reload || 0;

		// get infos on previews grid
		[ numPics, previewWidth, gridHeight ] = getPicsPerScreen("reload");
	
		// set frame height
		$('#frame').css('height', gridHeight);
		
		// load previews
		done = loadPics(page, numPics, previewWidth, done);
		
		// increment page number
		page++;
	
		// add help button
		var helpButton = $("<div/>").attr( 'id', 'help' ).html("<i class='icon-help'></i>");
		$('#frame').append(helpButton);
	
		// animate help button
		animateButtonLoad($("#help"));
	
		// add help button handlers
		addHelpHoverHandler();
	    addHelpClickHandler();
	}
	
	function _reloadInNav(last) {

    	if (last == 1) {
    		
    		if ( ! done ) {
    			done = loadPics(page, numPics, previewWidth, done);
    			page++;
    			
    			setTimeout(function() {
    				navigateImage('next');
    			}, 500);
    		}
    	}
	}
	
	
	function _handleClose() {
		
    	$(document).off("click","#help");
    	
    	$("#imgFrame").remove();
    	$("#navFrame").remove();

    	enableScroll();

		setTimeout(function() {
			addHelpHoverHandler();
		    addHelpClickHandler()
		}, 500);
		
		// disable pics loading on scroll
		helpOn = 0;
		
		$("#help").css("opacity", .3);
	}

	/**
	 * trigger : click on help
	 * 
	 * result : show help
	 */
	function addHelpClickHandler() {

	    $(document).on("click","#help",function(e) {
	    	
	    	$(document).off("mouseenter","#help");
	    	$(document).off("mouseleave","#help")
	    	
	    	helpOn = 1;
	    	
			$.ajax({
				url : '/help',
				type : "get",
				success : function(data) {
					$("body").append(data);
					animateButtonLoad($("#close"));
					
				    $(document).on("mouseenter","#close",function(e) {
				    	$(this).animate( {opacity: 1} , 500 );
				    });
				    
				    $(document).on("mouseleave","#close",function(e) {
				    	$(this).delay(1000).animate( {opacity: .3} , 500 );
				    });
				},
			});
			
	    });
	}
});


// eof
