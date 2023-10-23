function html(s, ...l) {
    let output = ""
    for (let i = 0; i < s.length - 1; i++) {
        output += s[i] + l[i]
    }
    return (output + s[s.length - 1]).trim();
}

function sigmoid(c, t, x) {
    return Math.tanh((x - c) / t) / 2 + 0.5;
}

function flatten(s, seperator) {
    seperator = seperator ?? "-";
    return s.toLowerCase()
        .normalize("NFD")
        .replace(/['‘’]/g, " ")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z\s0-9-_/]/g, "")
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/ /g, seperator);
}

function httpPost(url, data) {
    return fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

function httpDelete(url, data) {
    return fetch(url, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function setObjectProperty(obj, path, value) {
    let keys = path.split(".");
    let objToBeModified = obj;
    for (let key of keys.slice(0, -1)) {
        if (objToBeModified[key] == null) {
            objToBeModified[key] = {};
        }
        objToBeModified = objToBeModified[key];
    }
    objToBeModified[keys[keys.length-1]] = value;
}

function getObjectProperty(obj, path) {
    let keys = path.split(".");
    let objToBeModified = obj;
    for (let key of keys.slice(0, -1)) {
        if (objToBeModified[key] == null) {
            return undefined;
        }
        objToBeModified = objToBeModified[key];
    }
    return objToBeModified[keys[keys.length-1]];
}

function addSpacesToNumber(number, seperator) {
    if (seperator == null) {
        seperator = " ";
    }
    if (typeof(number) == "number") {
        number = number.toString();
    }
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
}

function getObjectByKey(array, key, value) {
    if (typeof array == "object" && !Array.isArray(array)) {
        array = Object.keys(array).map(key => array[key]);
    }
    for (let obj of array) {
        if (obj[key] == value)
            return obj;
    }
    return null;
}

function isChild(obj, parent) {
    while (obj != null && obj.tagName.toUpperCase() != 'BODY') {
        if (obj == parent) {
            return true;
        }
        obj = obj.parentNode;
    }
    return false;
}