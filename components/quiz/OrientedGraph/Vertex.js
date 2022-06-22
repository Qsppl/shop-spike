'use strict';

export class Vertex {
    constructor(value) {
        this.value = value;
        this.pointers = {};
    }

    addPointer(to, value) {
        if (!(to instanceof Vertex)) throw TypeError(`грань ${value} графа должна указывать на вершину, но был передан ${to}`);
        this.pointers[value] = to;
        return true;
    }

    to(value) { return this.pointers[value]; }
}