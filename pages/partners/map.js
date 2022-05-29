'use strict';

ymaps.ready(init);
var myMap,
    myPlacemark;

function init() {
    myMap = new ymaps.Map("map", {
        center: [55.74077834448158,37.66045400193285],
        zoom: 16
    });

    myPlacemark = new ymaps.Placemark([55.74077834448158,37.66045400193285], {
        balloonContent: 'УЛ. ТАГАНСКАЯ, Д. 13, СТР. 8, ОФИС 1'
    });

    myMap.geoObjects.add(myPlacemark);
}

