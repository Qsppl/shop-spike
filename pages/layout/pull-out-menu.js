class MenuGroup {
    /**
     * @param {Element} menu
     * @param {NodeList} togglers
     */
    constructor(subscribers, togglers) {
        if (!subscribers.length || !subscribers.length) {
            console.warn("Menu group is corrupted!");
            console.log('constructor(subscribers ... ) ', subscribers);
            console.log('constructor(togglers ... ) ', togglers);
        };
        this.subscribers = subscribers;
        this.togglers = togglers;
        this.menuState = false;
        
        this.toggleMenuState = this.toggleMenuState.bind(this);
        for (let toggler of this.togglers) toggler.addEventListener('click', this.toggleMenuState);
        this.updateElementsState()
    }

    toggleMenuState() {
        this.menuState = !this.menuState;
        this.updateElementsState(this.subscribers);
    }

    updateElementsState() {
        for (let element of this.subscribers) this.applyStateToElement(element);
        for (let element of this.togglers) this.applyStateToElement(element);
    }

    /**
     * @param {Element} menu
     */
    applyStateToElement(element) {
        if (this.menuState === true) {
            element.dataset.state="enabled"
        } else {
            element.dataset.state="disabled"
        }
    }
}

const subscribers = document.querySelectorAll(`[state-subscriber="pull-out-menu"]`);
const togglers = document.querySelectorAll(`[data-role="pull-out-menu-toggler"]`);
new MenuGroup(subscribers, togglers);