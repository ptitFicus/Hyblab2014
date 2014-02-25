/*jslint browser: true*/

var i = false; // La variable i nous dit si la bulle est visible ou non
 
function move(e) {
    'use strict';
    if (i) {
        if (navigator.appName !== "Microsoft Internet Explorer") { // Si on est pas sous IE
            document.getElementById("curseur").style.left = e.pageX + (-400) +  "px";
            document.getElementById("curseur").style.top = e.pageY + 10 + "px";
        } else {
            if (document.documentElement.clientWidth > 0) {
                document.getElementById("curseur").style.left = 20 + event.x + document.documentElement.scrollLeft + "px";
                document.getElementById("curseur").style.top = 10 + event.y + document.documentElement.scrollTop + "px";
            } else {
                document.getElementById("curseur").style.left = 20 + event.x + document.body.scrollLeft + "px";
                document.getElementById("curseur").style.top = 10 + event.y + document.body.scrollTop + "px";
            }
        }
    }
}
 
function montre(text) {
    'use strict';
    if (!i) {
        document.getElementById("curseur").style.visibility = "visible"; // Si il est cacher (la verif n'est qu'une securitÃ©) on le rend visible.
        document.getElementById("curseur").innerHTML = text; // on copie notre texte dans l'Ã©lÃ©ment html
        i = true;
    }
    document.getElementById("defAffinitaires").style.opacity = 0.4;
}

function cache() {
    'use strict';
    if (i) {
        document.getElementById("curseur").style.visibility = "hidden"; // Si la bulle est visible on la cache
        i = false;
    }

    document.getElementById("defAffinitaires").style.opacity = 1;

}
document.onmousemove = move; // dÃ¨s que la souris bouge, on appelle la fonction move pour mettre Ã  jour la position de la bulle.