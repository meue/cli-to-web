const ui = require("../src/CliToWeb");
const Question = require("../src/Question");

async function askStuff() {
    // Create Question instance, fill with some values
    const question = new Question();
    question.addString("name", "What is your name?", 50);
    question.addNumber("age", "What is your age?", 1, 99);
    question.addChoice("gender", "What is your gender?", ["girl", "boy"]);
    question.addChoice("from", "Where are you from?", ["Asia", "America", "Africa", "Australia", "Europe"]);

    // Wait until answer is given
    const answer = await ui.ask(question);

    // Get Answer using ids
    const name = answer.getValue("name");
    const age = answer.getValue("age");
    const gender = answer.getValue("gender");
    const from = answer.getValue("from");

    // Log something 
    console.log(`${name}, the nice is ${age} years old ${gender} is from ${from}.`);
    ui.tell("Thank you.");
}
askStuff();