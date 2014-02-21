/*jslint browser: true*/
/*global moduleCSV, Raphael */
var currentTab = [],
    tab44 = [],
    tab85 = [],
    tab53 = [],
    tab72 = [],
    tab49 = [],
    departement = "";

var i = 0;

var moduleC;

var paper;


function majField() {
    'use strict';
    document.getElementById("nom").innerHTML = currentTab[i][0] + " " + currentTab[i][1];
    document.getElementById("discipline").innerHTML = currentTab[i][2];
    document.getElementById("club").innerHTML = currentTab[i][3];
    document.getElementById("resultat").innerHTML = currentTab[i][4];
    document.getElementById("picto").innerHTML = "<img src='img/popmenu/" + currentTab[i][5] + "' width=150 />";
}

function clickBG() {
    'use strict';
    i = i - 1;
    if (i < 0) {
        i = currentTab.length - 1;
    }
    majField();
}

function clickBD() {
    'use strict';
    i += 1;
    if (i > currentTab.length - 1) {
        i = 0;
    }
    majField();
}

function initDepartement(dep, tabDep) {
    'use strict';
    i = 0;
    currentTab = tabDep;
    departement = dep;
    if (currentTab.length === 1) {
        //document.getElementById('flecheD').style.display = "none";
        //document.getElementById('flecheG').style.display = "none";
        document.getElementById("flecheG").src = "datavizJO/images/invisible20.png";
        document.getElementById("flecheD").src = "datavizJO/images/invisible20.png";
        document.getElementById("flecheD").style.cursor = "default";
        document.getElementById("flecheG").style.cursor = "default";
    } else {
        //document.getElementById('flecheD').style.display = "block";
        //document.getElementById('flecheG').style.display = "block";
        document.getElementById("flecheD").src = "datavizJO/images/flechedroite.svg";
        document.getElementById("flecheG").src = "datavizJO/images/flechegauche.svg";
        document.getElementById("flecheG").style.cursor = "pointer";
        document.getElementById("flecheD").style.cursor = "pointer";
    }
    switch (dep) {
    case "44":
        document.getElementById("nomDepartement").innerHTML = "Loire-Atlantique";
        break;
    case "85":
        document.getElementById("nomDepartement").innerHTML = "Vendée";
        break;
    case "53":
        document.getElementById("nomDepartement").innerHTML = "Mayenne";
        break;
    case "49":
        document.getElementById("nomDepartement").innerHTML = "Maine et Loire";
        break;
    case "72":
        document.getElementById("nomDepartement").innerHTML = "Sarthe";
        break;
    }
}

function loadCSV() {
    'use strict';
    
    moduleC = moduleCSV();
    moduleC.readTextFile('datavizJO/csv/athletes_jo_2012.csv', function (csvString) {
        var csvObject = moduleC.csvToObject(csvString),
            prop,
            s = "",
            tab = [];
        
        for (prop in csvObject) {
            if (csvObject.hasOwnProperty(prop)) {
                s += prop + " : " + csvObject[prop] + "\n";
                
                tab.push(prop);
                tab.push(csvObject[prop][0]);
                tab.push(csvObject[prop][2]);
                tab.push(csvObject[prop][3]);
                tab.push(csvObject[prop][4]);
                tab.push(csvObject[prop][5]);
                
                switch (csvObject[prop][1]) {
                case "44":
                    tab44.push(tab);
                    break;
                case "85":
                    tab85.push(tab);
                    break;
                case "53":
                    tab53.push(tab);
                    break;
                case "72":
                    tab72.push(tab);
                    break;
                case "49":
                    tab49.push(tab);
                    break;
                }
                tab = [];
            }
        }
        majField();
    });
}

