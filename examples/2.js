const ui = require("../src/CliToWeb");

// opens the browser. you dont need to call show in the beginning. You can also join later or open the page manually
ui.show();

let percent = 0;
// Create progress and get progressID
const progressId = ui.showProgress("Creating stuff");

const interval = setInterval(update, 1000);
function update() {
    // count progress
    percent += 1;
    if (percent >= 100) {
        percent = 100;
        clearInterval(interval);

        // finish progress
        ui.updateProgress(progressId, 100, "Task done");
        ui.tell("Everything is done.");
        return;
    }

    // Use progressID to update progress
    ui.updateProgress(progressId, percent);
}
