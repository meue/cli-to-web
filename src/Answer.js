class Answer {
    constructor(answersObject) {
        this.answers = [];
        for (var i = 0; i < answersObject.length; i++) {
            const answer = answersObject[i];
            const id = answer.id;
            const value = answer.value;
            this.answers[id] = value;
        }
    }

    getValue(id) {
        return this.answers[id];
    }
}

module.exports = Answer;