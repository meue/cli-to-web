const Task = require("./Task");
const TaskRoutine = require("./TaskRoutine");

class TaskManager {
    constructor() {
        this.connections = [];
        this.taskRoutines = [];
        /** @type {Array.<Task>} */ this.tasks = [];
    }

    /**
     * @param {Task} task 
     */
    async addTask(task) {
        this.tasks.push(task);
        const taskRoutine = new TaskRoutine();
        this.taskRoutines[task.id] = taskRoutine;
        for (let i = 0; i < this.connections.length; i++) {
            const socket = this.connections[i];
            const promise = task.sendToWeb(socket);
            taskRoutine.addPromise(promise);
        }
        await taskRoutine.waitForAnswer();
        this.broadcastResolve(task);
    }

    /**
     * @param {Task} task
     * @returns {number}
     */
    addMessage(task) {
        this.tasks.push(task);
        for (let i = 0; i < this.connections.length; i++) {
            const socket = this.connections[i];
            task.sendToWeb(socket);
        }
        return task.getId();
    }

    /**
     * @param {Task} task
     * @returns {number}
     */
    updateMessage(task) {
        for (let i = 0; i < this.connections.length; i++) {
            const socket = this.connections[i];
            task.sendToWeb(socket);
        }
    }

    /**
     * @param {Task} task 
     */
    removeTask(task) {
        const index = this.tasks.indexOf(task);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
    }

    addConnection(socket) {
        this.connections.push(socket);
        socket.on('disconnect', () => { this.removeConnection(socket) });
        this.broadcastNewSocket(socket);
    }

    removeConnection(socket) {
        const index = this.connections.indexOf(socket);
        if (index !== -1) {
            this.connections.splice(index, 1);
        }
    }

    taskDone(responseObject) {
        const id = responseObject.id;
        const values = responseObject.values;
        /** @type {Task} */const task = this.getTaskById(id);
        if (task) {
            task.resolve(values);
        }
    }

    broadcastNewSocket(socket) {
        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            const taskRoutine = this.taskRoutines[task.id];
            const promise = task.sendToWeb(socket);
            if (taskRoutine) {
                taskRoutine.addPromise(promise);
            }
        }
    }

    /**
     * @param {Task} task 
     */
    broadcastResolve(task) {
        for (let i = 0; i < this.connections.length; i++) {
            const socket = this.connections[i];
            task.sendResolve(socket);
        }
        const index = this.tasks.indexOf(task);
        this.tasks.splice(index, 1);
    }

    /**
     * @param {*} id 
     * @returns {Task} 
     */
    getTaskById(id) {
        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            if (task.getId() == id) {
                return task;
            }
        }
    }

    getTasks() {
        return this.tasks;
    }
}

module.exports = TaskManager;