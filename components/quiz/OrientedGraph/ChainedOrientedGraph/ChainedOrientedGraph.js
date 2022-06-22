'use strict';

import { OrientedGraph } from '../OrientedGraph.js';
import { VertexChain } from './VertexChain.js';

export class ChainedOrientedGraph extends OrientedGraph {
    constructor(mainChain = 'main') {
        super();

        this._vertexChains = new Map();

        this.mainChainName = mainChain
        this.createVertexChain(this.mainChainName);
    }

    /**
     * @param {string} name 
     */
    createChain(chainName = Symbol()) {
        if (typeof chainName !== 'string' && typeof chainName !== 'symbol') throw new TypeError(`Имя сценария дожно быть строкой, но был передан ${chainName}`);
        this._vertexChains.set(chainName, new VertexChain());
        return chainName;
    }

    addEdge(from, to, value) {
        let edgeIsAdded = super.addEdge(from, to, value);
        if (!edgeIsAdded) return false;
        if (this._vertexChains.has(value)) {
            return this._vertexChains.get(value).appendVertex(from, to, value);
        }
        return true;
    }

    addVertexInChain(vertex, chainName = this.mainChainName) {
        let chain = this._vertexChains.get(chainName);
        this.addEdge(chain.last, vertex, chainName)
    }

    /**
     * @returns {VertexChain}
     */
    get mainChain() { return this._vertexChains.get(this.mainChainName) }
}
