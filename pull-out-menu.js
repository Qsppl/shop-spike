class MenuGroup {
    /**
     * @param {Element} menu
     * @param {NodeList} togglers
     */
    constructor(menu, togglers) {
        if (!menu) {console.warn(`MenuGroup required menuElement but passed ${menu}`); return false};
        this.menu = menu;
        this.togglers = togglers;

        this.menuState = false;
        if (menu.classList.contains('hidden')) null;
        else if (menu.classList.contains('shown')) this.menuState = true;

        this.toggleMenuState = this.toggleMenuState.bind(this);

        for (let toggler of this.togglers) toggler.addEventListener('click', this.toggleMenuState);
        this.applyMenuState(this.menu);
        this.applyTogglersState(this.togglers);
    }

    toggleMenuState() {
        this.menuState = !this.menuState;
        this.applyMenuState(this.menu);
        this.applyTogglersState(this.togglers);
    }

    /**
     * @param {Element} menu
     */
    applyMenuState(menu) {
        if (this.menuState === true) {
            menu.classList.remove('hidden');
            menu.classList.add('shown');
        } else {
            menu.classList.remove('shown');
            menu.classList.add('hidden');
        }
    }

    /**
     * 
     * @param {NodeList} togglers 
     */
    applyTogglersState(togglers) {
        for (let toggler of togglers) {
            if (this.menuState === true) {
                toggler.classList.remove('show');
                toggler.classList.add('hidde');
            } else {
                toggler.classList.remove('hidde');
                toggler.classList.add('show');
            }
        }
    }
}

const menu = document.querySelector(`[data-role="pull-out-menu"]`);
const togglers = document.querySelectorAll(`[data-role="pull-out-menu-toggler"]`);
new MenuGroup(menu, togglers);