window.onload = function () {
    'use strict';
    var rond1,
        rond2,
        rond3,
        rond4,
        rond5,
        cercle1,
        cercle2,
        cercle3,
        cercle4,
        cercle5;

    loadCSV();
    
    /* LOGO JO */
    
    paper = new Raphael(document.getElementById('canvas_jo'), 500, 200);
    document.getElementById('canvas_jo').getElementsByTagName('svg')[0].setAttribute("id", "svgJO");
    initDepartement("44", tab44);
    
    rond1 = paper.path("M302.311,138.928c-38.583,0-69.862,31.278-69.862,69.861c0,38.583,31.278,69.862,69.862,69.862s69.862-31.278,69.862-69.862C372.173,170.206,340.895,138.928,302.311,138.928z M302.311,265.693c-31.427,0-56.904-25.477-56.904-56.904c0-31.427,25.477-56.904,56.904-56.904c31.427,0,56.904,25.477,56.904,56.904C359.215,240.216,333.739,265.693,302.311,265.693z M293.727,213.489h-8.546v-3.858l8.546-10.158h4.089v10.377h2.119v3.64h-2.119v3.156h-4.089V213.489z M293.727,209.849v-5.314l-4.516,5.314H293.727z M313.234,213.489h-8.546v-3.858l8.546-10.158h4.089v10.377h2.119v3.64h-2.119v3.156h-4.089V213.489z M313.234,209.849v-5.314l-4.516,5.314H313.234z");
    rond1.attr({fill: "#2290B2", stroke: "none", opacity: 1, cx: 0, cy: 0});
    cercle1 = paper.circle(302.356, 209.058, 69.817);
    cercle1.attr({fill: "black", stroke: "#2290B2", opacity: 0});
    
    rond2 = paper.path("M378.121,199.442c-38.583,0-69.862,31.278-69.862,69.861c0,38.583,31.278,69.862,69.862,69.862c38.583,0,69.861-31.278,69.861-69.862C447.983,230.72,416.705,199.442,378.121,199.442z M378.121,326.207c-31.427,0-56.904-25.477-56.904-56.904c0-31.427,25.477-56.904,56.904-56.904c31.427,0,56.904,25.477,56.904,56.904C435.025,300.731,409.549,326.207,378.121,326.207z M363.461,260.861h11.137v3.743h-7.544l-0.403,2.534c0.522-0.246,1.038-0.43,1.549-0.553c0.51-0.123,1.015-0.184,1.515-0.184c1.689,0,3.06,0.511,4.112,1.532c1.052,1.021,1.578,2.308,1.578,3.858c0,1.09-0.271,2.138-0.812,3.144c-0.541,1.006-1.309,1.774-2.304,2.304c-0.995,0.53-2.267,0.795-3.818,0.795c-1.113,0-2.067-0.105-2.862-0.317s-1.471-0.526-2.027-0.944c-0.557-0.419-1.008-0.893-1.353-1.422s-0.633-1.19-0.864-1.981l4.745-0.518c0.115,0.76,0.384,1.338,0.806,1.733c0.422,0.396,0.925,0.593,1.509,0.593c0.652,0,1.192-0.248,1.618-0.743c0.426-0.495,0.639-1.234,0.639-2.217c0-1.006-0.215-1.743-0.645-2.211c-0.43-0.468-1.002-0.703-1.716-0.703c-0.453,0-0.891,0.111-1.313,0.334c-0.315,0.161-0.661,0.453-1.037,0.875l-3.997-0.576L363.461,260.861z M385.617,265.745l-4.434-0.795c0.369-1.413,1.077-2.495,2.125-3.248s2.532-1.129,4.452-1.129c2.204,0,3.797,0.411,4.78,1.232c0.983,0.822,1.474,1.854,1.474,3.098c0,0.73-0.2,1.389-0.599,1.981c-0.399,0.591-1.002,1.11-1.808,1.555c0.652,0.161,1.152,0.35,1.497,0.564c0.56,0.346,0.996,0.8,1.307,1.365s0.466,1.238,0.466,2.021c0,0.983-0.258,1.925-0.772,2.828c-0.515,0.902-1.255,1.597-2.223,2.085c-0.967,0.488-2.238,0.731-3.812,0.731c-1.536,0-2.747-0.18-3.634-0.541c-0.887-0.361-1.617-0.889-2.188-1.584c-0.572-0.695-1.012-1.568-1.319-2.62l4.688-0.622c0.184,0.944,0.47,1.599,0.858,1.964c0.387,0.364,0.881,0.547,1.48,0.547c0.629,0,1.153-0.23,1.572-0.691c0.418-0.461,0.628-1.075,0.628-1.843c0-0.783-0.202-1.39-0.605-1.82c-0.403-0.43-0.95-0.645-1.641-0.645c-0.369,0-0.875,0.092-1.52,0.276l0.242-3.352c0.261,0.039,0.464,0.058,0.61,0.058c0.614,0,1.127-0.196,1.538-0.587c0.411-0.392,0.616-0.856,0.616-1.394c0-0.514-0.154-0.926-0.461-1.232c-0.307-0.307-0.73-0.461-1.267-0.461c-0.553,0-1.002,0.167-1.348,0.501S385.74,264.908,385.617,265.745z");
    rond2.attr({fill: "#F4A740", stroke: "none", opacity: 0.5, cx: 0, cy: 0});
    cercle2 = paper.circle(378.121, 269.448, 69.817);
    cercle2.attr({fill: "black", stroke: "#2290B2", opacity: 0});
    
    rond3 = paper.path("M456.758,138.928c-38.583,0-69.862,31.278-69.862,69.861c0,38.583,31.278,69.862,69.862,69.862c38.583,0,69.861-31.278,69.861-69.862C526.619,170.206,495.341,138.928,456.758,138.928z M456.758,265.693c-31.427,0-56.904-25.477-56.904-56.904c0-31.427,25.477-56.904,56.904-56.904c31.427,0,56.904,25.477,56.904,56.904C513.661,240.216,488.185,265.693,456.758,265.693z M440.18,196.922h13.694v3.167c-1.19,1.075-2.185,2.239-2.983,3.49c-0.967,1.52-1.732,3.213-2.292,5.079c-0.445,1.451-0.745,3.167-0.898,5.148h-4.676c0.369-2.757,0.948-5.068,1.739-6.934c0.791-1.866,2.042-3.862,3.755-5.989h-8.339V196.922z M473.335,213.807h-14.074c0.161-1.39,0.651-2.697,1.469-3.922s2.351-2.67,4.601-4.336c1.374-1.021,2.253-1.797,2.638-2.327c0.384-0.53,0.576-1.032,0.576-1.509c0-0.514-0.19-0.954-0.57-1.319c-0.38-0.364-0.858-0.547-1.434-0.547c-0.599,0-1.088,0.188-1.468,0.564c-0.38,0.376-0.636,1.041-0.766,1.993l-4.699-0.38c0.184-1.32,0.522-2.351,1.014-3.092c0.491-0.741,1.184-1.309,2.079-1.705c0.894-0.396,2.132-0.593,3.714-0.593c1.651,0,2.935,0.188,3.853,0.564c0.917,0.376,1.639,0.954,2.165,1.733c0.526,0.779,0.789,1.653,0.789,2.62c0,1.029-0.302,2.011-0.904,2.948c-0.603,0.937-1.699,1.965-3.288,3.087c-0.944,0.652-1.576,1.11-1.895,1.371c-0.319,0.261-0.693,0.603-1.123,1.025h7.325V213.807z");
    rond3.attr({fill: "#010202", stroke: "none", opacity: 0.5, cx: 0, cy: 0});
    cercle3 = paper.circle(456.758, 209.058, 69.817);
    cercle3.attr({fill: "black", stroke: "#2290B2", opacity: 0});
    
    rond4 = paper.path("M527.635,271.753h-8.546v-3.858l8.546-10.158h4.089v10.377h2.119v3.64h-2.119v3.156h-4.089V271.753z M527.635,268.113v-5.314l-4.516,5.314H527.635z M539.287,271.119l4.665-0.587c0.123,0.652,0.33,1.113,0.622,1.382c0.292,0.269,0.649,0.403,1.071,0.403c0.752,0,1.34-0.38,1.762-1.14c0.307-0.56,0.537-1.747,0.691-3.559c-0.561,0.576-1.137,0.998-1.728,1.267c-0.591,0.269-1.275,0.403-2.05,0.403c-1.513,0-2.789-0.537-3.83-1.612c-1.041-1.075-1.561-2.434-1.561-4.077c0-1.121,0.265-2.142,0.795-3.064c0.53-0.921,1.259-1.618,2.188-2.09c0.929-0.472,2.096-0.708,3.501-0.708c1.689,0,3.044,0.29,4.066,0.87c1.021,0.58,1.837,1.501,2.447,2.764c0.61,1.263,0.916,2.931,0.916,5.004c0,3.048-0.641,5.281-1.923,6.697c-1.283,1.417-3.06,2.125-5.333,2.125c-1.344,0-2.403-0.155-3.179-0.466c-0.776-0.311-1.421-0.766-1.935-1.365C539.959,272.766,539.564,272.018,539.287,271.119z M547.925,263.587c0-0.914-0.23-1.63-0.691-2.148s-1.021-0.777-1.682-0.777c-0.622,0-1.139,0.234-1.549,0.703c-0.411,0.468-0.616,1.171-0.616,2.108c0,0.944,0.213,1.666,0.639,2.165c0.426,0.499,0.958,0.749,1.595,0.749c0.66,0,1.209-0.242,1.647-0.726S547.925,264.485,547.925,263.587z M605.827,266.85c0-0.034-0.005-0.063-0.005-0.096c0-0.087,0.007-0.172,0.007-0.258c0-38.583-31.278-69.862-69.862-69.862s-69.861,31.278-69.861,69.862s31.278,69.861,69.861,69.861c31.498,0,58.118-20.848,66.837-49.496c0.001,0,0.008-0.001,0.008-0.001s0.086-0.298,0.228-0.829c1.287-4.424,2.145-9.028,2.533-13.768C605.745,270.464,605.845,268.631,605.827,266.85z M535.966,323.4c-31.427,0-56.904-25.477-56.904-56.904c0-31.427,25.477-56.904,56.904-56.904c30.351,0,55.145,23.763,56.809,53.698c0.017,0.934,0.089,6.894-0.663,12.449C587.695,302.768,564.245,323.4,535.966,323.4z");
    rond4.attr({fill: "#3D8F4B", stroke: "none", opacity: 0.5, cx: 0, cy: 0});
    cercle4 = paper.circle(535.967, 266.496, 69.817);
    cercle4.attr({fill: "black", stroke: "#2290B2", opacity: 0});
    
    rond5 = paper.path("M611.411,140.933c-38.583,0-69.862,31.278-69.862,69.861c0,38.583,31.278,69.862,69.862,69.862c38.583,0,69.862-31.278,69.862-69.862C681.272,172.211,649.994,140.933,611.411,140.933z M611.411,267.698c-31.427,0-56.904-25.477-56.904-56.904c0-31.427,25.477-56.904,56.904-56.904s56.904,25.477,56.904,56.904C668.314,242.222,642.838,267.698,611.411,267.698z M600.589,210.161c-0.737-0.392-1.275-0.829-1.612-1.313c-0.461-0.661-0.691-1.421-0.691-2.28c0-1.413,0.664-2.568,1.993-3.467c1.037-0.691,2.407-1.037,4.112-1.037c2.257,0,3.925,0.43,5.004,1.29c1.079,0.86,1.618,1.942,1.618,3.248c0,0.76-0.215,1.47-0.645,2.131c-0.322,0.491-0.829,0.967-1.52,1.428c0.914,0.438,1.595,1.018,2.044,1.739c0.449,0.721,0.674,1.52,0.674,2.396c0,0.845-0.194,1.634-0.582,2.367c-0.388,0.733-0.864,1.3-1.428,1.699c-0.564,0.399-1.267,0.693-2.108,0.881c-0.841,0.188-1.737,0.282-2.689,0.282c-1.789,0-3.156-0.211-4.1-0.633c-0.944-0.422-1.663-1.044-2.154-1.866c-0.492-0.822-0.737-1.739-0.737-2.753c0-0.991,0.23-1.83,0.691-2.517C598.919,211.069,599.629,210.537,600.589,210.161z M602.444,214.112c0,0.745,0.226,1.353,0.68,1.826c0.453,0.472,0.971,0.708,1.555,0.708c0.56,0,1.063-0.24,1.509-0.72c0.445-0.48,0.668-1.088,0.668-1.826c0-0.745-0.225-1.355-0.674-1.831s-0.97-0.714-1.561-0.714c-0.584,0-1.093,0.23-1.526,0.691C602.66,212.706,602.444,213.328,602.444,214.112z M602.697,206.844c0,0.583,0.182,1.054,0.547,1.411c0.364,0.357,0.85,0.536,1.457,0.536c0.537,0,0.979-0.177,1.324-0.53c0.346-0.353,0.518-0.81,0.518-1.371c0-0.583-0.181-1.058-0.541-1.422c-0.361-0.364-0.822-0.547-1.382-0.547c-0.568,0-1.031,0.179-1.388,0.536C602.875,205.813,602.697,206.276,602.697,206.844z M619.175,202.352h11.137v3.743h-7.544l-0.403,2.534c0.522-0.246,1.038-0.43,1.549-0.553c0.51-0.123,1.015-0.184,1.515-0.184c1.689,0,3.06,0.511,4.112,1.532c1.052,1.021,1.578,2.308,1.578,3.858c0,1.09-0.271,2.138-0.812,3.144s-1.309,1.774-2.303,2.304c-0.995,0.53-2.267,0.795-3.818,0.795c-1.113,0-2.067-0.105-2.862-0.317c-0.795-0.211-1.471-0.526-2.027-0.944c-0.557-0.419-1.008-0.893-1.353-1.422c-0.346-0.53-0.633-1.19-0.864-1.981l4.745-0.518c0.115,0.76,0.384,1.338,0.806,1.733c0.422,0.396,0.925,0.593,1.509,0.593c0.652,0,1.192-0.248,1.618-0.743s0.639-1.234,0.639-2.217c0-1.006-0.215-1.743-0.645-2.211c-0.43-0.468-1.002-0.703-1.716-0.703c-0.453,0-0.891,0.111-1.313,0.334c-0.315,0.161-0.661,0.453-1.037,0.875l-3.997-0.576L619.175,202.352z");
    rond5.attr({fill: "#E5343B", stroke: "none", opacity: 0.5, cx: 0, cy: 0});
    cercle5 = paper.circle(611.565, 210.794, 69.817);
    cercle5.attr({fill: "black", stroke: "#2290B2", opacity: 0});
    
    
    /* Fonctions : clic sur un des anneaux */
    
    cercle1.attr({cursor: 'pointer'}).click(function (e) {
        rond1.attr({opacity: 1});
        rond2.attr({opacity: 0.5});
        rond3.attr({opacity: 0.5});
        rond4.attr({opacity: 0.5});
        rond5.attr({opacity: 0.5});
        
        initDepartement("44", tab44);
        majField();
    });
    cercle1.mouseover(function (e) {
        rond1.attr({opacity: 1});
    });
    cercle1.mouseout(function (e) {
        if (departement !== "44") {
            rond1.attr({opacity: 0.5});
        }
    });
    cercle2.attr({cursor: 'pointer'}).click(function (e) {
        rond1.attr({opacity: 0.5});
        rond2.attr({opacity: 1});
        rond3.attr({opacity: 0.5});
        rond4.attr({opacity: 0.5});
        rond5.attr({opacity: 0.5});
        
        initDepartement("53", tab53);
        majField();
    });
    cercle2.mouseover(function (e) {
        rond2.attr({opacity: 1});
    });
    cercle2.mouseout(function (e) {
        if (departement !== "53") {
            rond2.attr({opacity: 0.5});
        }
    });
    cercle3.attr({cursor: 'pointer'}).click(function (e) {
        rond1.attr({opacity: 0.5});
        rond2.attr({opacity: 0.5});
        rond3.attr({opacity: 1});
        rond4.attr({opacity: 0.5});
        rond5.attr({opacity: 0.5});
        
        initDepartement("72", tab72);
        majField();
    });
    cercle3.mouseover(function (e) {
        rond3.attr({opacity: 1});
    });
    cercle3.mouseout(function (e) {
        if (departement !== "72") {
            rond3.attr({opacity: 0.5});
        }
    });
    cercle4.attr({cursor: 'pointer'}).click(function (e) {
        rond1.attr({opacity: 0.5});
        rond2.attr({opacity: 0.5});
        rond3.attr({opacity: 0.5});
        rond4.attr({opacity: 1});
        rond5.attr({opacity: 0.5});
        
        initDepartement("49", tab49);
        majField();
    });
    cercle4.mouseover(function (e) {
        rond4.attr({opacity: 1});
    });
    cercle4.mouseout(function (e) {
        if (departement !== "49") {
            rond4.attr({opacity: 0.5});
        }
    });
    cercle5.attr({cursor: 'pointer'}).click(function (e) {
        rond1.attr({opacity: 0.5});
        rond2.attr({opacity: 0.5});
        rond3.attr({opacity: 0.5});
        rond4.attr({opacity: 0.5});
        rond5.attr({opacity: 1});
        
        initDepartement("85", tab85);
        majField();
    });
    cercle5.mouseover(function (e) {
        rond5.attr({opacity: 1});
    });
    cercle5.mouseout(function (e) {
        if (departement !== "85") {
            rond5.attr({opacity: 0.5});
        }
    });

    /*Mettre le logo tout en haut à gauche */
    cercle1.translate(-200, -138.33608);
    cercle2.translate(-200, -138.33608);
    cercle3.translate(-200, -138.33608);
    cercle4.translate(-200, -138.33608);
    cercle5.translate(-200, -138.33608);
    
    rond1.translate(-200, -138.33608);
    rond2.translate(-200, -138.33608);
    rond3.translate(-200, -138.33608);
    rond4.translate(-200, -138.33608);
    rond5.translate(-200, -138.33608);

};