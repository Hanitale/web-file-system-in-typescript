class Folder{
    id: number;
    name: string;
    children: Array < MyFile | Folder>;
    parentId: number;
    type: string;
    newFolderCounter: number;
    newFileCounter:number;

    constructor(id, name, parentId){
        this.id = id;
        this.name = name;
        this.children = [];
        this.parentId = parentId;
        this.type = 'folder';
        this.newFolderCounter = 0;
        this.newFileCounter = 0;
    }


deleteChild(id:number):boolean {
    for(var i=0; i< this.children.length; i++){
        if(this.children[i].id ==id){
            this.children.splice(i, 1);
            return true;
        }
    }
}

rename(newName:string) {
    this.name = newName;
}

addChild(item:MyFile | Folder): MyFile | Folder{
    this.children.push(item);
    return item;
}

findChild(id:number): MyFile | Folder {
    for(var child of this.children){
        if(child.id == id){
            return child;
        }
    }
}

getChildren(): Array < MyFile | Folder> {
    return this.children;
}

getId():number {
    return this.id;
}

getType():string {
    return 'folder';
}

getParentId():number{
    return this.parentId;
}

}


