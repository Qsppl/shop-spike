'use strict';

const shopList = {
    "spike1": {
        "name": "Колос – 1",
        "adress": "Проспект&nbsp;Мира, д. 41",
        "phoneNumber": "4-46-26",
        "coords": [58.552455, 50.047764]
    },
    "spike2": {
        "name": "Колос – 2",
        "adress": "Сосновая улица, 8к2",
        "phoneNumber": "3-70-92",
        "coords": [58.538652, 50.032454]
    },
    "spike3": {
        "name": "Колос – 3",
        "adress": "улица 60 лет Октября, 2",
        "phoneNumber": "6-24-32",
        "coords": [58.531080, 50.028157]
    },
    "spike4": {
        "name": "Колос – 4 (закрыт)",
        "adress": "улица 60 лет Октября, 24",
        "phoneNumber": "6-54-20",
        "coords": [58.532729, 50.038632]
    },
    "spike5": {
        "name": "Колос – 5",
        "adress": "проспект Мира, 92",
        "phoneNumber": "+7 (922) 968-05-20",
        "coords": [58.54296735035301, 50.06586709688948]
    },
    "spike6": {
        "name": "Колос – 6",
        "adress": "пр. Мира, 57",
        "phoneNumber": "5-22-64",
        "coords": [58.546884, 50.056835]
    },
    "spike7": {
        "name": "Колос – 7",
        "adress": "улица Ленина, 14",
        "phoneNumber": "2-65-73",
        "coords": [58.538828142975774, 50.02541760779567]
    },
    "spike8": {
        "name": "Колос – 8",
        "adress": "улица Алексея Некрасова, 41",
        "phoneNumber": "2-40-48",
        "coords": [58.543478689534226, 50.0436007942629]
    },
    "spike9": {
        "name": "Колос – 9",
        "adress": "Сосновая ул, 7",
        "phoneNumber": "2-61-68",
        "coords": [58.5470541610379, 50.037104313982006]
    },
    "spike10": {
        "name": "Колос – 10",
        "adress": "улица Володарского, 6",
        "phoneNumber": "6-17-91",
        "coords": [58.529877, 50.039269]
    },
    "spike11": {
        "name": "Колос – 11",
        "adress": "проспект Мира, 14",
        "phoneNumber": "4-29-26",
        "coords": [58.553976, 50.030870]
    },
    "spike14": {
        "name": "Колос – 14",
        "adress": "проспект Кирова, 16",
        "phoneNumber": "4-46-13",
        "coords": [58.55621443445865, 50.03409805599431]
    },
    "spike15": {
        "name": "Колос – 15",
        "adress": "улица Ленина, 2к1",
        "phoneNumber": "6-32-45",
        "coords": [58.53237204289427, 50.02043362831237]
    },
    "spike16": {
        "name": "Колос – 16",
        "adress": "Первомайская улица, 16",
        "phoneNumber": "4-27-50",
        "coords": [58.553123972228626, 50.04216813567729]
    }
};

/**
 * Контроллер элементов меню с магазинами яндекс-карты
 */
class MapMenu {
    element = undefined;
    buttons = new Map();
    /**
     * @param {Element} element 
     */
    constructor(element) {
        if (!(element instanceof Element)) throw new TypeError(`${element} is not a Element!`);
        this.element = element;
        this.disableButtons = this.disableButtons.bind(this);
    }

    /**
     * 
     * @param {PlacemarkSwitcher} placemarkSwitcher 
     */
    addPlacemarkSwitcher(placemarkSwitcher) {
        if (!(placemarkSwitcher instanceof PlacemarkSwitcher)) throw new TypeError(`${element} is not a PlacemarkSwitcher!`);
        if (this.buttons.has(placemarkSwitcher.element)) return;
        this.buttons.set(placemarkSwitcher.element, placemarkSwitcher);
        placemarkSwitcher.addSwitchControl(this.disableButtons);
    }

    /**
     * 
     * @param {Element} element 
     * @returns {PlacemarkSwitcher | undefined} PlacemarkSwitcher
     */
    getPlacemarkSwitcher(element) {
        if (!(element instanceof Element)) throw new TypeError(`${element} is not a Element!`);
        return this.buttons.get(element)
    }

    disableButtons() {
        for (let pair of this.buttons) pair[1].disable();
        return true;
    }
}

