var MyFileSystem = (function () {
    function MyFileSystem() {
        this.getItem = function (id) {
            if (id == 0) {
                return this.fs[0];
            }
            else {
                return this.findById(this.fs[0], id);
            }
        };
        this.root = new Folder(0, 'Root', -1);
        var savedFileSystem = this.readFromLocalStorage();
        if (savedFileSystem) {
            this.fs = [savedFileSystem];
        }
        else {
            this.fs = [this.root];
        }
        this.path = '';
        this.lastId = 0;
    }
    MyFileSystem.prototype.readFromLocalStorage = function () {
        var localStorageContent = localStorage.getItem('fs');
        if (localStorageContent) {
            var fsFlatArray = JSON.parse(localStorageContent);
            var response = this.restoreFileSystem(fsFlatArray);
        }
        return response;
    };
    MyFileSystem.prototype.restoreFileSystem = function (fsFlatArray) {
        var tempArray = [];
        var findLastId = [];
        for (var _i = 0, fsFlatArray_1 = fsFlatArray; _i < fsFlatArray_1.length; _i++) {
            var item = fsFlatArray_1[_i];
            var itemToAdd;
            if (item.type == 'folder') {
                itemToAdd = new Folder(item.id, item.name, item.parentId);
            }
            else {
                itemToAdd = new MyFile(item.id, item.name, item.parentId, item.content);
            }
            tempArray.push(itemToAdd);
            findLastId.push(item.id);
        }
        for (var _a = 0, tempArray_1 = tempArray; _a < tempArray_1.length; _a++) {
            var restoredItem = tempArray_1[_a];
            for (var i = 0; i < tempArray.length; i++) {
                if (restoredItem.id == tempArray[i].parentId) {
                    restoredItem.children.push(tempArray[i]);
                }
            }
        }
        var highestId = Math.max.apply(Math, findLastId);
        if (highestId) {
            this.lastId = highestId;
        }
        return tempArray[0];
    };
    MyFileSystem.prototype.flattenArray = function (fileSystem) {
        for (var _i = 0, fileSystem_1 = fileSystem; _i < fileSystem_1.length; _i++) {
            var item = fileSystem_1[_i];
            var itemToFlatten;
            if (item.getType() == 'folder') {
                itemToFlatten = {
                    id: item.getId(),
                    parentId: item.parentId,
                    name: item.name,
                    type: item.getType(),
                };
            }
            else {
                itemToFlatten = {
                    id: item.getId(),
                    parentId: item.parentId,
                    name: item.name,
                    type: item.getType(),
                    content: item.getContent() };
            }
            console.log(item.name);
            this.fsFlatArray.push(itemToFlatten);
            if (item.children) {
                this.flattenArray(item.children);
            }
        }
        this.saveToLocalStorage(this.fsFlatArray);
    };
    MyFileSystem.prototype.saveToLocalStorage = function (fsFlatArray) {
        var fsContent = JSON.stringify(fsFlatArray);
        localStorage.clear();
        localStorage.setItem('fs', fsContent);
        //responseToUser('FileSystem saved Successfully to LocalStorage');
    };
    MyFileSystem.prototype.addFolder = function (name, parentId) {
        var parent = this.getItem(parentId);
        if (!name) {
            if (parent.newFolderCounter == 0) {
                name = 'new Folder';
                parent.newFolderCounter++;
            }
            else {
                name = 'new Folder' + parent.newFolderCounter;
                parent.newFolderCounter++;
            }
        }
        var newFolder = new Folder(++this.lastId, name, parentId);
        parent.addChild(newFolder);
        this.fsFlatArray = [];
        this.flattenArray(this.fs);
        return newFolder;
    };
    MyFileSystem.prototype.addFile = function (name, parentId, content) {
        var parent = this.getItem(parentId);
        if (!name) {
            if (parent.newFileCounter == 0) {
                name = 'new File';
                parent.newFileCounter++;
            }
            else {
                name = 'new File' + parent.newFileCounter;
                parent.newFileCounter++;
            }
        }
        var newFile = new MyFile(++this.lastId, name, parentId, content);
        parent.addChild(newFile);
        this.fsFlatArray = [];
        this.flattenArray(this.fs);
        return newFile;
    };
    MyFileSystem.prototype.rename = function (id, newName) {
        var item = this.getItem(id);
        item.rename(newName);
        this.fsFlatArray = [];
        this.flattenArray(this.fs);
        return item;
    };
    MyFileSystem.prototype.deleteItem = function (id, currentFolder) {
        var deleted = currentFolder.deleteChild(id);
        this.fsFlatArray = [];
        this.flattenArray(this.fs);
        return deleted;
    };
    MyFileSystem.prototype.getPath = function (id, fileSystem) {
        if (fileSystem) {
            for (var i = 0; i < fileSystem.length; i++) {
                if (fileSystem[i].getId() == id) {
                    this.path = fileSystem[i].name + '/' + this.path;
                    return fileSystem[i];
                }
                else {
                    if (fileSystem[i].children) {
                        var found = this.getPath(id, fileSystem[i].children);
                        if (found) {
                            this.path = fileSystem[i].name + '/' + this.path;
                            return found;
                        }
                    }
                }
            }
        }
    };
    MyFileSystem.prototype.findById = function (item, id) {
        id = id || 0;
        if (item.id == id) {
            return item;
        }
        else {
            if (item.children) {
                for (var _i = 0, _a = item.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var found = this.findById(child, id);
                    if (found) {
                        return found;
                    }
                }
            }
        }
    };
    MyFileSystem.prototype.findByName = function (item, name) {
        if (item.name == name) {
            return item;
        }
        else {
            if (item.children) {
                for (var _i = 0, _a = item.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (child.name == name) {
                        return child;
                    }
                }
            }
        }
    };
    return MyFileSystem;
}());
//# sourceMappingURL=fileSystemBlTs.js.map