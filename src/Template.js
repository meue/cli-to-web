class Template {
    constructor(moduleID) {
        this.moduleID = moduleID;
    }

    /**
     * @param {object} parameters
     * @returns {string}
     */
    getObject() {
        const path = "/" + this.moduleID;
        const result = {
            iframeURL: path + "/index.html",
            iframeId: this.moduleID
        };
        return result;
    }
}

module.exports = Template;