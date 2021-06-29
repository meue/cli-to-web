class ExternalTemplate {
    constructor(moduleID, URL) {
        this.moduleID = moduleID;
        this.URL = URL;
    }

    /**
     * @returns {string}
     */
    getObject() {
        const result = {
            iframeURL: this.URL,
            iframeId: this.moduleID
        };
        console.log(result.iframeId);
        console.log(result.iframeURL);
        return result;
    }
}

module.exports = ExternalTemplate;