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
        // TODO: send jsons, not html
        let html = "<div class='questionPart'>";
        html += `<h2>${text}</h2>`;
        html += `<input id="${valueId}" type="number" min="${min}" max="${max}" />`;
        html += "</div>";
        this.questionObjects.push(html);
    }

    /**
     * @param {string} valueId 
     * @param {string} text 
     * @param {number} maxLength 
     */
    addString(valueId, text, maxLength) {
        // TODO: send jsons, not html
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
        // TODO: send jsons, not html
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