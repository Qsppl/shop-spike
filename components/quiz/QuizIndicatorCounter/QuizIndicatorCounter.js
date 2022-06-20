class QuizIndicatorCounter extends VirtualComponent {
    constructor() {
        super();

        this._templateProvider = new TemplateProvider(document.getElementById('QuizIndicatorCounter'))
        this.mirrorStorage = new MirrorStorage()
    }
}