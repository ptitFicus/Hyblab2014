/*jslint browser: true*/
/*global $, alert, Highcharts */

function receptionnerCliqueDepartement() {
    'use strict';
    $('#courbeDpt').highcharts({
        chart: {
            type: 'areaspline',
            backgroundColor: 'transparent'
        },
        title: {
            text: 'Evolution du nombre de licenciés du sport dans la région'
        },
        xAxis: [{
            categories: ['2009', '2010', '2011', '2012']
        }],
        yAxis: {
            title: {
                text: 'Nombre de licenciés'
            }
        },
        tooltip: {
            shared: true
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            line: {
                lineWidth: 3,
                marker: {
                    enabled: true,
                    fillColor: "#ff0000"
                },
                threshold: null
            }
        },

        series: [{
            type: 'line',
            name: 'Nombre de licenciés',
            data: [100, 1900, 1000, 2100]
        }]
    });
}






$(document).ready(function () {
    'use strict';
    $('#carte2').vectorMap({
        map: 'pays_de_la_loire',
        hoverOpacity: 0.5,
        hoverColor: null,
        backgroundColor: "#ffffff",
        color: "#218FB2",
        borderColor: null,
        selectedColor: null,
        enableZoom: false,
        showTooltip: true,
		onRegionClick: function (element, code, region) {
			receptionnerCliqueDepartement();
		}
    });
    
    var carte = document.getElementById("carte2"),
        svg = carte.getElementsByTagName("svg")[0];
    svg.setAttribute("viewBox", "300 150 400 400");
});