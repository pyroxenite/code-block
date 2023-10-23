class ActionBlockElement extends BlockElement {
    constructor() {
        super();
        this.actionSlot = [...this.children].filter(el => el.tagName.toLowerCase() == "action-slot")[0];
        if (this.actionSlot == null) {
            this.actionSlot = document.createElement("action-slot");
            this.prepend(this.actionSlot);
        }
    }
}

customElements.define('action-block', ActionBlockElement);