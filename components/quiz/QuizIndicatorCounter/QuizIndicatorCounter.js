class QuizIndicatorCounter extends VirtualComponent {
    constructor() {
        super();

        this._templateProvider = new TemplateProvider(document.getElementById('quiz-indicator-counter'))
        this.mirrorStorage = new MirrorStorage()
    }
}