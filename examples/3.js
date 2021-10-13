const { ui, Answer } = require("../src/CliToWeb");

// opens the browser. you dont need to call show in the beginning. You can also join later or open the page manually
ui.show();

async function askStuff() {
	let progressId;
	progressId = ui.showProgress("Some intense processing ... ");
	await ui.ask("press ok to continue");
	ui.updateProgress(progressId, 33, "Some intense processing (1/3) ... ");

	// You can also pass your own html as a question instead of question-object. Make sure, ids are set for inputs or selects
	// Still you might want to use the way over the question-class for a more unified look
    /** @type {Answer}*/ const answer1 = await ui.ask("Question2 to help the progress: <input type='text' id='value1' value='' />");
	ui.updateProgress(progressId, 66, "Some intense processing (2/3) ... ");
    /** @type {Answer}*/ const answer2 = await ui.ask("Question3 to help the progress: <input type='text' id='value1' value='' />");

	// get your answers by accessing ids from html-inputs/selects
	ui.tell("Your answers are: " + answer1.getValue("value1") + " and " + answer2.getValue("value1"));
	ui.updateProgress(progressId, 100, "Some intense processing (3/3) ... ");
	ui.tell("I am done. Thank you!");
}

askStuff();