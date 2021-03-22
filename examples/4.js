const ui = require("../src/CliToWeb");

// opens the browser. you dont need to call show in the beginning. You can also join later or open the page manually
ui.show();

async function askStuff() {
    // Create Question instance, fill with some values
    const question = new ui.Question();
    question.addString("name", "What is your name?", 50);
    question.addNumber("age", "What is your age?", 1, 99);
    question.addChoice("gender", "What is your gender?", ["girl", "boy"]);
    question.addChoice("from", "Where are you from?", ["Asia", "America", "Africa", "Australia", "Europe"]);
    question.addColor("color", "Whats your hair color?");
    question.addDate("birth", "Whats your birthdate?");
    question.addTime("time", "Whats your current time?");
    question.addRange("sheep", "What is the perfect amount of sheep?", 1, 100);
    question.addCheckbox("checked", "Check if you are awesome?", true);

    // Wait until answer is given
    const answer = await ui.ask(question);

    // Get Answer using ids
    const name = answer.getValue("name");
    const age = answer.getValue("age");
    const gender = answer.getValue("gender");
    const from = answer.getValue("from");
    const hairColor = answer.getValue("color");
    const birth = answer.getValue("birth");
    const time = answer.getValue("time");
    const sheep = answer.getValue("sheep");
    const awesome = answer.getValue("checked") === true;

    // Log something 
    console.log(`${name}, the nice is ${age} years old ${gender} is from ${from}.`);
    console.log(`You have ${hairColor} colored hair`);
    console.log(`You are born on ${birth}`);
    console.log(`Its ${time} o'clock`);
    console.log(`${sheep} sheep.. `);

    if (awesome) {
        console.log(`You are awesome.`);
    } else {
        console.log(`You forgot to confirm that you are awesome.`);
    }
    ui.tell("Thank you.");
}
askStuff();