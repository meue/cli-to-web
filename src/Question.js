class Question {
    constructor() {
        this.questionObjects = [];
    }

    /**
     * @param {string} valueId 
     * @param {string} text 
     * @param {number} min 
     * @param {number} max 
     */
    addNumber(valueId, text, min, max) {
        let html = "<div class='questionPart'>";
        html += `<h2>${text}</h2>`;
        html += `<input id="${valueId}" type="number" min="${min}" max="${max}" />`;
        html += "</div>";
        this.questionObjects.push(html);
    }

    /**
     * @param {string} valueId 
     * @param {string} text 
     * @param {number} min 
     * @param {number} max 
     */
    addRange(valueId, text, min, max) {
        let html = "<div class='questionPart'>";
        html += `<h2>${text}</h2>`;
        html += `<input id="${valueId}" type="range" min="${min}" max="${max}" />`;
        html += "</div>";
        this.questionObjects.push(html);
    }

    /**
     * @param {string} valueId 
     * @param {string} text 
     * @param {number} maxLength 
     */
    addString(valueId, text, maxLength) {
        let html = "<div class='questionPart'>";
        html += `<h2>${text}</h2>`;
        html += `<input id="${valueId}" type="text" maxlength="${maxLength}" />`;
        html += "</div>";
        this.questionObjects.push(html);
    }

    /**
     * @param {string} valueId 
     * @param {string} text 
     * @param {Array.<string>} choicesArray 
     */
    addChoice(valueId, text, choicesArray) {
        let html = "<div class='questionPart'>";
        html += `<h2>${text}</h2>`;
        html += `<select id="${valueId}">`;
        for (let i = 0; i < choicesArray.length; i++) {
            const element = choicesArray[i];
            html += `<option value="${element}">${element}</option>`;
        }
        html += `</select>`;
        html += "</div>";
        this.questionObjects.push(html);
    }

    /**
     * @param {string} valueId 
     * @param {string} text 
     * @param {Array.<string>} choicesArray 
     */
    addMultipleChoice(valueId, text, choicesArray) {
        const size = choicesArray.length;
        let html = "<div class='questionPart'>";
        html += `<h2>${text}</h2>`;
        html += `<select multiple id="${valueId}" size="${size}">`;
        for (let i = 0; i < size; i++) {
            const element = choicesArray[i];
            html += `<option value="${element}">${element}</option>`;
        }
        html += `</select>`;
        html += "</div>";
        this.questionObjects.push(html);
    }

    addColor(valueId, text) {
        let html = "<div class='questionPart'>";
        html += `<h2>${text}</h2>`;
        html += `<input id="${valueId}" type="color" />`;
        html += "</div>";
        this.questionObjects.push(html);
    }

    addDate(valueId, text) {
        let html = "<div class='questionPart'>";
        html += `<h2>${text}</h2>`;
        html += `<input id="${valueId}" type="date" />`;
        html += "</div>";
        this.questionObjects.push(html);
    }

    addTime(valueId, text) {
        let html = "<div class='questionPart'>";
        html += `<h2>${text}</h2>`;
        html += `<input id="${valueId}" type="time" />`;
        html += "</div>";
        this.questionObjects.push(html);
    }

    addCheckbox(valueId, text, checked) {
        let html = "<div class='questionPart'>";
        html += `<h2>${text}</h2>`;
        html += `<input id="${valueId}" type="checkbox" ` + (checked ? "checked" : "") + `/>`;
        html += "</div>";
        console.log("html: " + html);
        this.questionObjects.push(html);
    }

    /**
     * @param {string} htmlCode 
     */
    addHTML(htmlCode) {
        this.questionObjects.push(htmlCode);
    }

    /**
     * @returns {string}
     */
    getHTML() {
        let html = "";
        for (let i = 0; i < this.questionObjects.length; i++) {
            html += this.questionObjects[i];
        }
        return html;
    }
}

module.exports = Question;