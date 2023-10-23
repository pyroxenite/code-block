class IndentedBlockElement extends ActionBlockElement {
    constructor() {
        super();
        for (let child of this.blockContent.children) {
            if (child.tagName.toLowerCase() == "header-block") {
                child.classList.add("non-displaceable");
            }
        }
    }
}

customElements.define('indented-block', IndentedBlockElement);