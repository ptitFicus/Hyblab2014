/*jslint browser: true*/
/*global $, alert */


;(function($) {
     // DOM Ready
    $(function() {
                        
        $('#img2009').bind('click', function(e) {
            e.preventDefault();
            document.getElementById("imagePodium").src= "img/podiums/2009.svg";
            document.getElementById("img2009").src= "img/podiums/c2009.png";
            document.getElementById("img2010").src= "img/podiums/nc2010.png";
            document.getElementById("img2011").src= "img/podiums/nc2011.png";
            document.getElementById("img2012").src= "img/podiums/nc2012.png";
        });


        $('#img2010').bind('click', function(e) {
            e.preventDefault();
            document.getElementById("imagePodium").src= "img/podiums/2010.svg";
            document.getElementById("img2009").src= "img/podiums/nc2009.png";
            document.getElementById("img2010").src= "img/podiums/c2010.png";
            document.getElementById("img2011").src= "img/podiums/nc2011.png";
            document.getElementById("img2012").src= "img/podiums/nc2012.png";
        });
        
        $('#img2011').bind('click', function(e) {
            e.preventDefault();
            document.getElementById("imagePodium").src= "img/podiums/2011.svg";
            document.getElementById("img2009").src= "img/podiums/nc2009.png";
            document.getElementById("img2010").src= "img/podiums/nc2010.png";
            document.getElementById("img2011").src= "img/podiums/c2011.png";
            document.getElementById("img2012").src= "img/podiums/nc2012.png";
        });
        
        $('#img2012').bind('click', function(e) {
            e.preventDefault();
            document.getElementById("imagePodium").src= "img/podiums/2012.svg";
            document.getElementById("img2009").src= "img/podiums/nc2009.png";
            document.getElementById("img2010").src= "img/podiums/nc2010.png";
            document.getElementById("img2011").src= "img/podiums/nc2011.png";
            document.getElementById("img2012").src= "img/podiums/c2012.png";
        });
    });
})(jQuery);