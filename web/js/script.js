$(function() {

    console.log('started');
    
    var page = 1;
    
    var numPics , previewWidth;

    [ numPics , previewWidth ] = getPicsPerScreen();
    
    url = '/' + page + '/' + numPics;
    
    $.ajax({
        url: url,
        type: "get",
        success: function(data){
            
          console.log(data.length);
          
          var time = 500;
          
          $.each( data , function( k, v ) {

              setTimeout( function(){ 
                  var img = $('<img />', { 
                      src: '/images/' + v,
                      style : 'width:' + previewWidth
                    });
                  
                    img.css('width' , previewWidth);
                    img.appendTo($('#frame'));
              }, time)
              time += 50;
          });
        },
        error:function() {
          $("#frame").html('There is error while submit');
        }
      });
    
//    size();

    $(window).resize(function() {
//        size();
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

    console.log( 'numRows : ' + numRows );
    console.log( 'previewWidth : ' + previewWidth );
    console.log( 'previewHeight : ' + previewHeight );
    console.log( 'numCols : ' + numCols );
    console.log( 'numPics : ' + numPics );

    var result = [ numPics , previewWidth ];
    
    return result;
}


function size() {

    
}
