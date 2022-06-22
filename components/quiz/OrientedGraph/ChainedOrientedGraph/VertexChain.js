'use strict';

export class VertexChain {
    constructor() {
        this.vartexes = new Set();
        this.first = null;
        this.last = null;
    }

    appendVertex(from, to) {
        if (chainState.first === null) {
            chainState.first = to;
            chainState.last = to;
            this.vartexes.add(to);
            return true;
        }

        if (chainState.last === from) {
            chainState.last = to;
            this.vartexes.add(to);
            return true;
        }

        throw new Error('Нарушена цепочка элементов графа');
    }
}