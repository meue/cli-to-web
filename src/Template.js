class Template {
    constructor(moduleID, height) {
        this.moduleID = moduleID;
        this.height = height;
    }

    getHTML() {
        const path = "/" + this.moduleID;
        const html = `<iframe height="${this.height}" seamless frameborder="0" allowtransparency="true" scrolling="no" src="${path}/index.html" />`;
        return html;
    }
}

module.exports = Template;