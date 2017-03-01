var MyHistory = (function () {
    function MyHistory() {
        this.addToHistory = function (changeHistory, currentFolder) {
            var isEmpty = this.myHistoryArray.length == 0;
            var isNotSame = this.myHistoryArray[this.hereAndNow] != currentFolder;
            var isEnd = this.hereAndNow == this.myHistoryArray.length - 1;
            if (isEnd && isNotSame) {
                this.myHistoryArray.push(currentFolder);
                this.hereAndNow++;
            }
            else if (changeHistory) {
                this.myHistoryArray.splice(this.hereAndNow + 1, this.myHistoryArray.length - this.hereAndNow);
                if (isNotSame) {
                    this.myHistoryArray.push(currentFolder);
                }
            }
        };
        this.myHistoryArray = [];
        this.hereAndNow = -1;
        this.historySelf = this;
        this.currentFolder;
    }
    MyHistory.prototype.goBack = function () {
        if (this.historySelf.hereAndNow > 0) {
            this.currentFolder = this.historySelf.myHistoryArray[--this.historySelf.hereAndNow];
        }
    };
    MyHistory.prototype.goForward = function () {
        if (this.historySelf.hereAndNow < this.historySelf.myHistoryArray.length - 1) {
            this.currentFolder = this.historySelf.myHistoryArray[++this.historySelf.hereAndNow];
        }
    };
    return MyHistory;
}());
//# sourceMappingURL=myHistoryTs.js.map