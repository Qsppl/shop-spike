'use strict';

export class IUserInputSource {
    /**
     * Сюда присваивается callback - вызовется когда интерактивный компонент посчитает что пользователь передал какую-то часть конечных данных. Сам не определяет подходят ли эти данные;
     * @param {IUserInputSource}
     */
    onUserFilledField(inputSource) { }

    /** @returns {Map<String, String|null>} Map<name, value|null> */
    getResponse() {
        if (typeof this.name !== 'string' || typeof this.value !== 'string') return new Map([[this.name, null]]);
        return new Map([[this.name, this.value]]);
    }

}