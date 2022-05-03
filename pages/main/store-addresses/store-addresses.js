
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
}