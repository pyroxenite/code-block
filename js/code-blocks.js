document.querySelector(".block-container").addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("value-slot")) {
        return;
    }

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
        e.preventDefault();
        return false;
    }

    const endDrag = (e) => {
        document.body.removeEventListener("mousemove", handleDrag);
        document.body.removeEventListener("mouseup", endDrag);
    }

    document.body.addEventListener("mousemove", handleDrag);
    document.body.addEventListener("mouseup", endDrag);
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