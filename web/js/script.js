$(function() {

	var done = 0;    // flag : 1 if all images are loaded
	var page = 1;    // page number
	var helpOn = 0;  // flag
	var imageOn = 0; // flag

	var numPics, previewWidth, gridHeight;

	_init();

	/**
	 * trigger : click on a preview
	 *
	 * result : show image
	 */
    $(document).on("click","a:not( .next, .prev )",function(e) {

        var imageLink = $(this);

    	e.preventDefault();
    	imageLink.addClass('current'); // empty class used to find next and previous image
    	disableScroll();
    	showImage(imageLink.attr('href'));

    	// remove help mouse hover events
    	$(document).off("mouseenter","#help");
    	$(document).off("mouseleave","#help");

    	imageOn = 1;
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

		$( ".fullPic" ).css("opacity", 0);
		$( "#frame" ).css("opacity", 0);

		if (window.RT) {
			clearTimeout(window.RT);
		}

		window.RT = setTimeout(function()  {

			var current = $(".current").attr("href");

			$( "#frame" ).empty();

			var path;
			if ( imageOn ) {
				path = $(".fullPic").attr('src');
				$(".fullPic").remove();
			}

			$( "#frame" ).empty();
			done = 0;
			page = 1;

			enableScroll();

			_init("reload");

			if ( imageOn ) {

				setTimeout(function() {
					disableScroll();
				}, 100);

				var img = _getImage("reload");
				img.src= path;
				$("#imgFrame").html(img);
				setTimeout(function() {
					$("a[href='" + current + "']").addClass("current");
				}, 1000);

			}
			$( "#frame" ).css("opacity" , 1);
		}, 500);

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
		if (e.which == 39) {                          // -- arrow right
	    	navigateImage('next');
		} else if (e.which == 37) {                   // -- arrow left
			navigateImage('prev');
		}
		else if (e.which == 88 || e.which == 27) {    // -- x or ESC
			_handleClose();
		}
	});


	/**
	 * lazy internal functions
	 *
	 */
	function _init(reload) {

		reload = reload || 0;

		// get infos on previews grid
		[ numPics, previewWidth, gridHeight ] = getPicsInfos(reload);

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
		if ( ! reload ) {
			addHelpClickHandler();
		}
	}


	// function _reloadInNav(last) {
    //     console.log("last : " + last)
    // 	if (last == 1) {
    //
    // 		if ( ! done ) {
    // 			done = loadPics(page, numPics, previewWidth, done);
    // 			page++;
    //
    // 			setTimeout(function() {
    // 				navigateImage('next');
    // 			}, 500);
    // 		}
    // 	}
	// }

    /**
	 * close help
	 */
	function _handleClose() {

    	$(document).off("click","#help");

    	$("#imgFrame").remove();
    	$("#navFrame").remove();

    	enableScroll();

		setTimeout(function() {
			addHelpHoverHandler();
		    addHelpClickHandler();
		}, 500);

		// enable pics loading on scroll
		helpOn = 0;

		imageOn = 0;

		$("#help").css("opacity", 0.3);
	}

	/**
	 * add help button click handler
	 */
	function addHelpClickHandler() {

        /**
    	 * trigger : click on help
    	 *
    	 * result : show help
    	 */
	    $(document).on("click","#help",function(e) {

            // -- remove mouseenter and mouseleave listeners
	    	$(document).off("mouseenter","#help");
	    	$(document).off("mouseleave","#help");

            // -- set help flag
	    	helpOn = 1;

            // -- get help
			$.ajax({
				url : '/help',
				type : "get",
				success : function(data) {

                    // -- append help
					$("body").append(data);

                    // -- animate close button
					animateButtonLoad($("#close"));

                    // -- add mouseenter and mouseleave listeners
				    $(document).on("mouseenter","#close",function(e) {
				    	$(this).animate( {opacity: 1} , 500 );
				    });

				    $(document).on("mouseleave","#close",function(e) {
				    	$(this).delay(1000).animate( {opacity: 0.3} , 500 );
				    });
				},
			});

	    });
	}
});


// eof
