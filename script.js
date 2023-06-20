document.querySelector(".block-container").addEventListener("mousedown", (e) => {
    let block = getParentBlock(e.target);

    if (block == null) {
        return;
    }

    block.style.left = `${block.clientLeft + block.offsetLeft}px`;
    block.style.top = `${block.clientTop + block.offsetTop}px`;
    document.querySelector(".block-container").appendChild(block);

    console.log(block.style.left)

    const handleDrag = (e) => {
        let x = (parseFloat(block.style.left) || 0) + e.movementX;
        let y = (parseFloat(block.style.top) || 0) + e.movementY;
        block.style.left = `${x}px`;
        block.style.top = `${y}px`;
    }

    const endDrag = (e) => {
        document.querySelector(".block-container").removeEventListener("mousemove", handleDrag);
        document.querySelector(".block-container").removeEventListener("mouseup", endDrag);
    }

    document.querySelector(".block-container").addEventListener("mousemove", handleDrag);
    document.querySelector(".block-container").addEventListener("mouseup", endDrag);
});

function getParentBlock(element) {
    while (!element.classList.contains("block") && !element.classList.contains("block-container")) {
        element = element.parentElement;
    }
    if (element.classList.contains("block-container")) {
        return null;
    } else {
        return element;
    }
}

document.querySelectorAll(".block-container > .block").forEach(block => {
    block.style.left = block.style.left || `0px`;
    block.style.top = block.style.top || `0px`;
});