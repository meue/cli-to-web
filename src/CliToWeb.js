const express = require('express');
const app = require('express')();
const webserver = require('http').Server(app);
const websocket = require('socket.io')(webserver);
const port = process.env.PORT || 3000;
const open = require('open');
const Answer = require('./Answer');
const Template = require('./Template');
const Question = require('./Question');
const Task = require('./Task');
const TaskManager = require('./TaskManager');
const ExternalTemplate = require('./ExternalTemplate');

class CliToWeb {
    constructor() {
        this.taskManager = new TaskManager();
        this.sockets = [];
        /** @type{Array.<Task>}*/this.tasks = [];
        const self = this;

        app.use('/', express.static(__dirname + '/frontend/'));

        this.webserver = webserver.listen(port, () => {
            console.log(`CLI-to-Web-Server running at http://localhost:${port}/`);
        });

        websocket.on('connection', (socket) => {
            this.initSocketListener(socket);
            self.taskManager.addConnection(socket);
        });
    }

    show() {
        open(`http://localhost:${port}/`);
    }

    finish() {
        this.webserver.close();
    }

    initSocketListener(socket) {
        socket.on('taskDone', msg => {
            const responseObject = JSON.parse(msg);
            this.taskManager.taskDone(responseObject);
        });
    }

    /**
     * @param {String|Question|Template} data html-string or Question or Template
     * @param {object} parameters to be passed to template if used
     * @returns {Answer}
     */
    async ask(data, parameters) {
        let clientData = {};
        // TODO: remove if else if else
        if (data.constructor.name === "Template" || data.constructor === ExternalTemplate) {
            clientData.type = "iframe";
            clientData.iframe = data.getObject();
            clientData.parameters = parameters;
        } else
            if (data.constructor.name === "Question") {
                clientData.type = "html"; // TODO: move to json for consistency
                clientData.html = data.getHTML();
            } else {
                clientData.type = "html";
                clientData.html = data;
            }
        /** @type {Task} */ const task = new Task(clientData, Task.TYPE_QUESTION);
        await this.taskManager.addTask(task);
        return task.getAnswers();
    }

    tell(html) {
        let clientData = {};
        clientData.type = "html";
        clientData.html = html;
        /** @type {Task} */ const task = new Task(html, Task.TYPE_MESSAGE);
        this.taskManager.addTask(task);
    }

    warn(html) {
        let clientData = {};
        clientData.type = "html";
        clientData.html = html;
        /** @type {Task} */ const task = new Task(html, Task.TYPE_WARNING);
        this.taskManager.addTask(task);
    }

    error(html) {
        let clientData = {};
        clientData.type = "html";
        clientData.html = html;
        /** @type {Task} */ const task = new Task(html, Task.TYPE_ERROR);
        this.taskManager.addTask(task);
    }

    /**
     * @param {atring} html 
     * @returns {number}
     */
    showProgress(html) {
        let clientData = {};
        clientData.type = "html";
        clientData.html = html;
        /** @type {Task} */ const task = new Task(clientData, Task.TYPE_PROGRESS);
        return this.taskManager.addMessage(task);
    }

    /**
     * 
     * @param {number} id 
     * @param {number} percent 
     * @param {string} html optional
     * @returns 
     */
    updateProgress(id, percent, html) {
        const task = this.taskManager.getTaskById(id);
        task.setProgressPercent(percent);
        if (html) {
            task.clientData.html = html;
        }
        this.taskManager.updateMessage(task);
    }

    /**
     * @param {number} id 
     * @param {string} path 
     * @param {number} height 
     * @param {boolean} isURL
     * @returns {Template}
     */
    registerTemplate(id, path, isURL) {
        if (!isURL) {
            app.use('/' + id, express.static(path));
            return new Template(id);
        }

        return new ExternalTemplate(id, path);
    }

    get PROGRESS_INDETERMINED() { return -1 };
    get PROGRESS_INVISIBLE() { return -2 };
};

const ui = new CliToWeb();

module.exports = { ui, Question, Answer, Template };