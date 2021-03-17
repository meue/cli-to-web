class TaskRoutine {
    constructor() {
        this.promises = [];
        this.firstUserJoinedPromise = null;
        const self = this;
        this.userJoinedPromise = new Promise(function (resolve, reject) {
            self.firstUserJoinedPromise = resolve;
        });
    }

    addPromise(promise) {
        this.promises.push(promise);
        this.firstUserJoinedPromise();
    }

    async waitForAnswer() {
        await this.userJoinedPromise;
        await Promise.race(this.promises);
    }
}

module.exports = TaskRoutine;