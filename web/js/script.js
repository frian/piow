$(function() {

    console.log('started');

    var done = 0;
    var page = 1;
    
    var numPics, previewWidth;

    [ numPics , previewWidth ] = getPicsPerScreen();

    done = loadPics(page, numPics, previewWidth, done);
    page++;
    
    window.onscroll = function(ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
          if (done) {
              console.log('done');
          }
          else {
              done = loadPics(page, numPics, previewWidth, done);
              page++;
          }
        }
    };
    
    $(window).resize(function() {
        [ numPics , previewWidth ] = getPicsPerScreen();
        $('img').css( 'width', previewWidth );
    });
});



function getPicsPerScreen() {

    var previewWidth = 150;
    var imageRatio = 0.75;

    /*
     *  Get pics per screen ---------------------------------------------------
     */
    // get screen size
    var width = $(window).width();
    var height = $(window).height();

    // get # pics per row
    var numRows = Math.ceil( width / previewWidth );

    // get preview width
    previewWidth = parseInt( width / numRows );

    // get preview height
    var previewHeight = Math.ceil( previewWidth * imageRatio );

    // get # pics per row
    var numCols = parseInt( height / previewHeight ) + 1;

    // get # pics per screen
    var numPics = numCols * numRows;

//    console.log( 'numRows : ' + numRows );
//    console.log( 'previewWidth : ' + previewWidth );
//    console.log( 'previewHeight : ' + previewHeight );
//    console.log( 'numCols : ' + numCols );
//    console.log( 'numPics : ' + numPics );

    var result = [ numPics , previewWidth ];

    return result;
}

function loadPics(page, numPics, previewWidth, done) {

    url = '/' + page + '/' + numPics;
    
    $.ajax({
        url: url,
        type: "get",
        async: false,
        success: function(data){

          if ( data.length < numPics) {
              done = 1;
          }

          var time = 500;

          $.each( data , function( k, v ) {

              setTimeout( function() {

                  var img = $('<img />', { 
                      src: '/images/' + v,
                      style : 'width:' + previewWidth
                  });
                  
                  img.css('width' , previewWidth);
                  img.appendTo($('#frame'));
              }, time += 50)
          });
        },
        error:function() {
          $("#frame").html('There is error while submit');
        }
      });
      return done;
}
