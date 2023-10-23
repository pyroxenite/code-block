class BlockElement extends HTMLElement {
    constructor() {
        super();
        this.classList.add("block");
        //this.querySelectorAll("")
        this.blockContent = [...this.children].filter(el => el.tagName.toLowerCase() == "block-content")[0];
        if (this.blockContent == null) {
            this.blockContent = document.createElement("block-content");
            this.prepend(this.blockContent);
        }
    }

    connectedCallback() {
        this.updatePosition();
    }

    setPosition(position) {
        this.setAttribute("position", `${position.x},${position.y}`);
        this.updatePosition();
    }

    updatePosition() {
        const position = this.getAttribute('position');
        if (position) {
            const [dataX, dataY] = position.split(',').map(Number);
            this.style.setProperty('--x-position', dataX + 'px');
            this.style.setProperty('--y-position', dataY + 'px');
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'position' && oldValue !== newValue) {
            this.updatePosition();
        }
    }

    static get observedAttributes() {
        const attributeNames = [];
        if (this.attributes) {
            for (const attr of this.attributes) {
                attributeNames.push(attr.name);
            }
        }
        return attributeNames;
    }
}
