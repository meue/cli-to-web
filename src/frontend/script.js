var socket = io();
var progresses = [];
var tasks = [];
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
    content.innerHTML = data.html;
    createBox(content, "done");
});

socket.on('message', function (msg) {
    var data = JSON.parse(msg);
    var content = document.createElement("div");
    content.innerHTML = data.html;
    createBox(content, "notify");
});

socket.on('error', function (msg) {
    var data = JSON.parse(msg);
    var content = document.createElement("div");
    content.innerHTML = data.html;
    createBox(content, "error");
});

socket.on('warning', function (msg) {
    var data = JSON.parse(msg);
    var content = document.createElement("div");
    content.innerHTML = data.html;
    createBox(content, "warning");
});

socket.on('progress', function (msg) {
    var json = JSON.parse(msg);
    var id = json.id;
    var percent = json.progress;
    var html = json.html;

    /** @type {Progress} */
    var progress = progresses[id];
    if (progress) {
        // update progress
        progress.setHTML(html);
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
    const html = json.html;
    var content = document.createElement("div");
    var box = createBox(content, "");
    content.innerHTML = html;

    var okButton = document.createElement("input");
    okButton.value = "Submit";
    okButton.type = "button";
    okButton.className = "submit";
    okButton.addEventListener("click", function () {
        var inputs = getInputFields(content);
        var iframes = getIframes(content);
        var result = {};
        var values = [];
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];

            if (input == okButton) {
                continue;
            }
            values.push({ 'id': input.id, 'value': input.value });
        }
        const iframeValues = getValuesFromIframes(iframes);
        values = values.concat(iframeValues);
        result["values"] = values;
        result["id"] = id;
        socket.emit('taskDone', JSON.stringify(result));
    })
    content.appendChild(okButton);
    tasks[id] = box;
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
        this.fill.style.width = percent + "%";
    }

    setHTML(html) {
        this.content.innerHTML = html;
    }

    getNode() {
        return this.node;
    }
}