class PlacemarkSwitcher {
    element = undefined;
    placemark = undefined;
    mapController = undefined;
    switchControls = new Set();
    constructor(element) {
        if (!(element instanceof Element)) throw new TypeError(`${element} is not a Element!`);
        this.element = element;
        this.element.dataset.state = "locked";
        this.handleClick = this.handleClick.bind(this);
        this.element.addEventListener('click', this.handleClick);
    }

    setPlacemark(placemark) {
        if (!(placemark instanceof ymaps.Placemark)) throw new TypeError(`${placemark} is not a Placemark!`);
        this.placemark = placemark;
        this.element.dataset.state = "disabled";
    }

    setMapController(mapController) {
        if (!(mapController instanceof MapController)) throw new TypeError(`${mapController} is not a MapController!`);
        this.mapController = mapController;
    }

    addSwitchControl(callback) {
        if (!(callback instanceof Function)) throw new TypeError(`${callback} is not a Function!`);
        this.switchControls.add(callback);
    }

    handleClick = function (e) {
        if (this.element.dataset.state == "locked") return false;
        for (let callback of this.switchControls) if (!callback()) return false;
        this.enable();
        return true;
    }

    enable() {
        if (this.element.dataset.state == "locked") return false;
        if (this.mapController.selectPlacemark(this.placemark)) {
            this.element.dataset.state = "enabled";
            return true;
        }
        this.element.dataset.state = "locked";
        return false;
    }

    disable() {
        if (this.element.dataset.state == "locked") return false;
        this.element.dataset.state = "disabled";
        return true;
    }
}

class MapController {
    map = undefined;
    placemarks = new Set();
    constructor(map) {
        if (!(map instanceof ymaps.Map)) throw new TypeError(`${map} is not a Map!`);
        this.map = map;
        this.setCenter(map.getCenter());
        this.map.behaviors.disable('scrollZoom');
    }

    setCenter(coords) {
        if (typeof coords[0] !== 'number' || typeof coords[1] !== 'number') throw new TypeError(`${coords} invalid coords format!`);
        if (getVW() >= 1200) {
            let pixelCenter = this.map.options.get('projection').toGlobalPixels(coords, this.map.getZoom());
            pixelCenter = [pixelCenter[0] + getVW() * 0.2, pixelCenter[1]];
            let geoCenter = this.map.options.get('projection').fromGlobalPixels(pixelCenter, this.map.getZoom());
            return this.map.panTo(geoCenter, {flying: false});
        }
        return this.map.panTo(coords, {flying: false});
    }

    addPlacemark(placemark) {
        if (!(placemark instanceof ymaps.Placemark)) throw new TypeError(`${placemark} is not a Placemark!`);
        if (this.placemarks.has(placemark)) return true;
        this.placemarks.add(placemark);
        this.map.geoObjects.add(placemark);
    }

    selectPlacemark(placemark) {
        if (!(placemark instanceof ymaps.Placemark)) throw new TypeError(`${placemark} is not a Placemark!`);
        if (!this.placemarks.has(placemark)) return false;
        this.setCenter(placemark.geometry.getCoordinates())
            .then(resolve => {
                placemark.balloon.open();
                resolve();
            })
        return true;
    }
}

function mapSectionInit() {
    let mapMenu = new MapMenu(document.querySelector('[data-role="map-menu"]'));

    for (let button of mapMenu.element.querySelectorAll('[data-role="button"]')) {
        mapMenu.addPlacemarkSwitcher(new PlacemarkSwitcher(button));
    }

    const mapConfig = {
        center: [58.553404622358826, 50.042369949879394],
        // от 0 (весь мир) до 19.
        zoom: 14,
        controls: ['fullscreenControl', 'geolocationControl', 'searchControl', 'zoomControl']
    }
    let mapController = new MapController(new ymaps.Map("map", mapConfig))

    for (let shopId in shopList) {
        const shopInfo = shopList[shopId];

        let buttonElement = mapMenu.element.querySelector(`[data-shop-id="${shopId}"]`);
        let placemarkSwitcher = buttonElement ? mapMenu.getPlacemarkSwitcher(buttonElement) : undefined;

        const placemarkCoords = shopInfo.coords;
        const placemarkConfig = {
            balloonContent: `<h5>${shopInfo.adress}</h5>`,
            iconCaption: shopInfo.name
        };
        let placemark = new ymaps.Placemark(placemarkCoords, placemarkConfig);

        if (placemarkSwitcher) {
            placemarkSwitcher.setPlacemark(placemark);
            placemarkSwitcher.setMapController(mapController);
        }

        mapController.addPlacemark(placemark);
    }
}

ymaps.ready(mapSectionInit);