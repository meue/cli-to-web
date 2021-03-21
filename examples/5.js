const ui = require("../src/CliToWeb");
const templateId = "myForm";
const templatePath = __dirname + "/5-template";

// opens the browser. you dont need to call show in the beginning. You can also join later or open the page manually
ui.show();

ui.registerTemplate(templateId, templatePath);
askTemplate();

async function askTemplate() {
    const myCustomQuestion = new ui.Template(templateId, 100);
    const answer = await ui.ask(myCustomQuestion);
    console.log("Your values:");
    console.log(answer.getValue("valuesFromIframe1"));
    console.log(answer.getValue("valuesFromIframe2"));
    console.log(answer.getValue("valuesFromIframe3"));
    ui.tell("Thank you");
}