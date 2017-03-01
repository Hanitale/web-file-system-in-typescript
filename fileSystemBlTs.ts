class MyFileSystem {
    fsFlatArray : Array <Object >;
    fs : Array < MyFile | Folder >;
    lastId : number;
    self : MyFileSystem;
    root : Folder;
    savedFileSystem : Array < MyFile | Folder >;
    path : string;

    constructor(){
        this.root = new Folder(0, 'Root', -1);
        var savedFileSystem = this.readFromLocalStorage();
        if(savedFileSystem){
            this.fs = [savedFileSystem];
        } else{
            this.fs = [this.root];
        }
        this.path ='';
        this.lastId = 0;
     }

readFromLocalStorage() {
        var localStorageContent = localStorage.getItem('fs');
        if (localStorageContent) {
            var fsFlatArray = JSON.parse(localStorageContent);
            var response =  this.restoreFileSystem(fsFlatArray);
        } return response;
    }

restoreFileSystem(fsFlatArray : Array < MyFile| Folder >):Folder {
    var tempArray = [];
    let findLastId = [];
    for(var item of fsFlatArray){
        var itemToAdd: MyFile | Folder
        if(item.type=='folder'){
            itemToAdd   = new Folder(item.id, item.name, item.parentId);
        } else {
            itemToAdd = new MyFile(item.id, item.name, item.parentId, (item as MyFile).content );
        }
        tempArray.push(itemToAdd);
        findLastId.push(item.id);
    }
    for(var restoredItem of tempArray){
        for(var i = 0; i < tempArray.length; i++){
            if(restoredItem.id == tempArray[i].parentId){
                restoredItem.children.push(tempArray[i]);
            }
        }
    }
    var highestId = Math.max.apply(Math, findLastId);
    if(highestId){
    this.lastId = highestId;
    }
    return tempArray[0];
}

flattenArray(fileSystem : Array < MyFile | Folder >){
    for(var item of fileSystem){
        var itemToFlatten: Object;
        if (item.getType()== 'folder') {
             itemToFlatten = {
                id: item.getId(),
                parentId: item.parentId,
                name: item.name,
                type: item.getType(),
            };
        } else  {
            itemToFlatten = {
                id: item.getId(),
                parentId:item.parentId,
                name: item.name,
                type: item.getType(),
                content: (item as MyFile).getContent()};
        }
        console.log(item.name);
        this.fsFlatArray.push(itemToFlatten);
        if((item as Folder).children){
            this.flattenArray((item as Folder).children);
        }
    }
    this.saveToLocalStorage(this.fsFlatArray);

}

saveToLocalStorage(fsFlatArray : Array < Object >){
    var fsContent = JSON.stringify(fsFlatArray);
    localStorage.clear();
    localStorage.setItem('fs', fsContent)
    //responseToUser('FileSystem saved Successfully to LocalStorage');

}

getItem = function (id : number): MyFile | Folder {
    if (id == 0) {
        return this.fs[0];
    } else {
        return this.findById(this.fs[0], id);
    }
}



addFolder(name:string, parentId:number): Folder {
    var parent = (this.getItem(parentId) as Folder);
    if(!name){
        if( parent.newFolderCounter == 0){
            name = 'new Folder'
            parent.newFolderCounter++;
        } else {
            name = 'new Folder'+ parent.newFolderCounter;
            parent.newFolderCounter++;
        }
    }
    var newFolder = new Folder(++this.lastId, name, parentId);
    (parent as Folder).addChild(newFolder);
    this.fsFlatArray = [];
    this.flattenArray(this.fs);
    return newFolder;
}

addFile(name:string, parentId:number, content:string): MyFile {
    var parent = (this.getItem(parentId) as Folder);
    if(!name){
        if( parent.newFileCounter == 0){
            name = 'new File'
            parent.newFileCounter++;
        } else {
            name = 'new File'+ parent.newFileCounter;
            parent.newFileCounter++;
        }
    }
    var newFile = new MyFile(++this.lastId, name, parentId, content);
    (parent as Folder).addChild(newFile);
    this.fsFlatArray = [];
    this.flattenArray(this.fs);
    return newFile;
}

rename(id:number, newName:string): MyFile | Folder {
    var item = this.getItem(id);
    item.rename(newName);
    this.fsFlatArray = [];
    this.flattenArray(this.fs);
    return item;
}

deleteItem (id:number, currentFolder:Folder) {
    var deleted = currentFolder.deleteChild(id);
    this.fsFlatArray = [];
    this.flattenArray(this.fs);
    return deleted;
}

getPath(id : number, fileSystem : Array < MyFile | Folder>) : Folder {
    if (fileSystem) {
        for (var i=0; i<fileSystem.length; i++) {
            if (fileSystem[i].getId() == id) {
                this.path = fileSystem[i].name + '/' + this.path;
                return (fileSystem[i] as Folder);
            }
            else {
                if((fileSystem[i] as Folder).children){
                    var found = this.getPath(id, (fileSystem[i] as Folder).children);
                    if (found) {
                        this.path = fileSystem[i].name + '/' + this.path;
                        return found;
                }
                }
            }
        }
    }
}


findById (item: MyFile | Folder, id: number): MyFile | Folder {
    id = id|| 0;
    if (item.id == id) {
        return item;
    } else {
        if((item as Folder).children){
            for(var child of (item as Folder).children) {
                var found = this.findById(child, id);
                if (found) {
                    return found;
                }
            }
        }
    }
}

findByName(item: MyFile | Folder, name: string): MyFile | Folder {
    if (item.name == name) {
        return item;
    } else {
        if((item as Folder).children){
            for (var child of (item as Folder).children) {
                if (child.name == name) {
                    return child;
                }
            }
        }
    }
}



}


















