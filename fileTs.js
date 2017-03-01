var MyFile = (function () {
    function MyFile(id, name, parentId, content) {
        this.name = name;
        this.content = content;
        this.id = id;
        this.parentId = parentId;
        this.newCounter = 0;
        this.type = 'file';
    }
    MyFile.prototype.setContent = function (content) {
        this.content = content;
        return true;
    };
    MyFile.prototype.getParentId = function () {
        return this.parentId;
    };
    MyFile.prototype.getId = function () {
        return this.id;
    };
    MyFile.prototype.getType = function () {
        return this.type;
    };
    MyFile.prototype.rename = function (newName) {
        this.name = newName;
    };
    MyFile.prototype.getContent = function () {
        return this.content;
    };
    return MyFile;
}());
//# sourceMappingURL=fileTs.js.map