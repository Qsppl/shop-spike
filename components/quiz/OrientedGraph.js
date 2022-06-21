'use strict'

class OrientedGraph {
    constructor() {
        this._edges = new Map();
        this._vertexes = new Map();
    }

    addVertex(key, value) {
        this._vertexes.set(key, new OGVertex(value));
    }

    addEdge(from, to, value) {
        if (!this._vertexes.has(from) || !this._vertexes.has(to)) return false;
        if (this._vertexChains.has(value)) { this._vertexChains.get(value).addEdge(from, to, value) }

        return from.addPointer(to, value);
    }
}

class OGVertex {
    constructor(value) {
        this.value = value;
        this.pointers = {};
    }

    addPointer(to, value) {
        if (!(to instanceof OGVertex)) throw TypeError(`грань ${value} графа должна указывать на вершину, но был передан ${to}`);
        this.pointers[value] = to;
        return true;
    }

    to(value) { return this.pointers[value]}
}

class OGVertexChain {
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

class ChainedOrientedGraph extends OrientedGraph {
    constructor(mainChain = 'main') {
        super();
        
        this._vertexChains = new Map();

        this.mainChainName = mainChain
        this.createVertexChain(this.mainChainName);
    }

    /**
     * @param {string} name 
     */
    createVertexChain(chainName = new Symbol()) {
        if (typeof chainName !== 'string' && typeof chainName !== 'symbol') throw new TypeError(`Имя сценария дожно быть строкой, но был передан ${chainName}`);
        this._vertexChains.set(chainName, new OGVertexChain());
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

    addEdgeInChain(vertex, chainName = this.mainChainName) {
        let chain = this._vertexChains.get(chainName);
        this.addEdge(chain.last, vertex, chainName)
    }

    /**
     * @returns {OGVertexChain}
     */
    get mainChain() { return this._vertexChains.get(this.mainChainName) }
}

class GraphPathFinder {
    /**
     * @param {ChainedOrientedGraph} graph
     */
    constructor(graph) {
        this._chainPointer = graph.mainChain;
        this._vertexPointer = this._chainPointer.first;
        this._sequence = [this._vertexPointer];
    }

    next(value) {
        this._vertexPointer
    }

    prev(value) {}
}