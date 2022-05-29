'use strict';

ymaps.ready(init);
var myMap,
    myPlacemark;

function init() {
    myMap = new ymaps.Map("ffff", {
        center: [55.74077834448158,37.66045400193285],
        zoom: 18
    });

    myPlacemark = new ymaps.Placemark([55.74077834448158,37.66045400193285], {
        hintContent: 'Москва!',
        balloonContent: 'Столица России'
    });

    myMap.geoObjects.add(myPlacemark);
}

