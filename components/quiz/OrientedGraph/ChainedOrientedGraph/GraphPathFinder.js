'use strict';

export class GraphPathFinder {
    /**
     * @param {ChainedOrientedGraph} graph
     */
    constructor(graph) {
        this._chainPointer = graph.mainChain;
        this._vertexPointer = this._chainPointer.first;
        this._path = [this._vertexPointer];
    }

    next(value) {
        this._vertexPointer;
    }

    prev(value) { }
}