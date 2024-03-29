var socket = io();
var progresses = [];
var tasks = [];
var messageData = null;

socket.on('question', function (msg) {
    var task = JSON.parse(msg);
    newTask(task);
});

socket.on('removeTask', function (msg) {
    var task = JSON.parse(msg);
    removeTask(task);
});

socket.on('done', function (msg) {
    var data = JSON.parse(msg);
    var content = document.createElement("div");
    content.innerHTML = data.taskData;
    createBox(content, "done");
});

socket.on('message', function (msg) {
    var data = JSON.parse(msg);
    var content = document.createElement("div");
    content.innerHTML = data.taskData;
    createBox(content, "notify");
});

socket.on('error', function (msg) {
    var data = JSON.parse(msg);
    var content = document.createElement("div");
    content.innerHTML = data.taskData;
    createBox(content, "error");
});

socket.on('warning', function (msg) {
    var data = JSON.parse(msg);
    var content = document.createElement("div");
    content.innerHTML = data.taskData;
    createBox(content, "warning");
});

socket.on('progress', function (msg) {
    var json = JSON.parse(msg);
    var id = json.id;
    var percent = json.progress;
    var html = json.taskData.html;
    if (!html) {
        html = "";
    }

    /** @type {Progress} */
    var progress = progresses[id];
    if (progress) {
        // update progress
        if (html) {
            progress.setHTML(html);
        }
        progress.setProgress(percent);
        return;
    }

    // create new progress
    progress = new Progress();
    progress.setHTML(html);
    progress.setProgress(percent);
    progresses[id] = progress;

});

function newTask(json) {

    // TODO: move to class
    const id = json.id;
    const clientData = json.taskData;
    var content = document.createElement("div");
    addHTML(content, clientData);
    var box = createBox(content, "");

    var okButton = document.createElement("input");
    var result = {};
    okButton.value = "Submit";
    okButton.type = "button";
    okButton.className = "submit";
    okButton.addEventListener("click", function () {
        if (messageData !== null) {
            result["values"] = [messageData];
            result["id"] = id;
            const jsonData = JSON.stringify(result);
            socket.emit('taskDone', jsonData);
        } else {
            var inputs = getInputFields(content);
            var iframes = getIframes(content);
            var values = [];
            for (var i = 0; i < inputs.length; i++) {
                var input = inputs[i];
                let value = input.value;

                if (input == okButton) {
                    continue;
                }
                if (input.type === "checkbox") {
                    value = input.checked;
                }
                if (input.type === "select-multiple") {
                    value = getValuesFromSelect(input);
                }
                values.push({ 'id': input.id, 'value': value });
            }
            const iframeValues = getValuesFromIframes(iframes);
            values = values.concat(iframeValues);
            result["values"] = values;
            result["id"] = id;
            socket.emit('taskDone', JSON.stringify(result));
        }
    })
    content.appendChild(okButton);
    tasks[id] = box;
}

function getValuesFromSelect(select) {
    const result = [];
    const options = select.options;

    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (option.selected) {
            result.push(option.value);
        }
    }
    return result;
}

function addHTML(container, nodeData) {
    if (nodeData.type === "iframe") {
        const iframe = document.createElement("iframe");
        const api = getAPI(iframe, nodeData.parameters);
        iframe.id = nodeData.iframe.iframeId;
        iframe.src = nodeData.iframe.iframeURL;
        iframe.allowtransparency = "true";
        iframe.frameborder = "0";
        iframe.seamless = "true";

        const eventMethod = window.addEventListener;
        const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';

        window.addEventListener(messageEvent, function (e) {
            if (e.data.message === 'loaded') {
                console.log('loaded!');
            }

            if (e.data.message === 'setHeight') {
                iframe.style.height = e.data.height + 'px';
            }

            if (e.data.message === 'setData') {
                messageData = e.data.data;
            }
        });

        container.appendChild(iframe);

        iframe.onload = function () {
            let hasAccess = canAccessIFrame(iframe);
            if (hasAccess) {
                injectAPI(iframe, api);
            } else {
                document.getElementById(nodeData.iframe.iframeId).contentWindow.postMessage({
                    message: 'init'
                }, "*");
            }
        }

        return;
    }
    container.innerHTML = nodeData.html;
}

function canAccessIFrame(iframe) {
    var html = null;
    try {
        // deal with older browsers
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        html = doc.body.innerHTML;
    } catch (err) {
        // do nothing
    }

    return (html !== null);
}

function getIframes(content) {
    return content.getElementsByTagName("iframe");
}

function getValuesFromIframes(iframes) {
    let result = [];
    for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        const values = getValuesFromIframe(iframe);
        result = result.concat(values);
    }
    return result;
}

function getValuesFromIframe(iframe) {
    const content = iframe.contentWindow.document;
    const values = [];
    const inputs = getInputFields(content);
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        values.push({ 'id': input.id, 'value': input.value });
    }
    return values;
}

function getInputFields(container) {
    let fields = [];
    fields = fields.concat(Array.from(container.getElementsByTagName("input")));
    fields = fields.concat(Array.from(container.getElementsByTagName("select")));
    return fields;
}

function removeTask(json) {
    const id = json.id;
    const box = tasks[id];
    box.remove();
    tasks[id] = undefined;
}

function createBox(content, type) {
    var taskContainer = document.getElementById("tasks");
    var task = document.createElement("div");

    task.className = "task " + type;
    task.appendChild(content);
    taskContainer.appendChild(task);
    return task;
}

function injectAPI(iframe, api) {
    const win = iframe.contentWindow;
    win.api = api;
    api.rescale();
    win.dispatchEvent(new Event("apiLoaded"));
}

function getAPI(iframe, nodeParams) {
    const api = {};
    api.rescale = function () { rescaleIframe(iframe) };
    api.getIframe = function () { return iframe };
    api.getNodeParams = function () { return nodeParams };
    api.submit = function (iframeValues) { /* TODO */ };
    api.addSubmitButton = function () { /* TODO */ };
    return api;
}

function rescaleIframe(iframe) {
    const doc = iframe.contentDocument;
    const height = doc.getElementsByTagName("html")[0].offsetHeight;
    iframe.style.height = height + "px";
}

class Progress {
    constructor() {
        this.contentWrapper = document.createElement("div");
        this.content = document.createElement("div");
        this.bar = document.createElement("div");
        this.fill = document.createElement("div");

        this.bar.className = "bar";
        this.fill.className = "fill";

        this.contentWrapper.appendChild(this.content);
        this.contentWrapper.appendChild(this.bar);
        this.bar.appendChild(this.fill);

        this.node = createBox(this.contentWrapper, "progress");
    }

    setProgress(percent) {
        this.bar.classList.remove("indetermined");
        this.bar.classList.remove("invisible");

        if (percent === -1) {
            this.bar.classList.add("indetermined");
            this.fill.style.width = "";
            return;
        }
        if (percent === -2) {
            this.bar.classList.add("invisible");
            return;
        }
        this.fill.style.width = percent + "%";
    }

    setHTML(html) {
        this.content.innerHTML = html;
    }

    getNode() {
        return this.node;
    }
}