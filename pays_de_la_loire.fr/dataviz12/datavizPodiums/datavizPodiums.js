/*jslint browser: true*/
/*global $, alert */

;(function($) {
     // DOM Ready
    $(function() {
        
        var annee;
        
        $('#boutonGauche').bind('click', function(e) {
            e.preventDefault();
            annee = document.getElementById("imagePodium").alt;
            
            if (annee == 2009) {
                document.getElementById("imagePodium").src= "img/podiums/2012.png";
                document.getElementById("imagePodium").alt = 2012;
            }
            else if (annee == 2010) {
                document.getElementById("imagePodium").src= "img/podiums/2009.png";
                document.getElementById("imagePodium").alt = 2009;
            }
            else if (annee == 2011) {
                document.getElementById("imagePodium").src= "img/podiums/2010.png";
                document.getElementById("imagePodium").alt = 2010;
            }
            else if (annee == 2012) {
                document.getElementById("imagePodium").src= "img/podiums/2011.png";
                document.getElementById("imagePodium").alt = 2011;
            }
        });


        $('#boutonDroite').bind('click', function(e) {
            e.preventDefault();
            annee = document.getElementById("imagePodium").alt;

            if (annee == 2009) {
                document.getElementById("imagePodium").src= "img/podiums/2010.png";
                document.getElementById("imagePodium").alt = 2010;
            }
            else if (annee == 2010) {
                document.getElementById("imagePodium").src= "img/podiums/2011.png";
                document.getElementById("imagePodium").alt = 2011;
            }
            else if (annee == 2011) {
                document.getElementById("imagePodium").src= "img/podiums/2012.png";
                document.getElementById("imagePodium").alt = 2012;
            }
            else if (annee == 2012) {
                document.getElementById("imagePodium").src= "img/podiums/2009.png";
                document.getElementById("imagePodium").alt = 2009;
            }
        });
    });
})(jQuery);