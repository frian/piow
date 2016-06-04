$(function() {

	var done = 0;
	var page = 1;

//	var frameHeight = $(window).height();

	var numPics, previewWidth;

	[ numPics, previewWidth, gridHeight ] = getPicsPerScreen();

	$('#frame').css('height', gridHeight);
	
	done = loadPics(page, numPics, previewWidth, done);
	page++;

	window.onscroll = function(ev) {
		//    	var scrollHeight = $(document).height();
		//    	var scrollPosition = $(window).height() + $(window).scrollTop();
		//    	if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
		if ($(window).scrollTop() + $(window).height() == $(document).height()) {
//		 if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {

			console.log('scroll'); 
			
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

	$(window).resize(function() {

		  if (window.RT) clearTimeout(window.RT);
		  window.RT = setTimeout(function()
		  {
		    this.location.reload(false); /* false to get page from cache */
		  }, 10);
	});
});

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
	
	console.log(gridHeight);

	return [ numPics, previewWidth, gridHeight ];
}

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
				    img.src = previewPath;

				    var imgName = v.replace("prev-", "");


					var link = $('<a />');
					
					link.attr("href", "/images/" + imgName);
					
					$(link).append(img);
					
				    img.onload = function() {

				    	// detect image orientation
				    	if ( img.width < img.height ) {
				    		
				    		// keep original pic height for top padding calculation
				    		var picHeight = img.height;
				    		
				    		// add wrapper
				    		var wrapper = $("<div/>");
				    		wrapper.css('height', Math.ceil(previewWidth * 0.75))
				    			.css('width', previewWidth)
				    			.css('float', 'left')
				    			.css('overflow', 'hidden');
				    		
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

// eof
