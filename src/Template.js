class Template {
    constructor(moduleID, height) {
        this.moduleID = moduleID;
        this.height = height;
    }

    /**
     * @param {object} parameters
     * @returns {string}
     */
    getObject() {
        const path = "/" + this.moduleID;
        const result = {
            iframeHeight: this.height,
            iframeURL: path + "/index.html",
            iframeId: this.moduleID
        };
        return result;
    }
}

module.exports = Template;