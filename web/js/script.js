$(function() {

    size();

    $(window).resize(function() {
        size();
    });
});


function size() {

    var previewWidth = 150;
    var imageRatio = 0.75;

    var width = $(window).width();
    var height = $(window).height();

    var numRows = Math.ceil( width / previewWidth );

    console.log( 'numRows : ' + numRows );
    
    previewWidth = parseInt( width / numRows );

    console.log( 'previewWidth : ' + previewWidth );
    
    var previewHeight = Math.ceil( previewWidth * imageRatio );
    
    console.log( 'previewHeight : ' + previewHeight );
    
    var numCols = parseInt( height / previewHeight ) + 1;
    
    console.log( 'numCols : ' + numCols );
    
    var numPics = numCols * numRows;
    
    console.log( 'numPics : ' + numPics );
    
    $('img').css( 'width' , previewWidth );

    $('img').css( 'opacity' , 1 );

    var margin = width - ( numRows * previewWidth );

    var leftMargin = parseInt( margin / 2 );

    $('#frame').css( 'margin-left' , leftMargin );
}
