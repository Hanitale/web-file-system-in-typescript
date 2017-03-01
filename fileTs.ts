
class MyFile{

    name : string;
    content : string;
    id : number;
    parentId : number;
    newCounter : number;
    type : string;

    constructor(id:number, name:string, parentId:number, content:string){
        this.name = name;
        this.content = content;
        this.id = id;
        this.parentId = parentId;
        this.newCounter = 0;
        this.type = 'file';
     }

setContent(content:string):boolean {
    this.content = content;
    return true;
}

getParentId():number{
    return this.parentId;
}

getId():number {
    return this.id;
}

getType():string {
    return this.type;
}

rename (newName:string) {
    this.name = newName;
}

getContent():string {
    return this.content;
}

}















