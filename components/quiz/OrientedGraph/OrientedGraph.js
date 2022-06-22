'use strict';

import { Vertex } from "./Vertex.js";

export class OrientedGraph {
    constructor() {
        this._edges = new Map();
        this._vertexes = new Map();
    }

    addVertex(key, value) {
        this._vertexes.set(key, new Vertex(value));
    }

    addEdge(from, to, value) {
        if (!this._vertexes.has(from) || !this._vertexes.has(to)) return false;
        if (this._vertexChains.has(value)) { this._vertexChains.get(value).addEdge(from, to, value) }

        return from.addPointer(to, value);
    }
}



