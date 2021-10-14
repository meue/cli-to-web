const { ui, Question } = require("../src/CliToWeb");

ui.show();
let progressId;
let name;

async function askStuff() {
    progressId = ui.showProgress();
    await showIntroduction();
    ui.updateProgress(progressId, 0, "Awesomeness calculator (0/3)");
    await askForName();
    ui.updateProgress(progressId, 33, "Awesomeness calculator (1/3)");
    await askForBirthdate();
    ui.updateProgress(progressId, 66, "Awesomeness calculator (2/3)");
    await askForFavoriteColor();
    ui.updateProgress(progressId, 100, "Awesomeness calculator (3/3)");
    await sleep(500);
    ui.updateProgress(progressId, ui.PROGRESS_INDETERMINED, "Please wait.. need to calculate something.");
    await sleep(2500);
    ui.updateProgress(progressId, ui.PROGRESS_INVISIBLE, "Finished");
    ui.tell(name + ", my calculations tell me that <b>you are awesome!</b>");
    console.log("Everything is done.. and this user is awesome!");
}

async function showIntroduction() {
    ui.updateProgress(progressId, ui.PROGRESS_INVISIBLE, "Hi!");
    await sleep(1500);
    ui.updateProgress(progressId, ui.PROGRESS_INVISIBLE, "I am a wizard to calculate your awesomeness.");
    await sleep(1500);
    ui.updateProgress(progressId, ui.PROGRESS_INVISIBLE, "Please answer 3 simple questions :)");
    await sleep(1500);
}

async function askForName() {
    const question = new Question();
    question.addString("name", "Please tell my your name");
    const answer = await ui.ask(question);
    name = answer.getValue("name");
    console.log("the name is " + name);
    return answer;
}

async function askForBirthdate() {
    const question = new Question();
    question.addDate("date", "When are you born?");
    const answer = await ui.ask(question);
    console.log("born at " + answer.getValue("date"));
    return answer;
}

async function askForFavoriteColor() {
    const question = new Question();
    question.addColor("color", "What is your favorite color?");
    const answer = await ui.ask(question);
    console.log("favorite color is " + answer.getValue("color"));
    return answer;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

askStuff();