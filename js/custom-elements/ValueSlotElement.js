class ValueSlotElement extends HTMLElement {
    constructor() {
        super();
        this.input = document.createElement("input");
        this.ghostInput = document.createElement("div");
        this.ghostInput.classList.add("ghost-input")
        if (this.children.length == 0) {
            this.input.value = this.innerText;
            this.ghostInput.innerText = this.innerText;
            this.innerText = "";   
        }
        this.prepend(this.input);
        this.prepend(this.ghostInput);
        let updateGhostInput = e => {
            this.ghostInput.innerText = this.input.value;
        };
        this.input.addEventListener("input", updateGhostInput);
        this.mutationObserver = new MutationObserver((mutationList, observer) => {
            // console.log(mutationList, observer)
            for (let mutation of mutationList) {
                if (mutation.addedNodes.length == 0 && mutation.removedNodes[0] instanceof ValueBlockElement) {
                    console.log(mutation)
                    if (!this.input.isConnected)
                        this.prepend(this.input);
                    if (!this.ghostInput.isConnected)
                        this.prepend(this.ghostInput);
                }
            }
        });
        this.mutationObserver.observe(this, { childList: true });
    }
}

customElements.define('value-slot', ValueSlotElement);