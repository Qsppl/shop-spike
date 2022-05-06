'use strict';

var adresses = {
    "spike1": {
        "name": "Колос – 1",
        "adress": "Проспект&nbsp;Мира, д. 41",
        "phoneNumber": "4-46-26",
        "yCoords": [58.552455, 50.047764]
    },
    "spike2": {
        "name": "Колос – 2",
        "adress": "Сосновая улица, 8к2",
        "phoneNumber": "3-70-92",
        "yCoords": [58.538652, 50.032454]
    },
    "spike3": {
        "name": "Колос – 3",
        "adress": "улица 60 лет Октября, 2",
        "phoneNumber": "6-24-32",
        "yCoords": [58.531080, 50.028157]
    },
    "spike4": {
        "name": "Колос – 4 (закрыт)",
        "adress": "улица 60 лет Октября, 24",
        "phoneNumber": "6-54-20",
        "yCoords": [58.532729, 50.038632]
    },
    "spike5": {
        "name": "Колос – 5",
        "adress": "проспект Мира, 92",
        "phoneNumber": "+7 (922) 968-05-20",
        "yCoords": [58.54296735035301, 50.06586709688948]
    },
    "spike6": {
        "name": "Колос – 6",
        "adress": "пр. Мира, 57",
        "phoneNumber": "5-22-64",
        "yCoords": [58.546884, 50.056835]
    },
    "spike7": {
        "name": "Колос – 7",
        "adress": "улица Ленина, 14",
        "phoneNumber": "2-65-73",
        "yCoords": [58.538828142975774, 50.02541760779567]
    },
    "spike8": {
        "name": "Колос – 8",
        "adress": "улица Алексея Некрасова, 41",
        "phoneNumber": "2-40-48",
        "yCoords": [58.543478689534226, 50.0436007942629]
    },
    "spike9": {
        "name": "Колос – 9",
        "adress": "Сосновая ул, 7",
        "phoneNumber": "2-61-68",
        "yCoords": [58.5470541610379, 50.037104313982006]
    },
    "spike10": {
        "name": "Колос – 10",
        "adress": "улица Володарского, 6",
        "phoneNumber": "6-17-91",
        "yCoords": [58.529877, 50.039269]
    },
    "spike11": {
        "name": "Колос – 11",
        "adress": "проспект Мира, 14",
        "phoneNumber": "4-29-26",
        "yCoords": [58.553976, 50.030870]
    },
    "spike14": {
        "name": "Колос – 14",
        "adress": "проспект Кирова, 16",
        "phoneNumber": "4-46-13",
        "yCoords": [58.55621443445865, 50.03409805599431]
    },
    "spike15": {
        "name": "Колос – 15",
        "adress": "улица Ленина, 2к1",
        "phoneNumber": "6-32-45",
        "yCoords": [58.53237204289427, 50.02043362831237]
    },
    "spike16": {
        "name": "Колос – 16",
        "adress": "Первомайская улица, 16",
        "phoneNumber": "4-27-50",
        "yCoords": [58.553123972228626, 50.04216813567729]
    }
};

// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.
ymaps.ready(init);
function init() {
    const mapCenter = [58.553404622358826, 50.042369949879394]
    // Создание карты.
    var map = new ymaps.Map("map", {
        // Координаты центра карты.
        // Порядок по умолчанию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: mapCenter,
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 14,
        controls: ['fullscreenControl', 'geolocationControl', 'searchControl', 'zoomControl']
    });

    if (getVW() >= 1200) {
        let pixelCenter = map.getGlobalPixelCenter(mapCenter);
        pixelCenter = [
            pixelCenter[0] + getVW() * 0.15,
            pixelCenter[1]
        ];
        let geoCenter = map.options.get('projection').fromGlobalPixels(pixelCenter, map.getZoom());
        map.setCenter(geoCenter)
    }

    map.behaviors.disable('scrollZoom');

    map.geoObjects.add(new ymaps.Placemark([55.694843, 37.435023], {
        balloonContent: 'цвет <strong>носика Гены</strong>',
        iconCaption: 'Очень длиннный, но невероятно интересный текст'
    }));
}

let myMenu1 = document.querySelector('menu')
for (let button of myMenu1.querySelectorAll('.see-on-map')) {
    console.log(button);
    button.addEventListener('click', e => {
        console.log(e.currentTarget.dataset.target);
        if (!e.currentTarget.dataset) return null;
        if (!e.currentTarget.dataset.target) return null;
        let mapIdintefer = e.currentTarget.dataset.target;

        if (map.select(mapIdintefer)) {
            console.log("querySelectorAll('menu-item')", myMenu1.querySelectorAll('.menu-item'));
            for (let menuElement of myMenu1.querySelectorAll('.menu-item')) {
                console.log(menuElement);
                menuElement.classList.remove('selected')
            }

            e.currentTarget.parentElement.classList.add('selected')
        }
    })
}