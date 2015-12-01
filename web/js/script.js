$(function() {

    console.log('loaded');

    size();
    
    $(window).resize(function() {
        size();
    });
});


function size() {

    var previewWidth = 150;

    var width = $(window).width();
    var height = $(window).height();
    
    var picPerRow = parseInt( width / previewWidth );
    
    previewWidth = parseInt( width / picPerRow );

    $('img').css( 'width' , previewWidth );

    $('img').css( 'display' , 'block' );
    
    var margin = width - ( picPerRow * previewWidth );

    var leftMargin = parseInt( margin / 2 );

    $('#frame').css( 'margin-left' , leftMargin );
}
