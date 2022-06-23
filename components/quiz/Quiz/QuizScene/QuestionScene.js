'use strict';

import { InputGroupInContainer } from "../../../InputGroup/InputGroupInContainer";

export class QuizScene extends InputGroupInContainer {
    constructor(inputs, title, subtitle, beginningCounter, endCounter) {
        super(inputs);

        // set states
        let st = this.mirrorStorage;
        st.title = title;
        st.subtitle = subtitle;
        st.beginningCounter = beginningCounter;
        st.endCounter = endCounter;
    }

    createHTML() {
        let html = super.createHTML();

        return html;
    }
}