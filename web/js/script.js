$(function() {

	var done = 0;
	var page = 1;

	var frameHeight = $(window).height();
	$('#frame').css('height', frameHeight);

	var numPics, previewWidth;

	[ numPics, previewWidth ] = getPicsPerScreen();

	done = loadPics(page, numPics, previewWidth, done);
	page++;

	window.onscroll = function(ev) {
		//    	var scrollHeight = $(document).height();
		//    	var scrollPosition = $(window).height() + $(window).scrollTop();
		//    	if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
		if ($(window).scrollTop() + $(window).height() == $(document).height()) {
		// if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {

			if (typeof flag != 'undefined' && flag) return;

			flag = true;

			if (!done) {

				var height = $('#frame').height() + $(window).height();

				$('#frame').css('height', height);

				setTimeout(function() {
					window.scrollBy(0, $(window).height()
							- Math.ceil(previewWidth * 0.75));
				}, 100);

				done = loadPics(page, numPics, previewWidth, done);
				page++;
			}
			flag = undefined;
		}

	};

	$(window).resize(function() {

		[ numPics, previewWidth ] = getPicsPerScreen();
		$('img').css('width', previewWidth);
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

	return [ numPics, previewWidth ];
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

					var img = $('<img />', {
						src : '/images/' + v,
						style : 'width:' + previewWidth
					});

					img.css('width', previewWidth);
					img.appendTo($('#frame'));
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
