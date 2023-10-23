class BlockContainerElement extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("mousemove", (e) => {
            this.querySelector("info-text").innerHTML = `
            ${e.clientX - this.offsetLeft}, ${e.clientY - this.offsetTop}
            `;
        });

        this.addEventListener("mousedown", (e) => this.mouseDown(e));
        this.addEventListener("contextmenu", (e) => this.contextMenu(e));

        this.snapAreas = [];
        this.draggedBlock = null;
        this.draggedBlockPosition = {};
        this.draggedBlockDeltaPosition = {};
        this.mouseMovedDuringClick = false;

        this.contextMenuDiv = document.createElement("context-menu");
        this.contextMenuDiv.classList.add("hidden");
        this.appendChild(this.contextMenuDiv);

        this.updateBooleanHeights();
    }

    getParentBlock(element) {
        while (!element.classList.contains("block") && element != this || element.classList.contains("non-displaceable")) {
            element = element.parentElement;
        }
        if (element.tagName.toLowerCase() == "block-container") {
            return null;
        } else {
            return element;
        }
    }

    mouseDown(e) {
        if (e.button !== 0) {
            return;
        }
        
        this.contextMenuDiv.classList.add("hidden");
        
        let wasMenuItem = e.target.tagName == "menu-item";
        if (wasMenuItem) {
            
        }
        
        this.mouseMovedDuringClick = false;
        
        this.draggedBlock = this.getParentBlock(e.target);
        if (this.draggedBlock == null) return;
        
        if (e.target.tagName.toLowerCase() == "input") {
            // if (e.target.innerHTML.replace(/<\/?br>/g, "\n") != e.target.innerText && e.target.innerText.trim() != "") {
            //     e.preventDefault();
            // }
            return true;
        }
    
        let mouse = {
            x: e.clientX - this.offsetLeft,
            y: e.clientY - this.offsetTop
        }
    
        this.draggedBlockPosition = this.getBlockPositionRelativeToContainer(this.draggedBlock);
        this.draggedBlockDeltaPosition = {
            x: this.draggedBlockPosition.x - mouse.x,
            y: this.draggedBlockPosition.y - mouse.y
        };
        
        this.updateSnapAreas()
    
        this.mouseDragWrapper = (e) => this.mouseDrag(e);
        document.body.addEventListener("mousemove", this.mouseDragWrapper);
        this.endDragWrapper = (e) => this.endDrag(e);
        document.body.addEventListener("mouseup", this.endDragWrapper);
        e.preventDefault();
        return false;
    };

    updateSnapAreas() {
        if (this.draggedBlock.tagName.match(/(action|indented)-block/i)) {
            this.snapAreas = this.querySelectorAll("block-container action-slot");
            this.snapAreas.forEach(snapArea => snapArea.classList.remove("snap"))
            for (let snapArea of this.snapAreas) {
                snapArea.rect = ContainerRect.fromContainerElement(this, snapArea);
                snapArea.rect.setHeight(0);
                
            }
        } else if (this.draggedBlock.tagName.toLowerCase() == "value-block") {
            this.snapAreas = this.querySelectorAll("block-container value-slot:not(:has(value-block))");
            this.snapAreas.forEach(snapArea => snapArea.classList.remove("snap"))
            for (let snapArea of this.snapAreas) {
                snapArea.rect = ContainerRect.fromContainerElement(this, snapArea);
            }
        }
    }

    mouseDrag(e) {
        // let pinchZoom = window.visualViewport.scale ?? 1;
        // this.draggedBlockPosition.x += e.movementX/pinchZoom;
        // this.draggedBlockPosition.y += e.movementY/pinchZoom;

        // this.draggedBlock.style.left = `${this.draggedBlockPosition.x}px`;
        // this.draggedBlock.style.top = `${this.draggedBlockPosition.y}px`;

        this.mouseMovedDuringClick = true;

        if (this.lastChild != this.draggedBlock) {
            this.draggedBlock.remove()
            this.appendChild(this.draggedBlock);
            this.updateSnapAreas();
        }

        requestAnimationFrame(() => {
            this.updateDraggedBlockPosition(e)
            this.updateBooleanHeights();
        })
        e.preventDefault();
        return false;
    }

    updateDraggedBlockPosition(e) {
        let mouse = {
            x: e.clientX - this.offsetLeft,
            y: e.clientY - this.offsetTop
        };

        let blockPosition = {
            x: mouse.x + this.draggedBlockDeltaPosition.x,
            y: mouse.y + this.draggedBlockDeltaPosition.y
        };

        this.draggedBlock.setPosition(blockPosition);

        // this.draggedBlock.style.left = `${blockPosition.x}px`;
        // this.draggedBlock.style.top = `${blockPosition.y}px`;

        this.snapAreas.forEach(snapArea => snapArea.classList.remove("snap"));
        if (this.draggedBlock.tagName.match(/(action|indented)-block/i)) {
            for (let snapArea of this.snapAreas) {
                if (snapArea.rect.contains(blockPosition, 20)) {
                    snapArea.classList.add("snap");
                    break;
                }
            }
        } else if (this.draggedBlock.tagName.toLowerCase() == "value-block") {
            for (let snapArea of this.snapAreas) {
                if (snapArea.rect.contains(blockPosition, 10)) {
                    snapArea.classList.add("snap");
                    break;
                }
            }
        }
    }

    endDrag(e) {
        document.body.removeEventListener("mousemove", this.mouseDragWrapper);
        document.body.removeEventListener("mouseup", this.endDragWrapper);
        let snapArea = this.querySelector("block-container .snap");
        if (snapArea) {
            if (this.draggedBlock instanceof ActionBlockElement) {
                let contents = snapArea.querySelector(".block");
                snapArea.innerHTML = "";
                snapArea.classList.remove("snap");
                snapArea.appendChild(this.draggedBlock);
                if (contents) {
                    this.draggedBlock.actionSlot.appendChild(contents);
                }
            }
            if (this.draggedBlock instanceof ValueBlockElement) {
                let contents = snapArea.querySelector(".block");
                snapArea.innerHTML = "";
                snapArea.classList.remove("snap");
                if (!contents) {
                    snapArea.appendChild(this.draggedBlock);
                    this.updateBooleanHeights();
                }
            }
        }
        setTimeout(() => {
            this.querySelectorAll("block-container .snap").forEach(e => {
                e.classList.remove("snap");
            });
        })
        if (!this.mouseMovedDuringClick) {
            this.querySelectorAll(".selected.block").forEach(block => {
                block.classList.remove("selected");
            })
            this.draggedBlock.classList.add("selected")
        }
    }

    getBlockPositionRelativeToContainer(block) {
        // let x = 0, y = 0;
        // while (block != this) {
        //     x += block.offsetLeft;
        //     y += block.offsetTop;
        //     block = block.offsetParent;
        // }
        // return { x, y };
        let boundingRect = block.getBoundingClientRect();
        return {
            x: boundingRect.x,
            y: boundingRect.y,
        }
    }

    updateBooleanHeights() {
        let booleanValueBlocks = this.querySelectorAll(".boolean");
        booleanValueBlocks.forEach(booleanItem => {
            let itemToBeResized = booleanItem.querySelector("block-content");
            itemToBeResized.style.setProperty("--block-height", itemToBeResized.offsetHeight + "px");
        })
    }

    contextMenu(e)  {
        if (!e.shiftKey) {
            return;
        }
        e.preventDefault();

        let mouse = {
            x: e.clientX - this.offsetLeft,
            y: e.clientY - this.offsetTop
        }

        this.contextMenuDiv.remove()
        this.appendChild(this.contextMenuDiv);

        this.contextMenuDiv.classList.remove("hidden");
        this.contextMenuDiv.style.left = mouse.x + "px";
        this.contextMenuDiv.style.top = mouse.y + "px";

        this.contextMenuDiv.innerHTML = html`
        <menu-item>Cut</menu-item>
        <menu-item>Copy</menu-item>
        <menu-item>Paste</menu-item>
        <menu-item>Delete</menu-item>
        <menu-seperator></menu-seperator>
        <menu-item>Get info...</menu-item>
        `
    };
}

class ContainerRect {
    constructor({ x, y, width, height, container }) {
        if (container) {
            let containerRect = container.getBoundingClientRect();
            this.x = x - containerRect.x;
            this.y = y - containerRect.y;
            this.width = width;
            this.height = height;
            this.top = this.y;
            this.bottom = this.y + height;
            this.left = this.x;
            this.right = this.x + width;
        } else {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.top = this.y;
            this.bottom = this.y + height;
            this.left = this.x;
            this.right = this.x + width;
        }
    }

    static fromContainerElement(container, element) {
        let elRect = element.getBoundingClientRect();
        return new this({ container, x: elRect.x, y: elRect.y, width: elRect.width, height: elRect.height });
    }

    contains(point, tolerance) {
        tolerance = tolerance ?? 0;
        if (point.x < this.left - tolerance) return false;
        if (point.x >= this.right + tolerance) return false;
        if (point.y < this.top - tolerance) return false;
        if (point.y >= this.bottom + tolerance) return false;
        return true;
    }

    setWidth(width) {
        this.width = width;
        this.right = this.left + width;
    }

    setHeight(height) {
        this.height = height;
        this.bottom = this.top + height;
    }
}

customElements.define('block-container', BlockContainerElement);