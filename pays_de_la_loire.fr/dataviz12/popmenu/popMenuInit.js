/*jslint browser: true*/
/*global $*/
$(document).ready(function () {
    'use strict';
    $('#demo_box').popmenu({'background': '#BDBDBD', 'focusColor': '#D33C3D', 'iconSize': '125px', 'width': '750px'});
});

;(function($) {
     // DOM Ready
    $(function() {
        $('#popupmenu').bind('mouseover', function(e) {
            document.getElementById("imgCategorie").style.opacity = 1;
        });
        $('#popupmenu').bind('mouseout', function(e) {
            document.getElementById("imgCategorie").style.opacity = 0.4;
        });
    });
})(jQuery);