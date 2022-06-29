'use strict';

class IUserInputSource {
    /**
     * Сюда присваивается callback - вызовется когда интерактивный компонент посчитает что пользователь передал какую-то часть конечных данных. Сам не определяет подходят ли эти данные;
     * @param {IUserInputSource}
     */
    onUserFilledField(inputSource) { }

    /** @returns {Set<String, String>|Set<null, null>} Set<key, value>|Set<null, null> */
    getResponse() {
        if (typeof this.name !== 'string' || typeof this.value !== 'string') return new Set([null, null]);
        return new Set([this.name, this.value]);
    }

}