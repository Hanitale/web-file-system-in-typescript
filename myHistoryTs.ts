class MyHistory{
    myHistoryArray  :Array< Folder>;
    hereAndNow : number;
    historySelf : MyHistory;
    currentFolder : Folder;

    constructor(){
        this.myHistoryArray = [];
        this.hereAndNow = -1;
        this.historySelf = this;
        this.currentFolder;

    }


goBack (){
    if (this.historySelf.hereAndNow > 0) {
        this.currentFolder = this.historySelf.myHistoryArray[--this.historySelf.hereAndNow];
    }
}

goForward(){
    if (this.historySelf.hereAndNow < this.historySelf.myHistoryArray.length - 1) {
        this.currentFolder = this.historySelf.myHistoryArray[++this.historySelf.hereAndNow];
    }
}

addToHistory = function(changeHistory : boolean, currentFolder: Folder) {
    var isEmpty = this.myHistoryArray.length == 0;
    var isNotSame = this.myHistoryArray[this.hereAndNow] != currentFolder;
    var isEnd = this.hereAndNow == this.myHistoryArray.length - 1;
    if (isEnd && isNotSame) {
        this.myHistoryArray.push(currentFolder);
        this.hereAndNow++;
    } else if (changeHistory) {
        this.myHistoryArray.splice(this.hereAndNow+1, this.myHistoryArray.length - this.hereAndNow);
        if (isNotSame) {
            this.myHistoryArray.push(currentFolder);
        }
    }
}



}

