const ui = require("../src/CliToWeb");
const commands = [
    "ping 127.0.0.1",
    "arp -a"
];

ui.show();
ui.tell("Tell your remote machine what to do without using ssh oder the terminal");
// Create progress and get progressID
const progressId = ui.showProgress("Idle");

async function showOptions() {
    // Use progressID to update progress
    ui.updateProgress(progressId, -2);
    const commandSelection = new ui.Question();
    commandSelection.addChoice("command", "Which command to run?", commands);
    const answer = await ui.ask(commandSelection);
    const command = answer.getValue("command");

    await runCommand(command);
}

async function runCommand(command) {
    ui.updateProgress(progressId, -1, "running <b>" + command + "</b>, please wait");
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    try {
        const { stdout } = await exec(command);
        ui.updateProgress(progressId, -1, "<b>" + command + "</b> was successfull <br/>" + stdout);
    } catch (error) {
        ui.updateProgress(progressId, -1, "<b>" + command + "</b> failed: <br/>" + error.stderr);
    }
}

async function loop() {
    while (true) {
        await showOptions();
        ui.updateProgress(progressId, 0);
    }
}

loop();