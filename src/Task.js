const Answer = require("./Answer");

class Task {
    constructor(html, io, type) {
        /** @type {Answer} */ this.answers = null;
        this.state = Task.OPEN;
        this.type = type;
        this.html = html;
        this.progress = 0;
        this.id = Math.floor(Math.random() * 1000000);
        this.promiseFunctions = {};
        this.createPromise();
    }

    createPromise() {
        let promiseResolve, promiseReject;
        this.promise = new Promise(function (resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
        });

        this.promiseFunctions.resolve = promiseResolve;
        this.promiseFunctions.reject = promiseReject;
    }

    getId() {
        return this.id;
    }

    resolve(answers) {
        if (this.state === Task.PENDING) {
            this.state = Task.CLOSED;
            this.answers = new Answer(answers);
            this.promiseFunctions.resolve();
        }
    }

    reject() {
        this.state = Task.FAILED;
        this.promiseFunctions.reject();
    }

    setProgressPercent(percent) {
        this.progress = percent;
    }

    setProgressSteps(current, max) {
        this.progress = Math.floor(current / max * 100);
    }

    /**
     * @returns {Answer} answers
     * */
    async sendToWeb(socket) {
        const taskObject = {
            "id": this.id,
            "html": this.html
        };
        if (this.type === Task.TYPE_PROGRESS) {
            taskObject.progress = this.progress;
        }
        this.state = Task.PENDING;
        socket.emit(this.type, JSON.stringify(taskObject));
        await this.promise;
    }

    sendResolve(socket) {
        const taskObject = {
            "id": this.id
        };
        socket.emit('removeTask', JSON.stringify(taskObject));
    }

    /**
     * @returns {Answer}
     */
    getAnswers() {
        return this.answers;
    }
}

Task.OPEN = "open";
Task.CLOSED = "closed";
Task.PENDING = "pending";
Task.FAILED = "failed";
Task.TYPE_MESSAGE = "message";
Task.TYPE_QUESTION = "question";
Task.TYPE_PROGRESS = "progress";
Task.TYPE_ERROR = "error";
Task.TYPE_WARNING = "warning";

module.exports = Task;