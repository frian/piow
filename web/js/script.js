$(function() {

    size();

    $(window).resize(function() {
        size();
    });
});


function size() {

    var previewWidth = 150;

    var width = $(window).width();
    var height = $(window).height();

    var picPerRow = parseInt( width / previewWidth ) + 1;

    previewWidth = parseInt( width / picPerRow );

    $('img').css( 'width' , previewWidth );

    $('img').css( 'opacity' , 1 );

    var margin = width - ( picPerRow * previewWidth );

    var leftMargin = parseInt( margin / 2 );

    $('#frame').css( 'margin-left' , leftMargin );
}
