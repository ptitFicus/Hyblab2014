/*jslint browser: true*/
/*global $*/
$(document).ready(function () {
    'use strict';
    $('#demo_box').popmenu({'background': '#BDBDBD', 'focusColor': '#D33C3D', 'iconSize': (Math.floor(window.innerWidth/8))+"px", 'width': window.innerWidth-100+"px"});
    
    var tab = document.getElementsByClassName('pictoChoix'),
        i;
    for(i = 0; i < tab.length; i += 1) {
        tab[i].style.width = (Math.floor(window.innerWidth/9))+"px";
    }
});

;(function($) {
     // DOM Ready
    $(function() {
        $('#popupmenu').bind('mouseover', function(e) {
            document.getElementById("imgCategorie").style.opacity = 0.4;
        });
        $('#popupmenu').bind('mouseout', function(e) {
            document.getElementById("imgCategorie").style.opacity = 1;
        });
    });
})(jQuery);