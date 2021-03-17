const ui = require("../src/CliToWeb");

let percent = 0;
// Create progress and get progressID
const progressId = ui.showProgress("Creating stuff");
const interval = setInterval(update, 500);
function update() {
    percent += Math.floor(Math.random() * 10) + 1;
    if (percent >= 100) {
        percent = 100;
        clearInterval(interval);
        ui.updateProgress(progressId, 100, "Task done");
        ui.tell("Everything is done.");
        return;
    }
    // Use progressID to update progress
    ui.updateProgress(progressId, percent);
}

