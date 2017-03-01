var UI = (function () {
    function UI(fs, myHistory) {
        this.ROOT_ID = 0;
        this.fs = fs;
        this.myFs = this.fs;
        this.myHistory = myHistory;
        this.root = this.fs.fs[0];
        this.myRoot = this.root;
        this.initialise = this.init();
        this.currentFolder = this.fs.fs[0];
        thisUi = this;
    }
    UI.prototype.init = function () {
        this.buildRoot();
        this.setListeners();
        this.showContent(0, null, null);
        this.setRightClickMenu();
        this.setNavigationButtons();
        this.setAddressLine();
    };
    UI.prototype.buildRoot = function () {
        var htmlToAppend = '<li class="liFolder0"><img class="folderClosed" src="folders.png"> <a href="#" data-id="0" id="aRoot" data-custom ="folder"> Root</a><ul class="collapsed"></ul></li>';
        $('.folderList').append(htmlToAppend);
    };
    UI.prototype.setListeners = function () {
        var parent = $(".folderList");
        parent.on("click", "a", function (e) {
            this.whoClicked = $(e.currentTarget).attr('data-id');
            var id = $(e.currentTarget).attr('data-id');
            this.collapseExpand(id, true);
        }.bind(this));
        var contentItems = $(".content");
        contentItems.on("click", "a", function (e) {
            this.whoClicked = $(e.currentTarget).attr('data-id');
            var id = $(e.currentTarget).attr('data-id');
            if ($(e.currentTarget).attr('data-custom') == 'file') {
                thisUi.open(this.whoClicked);
            }
            else {
                this.showContent(this.whoClicked, null, true);
            }
        }.bind(this));
        $('button.clearFileContent').on('click', function () {
            var fileToClear = thisUi.fs.getItem(thisUi.openFileId);
            thisUi.clearFileContent(fileToClear);
        });
        $('button.saveFileContent').on('click', function () {
            var fileToSave = thisUi.fs.getItem(thisUi.openFileId);
            var saved = fileToSave.setContent($('textarea').val());
            if (saved) {
                $('.textarea').css('display', 'none');
            }
        });
    };
    UI.prototype.setNavigationButtons = function () {
        $('#back-btn').on('click', function () {
            thisUi.myHistory.goBack();
            thisUi.showContent(null, thisUi.myHistory.currentFolder, null);
        });
        $('#forward-btn').on('click', function () {
            thisUi.myHistory.goForward();
            thisUi.showContent(null, thisUi.myHistory.currentFolder, null);
        });
    };
    UI.prototype.collapseExpand = function (id, changeHistory) {
        var whereTo = '.liFolder' + this.whoClicked + '> ul';
        var changeImg = '.liFolder' + this.whoClicked + '> img';
        if ($(whereTo).attr('class') == 'collapsed') {
            $(whereTo).attr('class', 'expanded');
            $(changeImg).attr('class', 'folderOpen');
            this.showFolderList(id, changeHistory);
        }
        else {
            $(whereTo).attr('class', 'collapsed');
            $(changeImg).attr('class', 'folderClosed');
            $(whereTo).empty();
            this.showContent(this.whoClicked, null, changeHistory);
        }
    };
    UI.prototype.showFolderList = function (id, changeHistory) {
        this.currentFolder = this.fs.getItem(id);
        var showChildren = this.currentFolder.getChildren();
        for (var _i = 0, showChildren_1 = showChildren; _i < showChildren_1.length; _i++) {
            var child = showChildren_1[_i];
            if (child.getType() == 'folder') {
                var htmlToAppend = '<li class="liFolder' + child.getId() + '"><img class="folderClosed"> <a href="#" data-id="'
                    + child.getId() + '" data-custom ="folder">'
                    + child.name + '</a><ul class="collapsed"></ul></li>';
                var whereToAppend = '.liFolder' + this.whoClicked + '> ul';
                $(whereToAppend).append(htmlToAppend);
            }
        }
        this.showContent(this.whoClicked, null, changeHistory);
    };
    UI.prototype.showContent = function (id, myHistoryLocation, changeHistory) {
        this.fs.path = '';
        $('li a').removeClass('highlight');
        $('.content').empty();
        if (myHistoryLocation) {
            this.currentFolder = myHistoryLocation;
            id = this.currentFolder.id;
        }
        else {
            this.currentFolder = this.fs.getItem(id);
            this.myHistory.addToHistory(changeHistory, this.currentFolder);
        }
        var getAddressLine = this.fs.getPath(this.currentFolder.id, this.fs.fs);
        this.showAddressLine();
        var toHighLight = this.currentFolder.id;
        $('a[data-id=' + toHighLight + ']').attr('class', 'highlight');
        if (this.currentFolder.children) {
            for (var _i = 0, _a = this.currentFolder.children; _i < _a.length; _i++) {
                var item = _a[_i];
                var liFolder = '<span><a href="#" data-custom ="folder" data-id="' + item.id + '"><img src="folders.png"> '
                    + item.name + '</a></span>';
                var liFile = '<span><a href="#" data-custom ="file" data-id="' + item.id + '"><img src="File.png"> '
                    + item.name + '</a> </span>';
                if (item.getType() == 'folder') {
                    $('.content').append(liFolder);
                }
                else {
                    $('.content').append(liFile);
                }
            }
        }
        this.setRightClickMenu();
        this.updateNavButtons();
    };
    UI.prototype.responseToUser = function (startMessage, Arg1, Arg2, endMessage) {
        var myResponse;
        if (startMessage && Arg1 && !Arg2 && !endMessage) {
            myResponse = Arg1 + startMessage;
        }
        else if (!Arg1 && Arg2) {
            myResponse = startMessage + Arg2;
        }
        else if (endMessage) {
            //responseToUser('Sorry, the name ', newItem ,null, ' is taken.');
            myResponse = startMessage + Arg1 + endMessage;
        }
        else if (!Arg1 && !Arg2) {
            myResponse = startMessage;
        }
        $('.messageArea').text(myResponse);
        setTimeout(this.clearMessage, 3500);
    };
    UI.prototype.clearMessage = function () {
        $('.messageArea').css('display', 'none');
    };
    UI.prototype.createFile = function () {
        var id = $('.right-click-menu').data('id');
        if (id == undefined) {
            id = thisUi.currentFolder.id;
        }
        else {
            thisUi.currentFolder = thisUi.fs.findById(thisUi.myRoot, id);
        }
        var newName = prompt('Enter name of file to add');
        if (newName == null) {
            return;
        }
        else if (newName == '') {
            newName = undefined;
        }
        else {
            var ifExists = thisUi.fs.findByName(thisUi.currentFolder, newName);
        }
        if (!ifExists) {
            var newItem = thisUi.fs.addFile(newName, thisUi.currentFolder.id, null);
            thisUi.open(newItem.id);
            thisUi.showContent(thisUi.currentFolder.id, null, null);
        }
        else {
            thisUi.responseToUser('Sorry, the name "', newName, null, '" is taken.');
        }
        id = undefined;
    };
    UI.prototype.createFolder = function () {
        var id = $('.right-click-menu').data('id');
        if (id == undefined) {
            id = thisUi.currentFolder.id;
        }
        else {
            thisUi.currentFolder = thisUi.fs.findById(thisUi.myRoot, id);
        }
        var newName = prompt('Enter name of folder to add');
        if (newName == null) {
            return;
        }
        else if (newName == '') {
            newName = undefined;
        }
        else {
            var ifExists = thisUi.fs.findByName(thisUi.currentFolder, newName);
        }
        if (!ifExists) {
            var newItem = thisUi.fs.addFolder(newName, thisUi.currentFolder.id);
            thisUi.collapseExpand(thisUi.currentFolder.id, null);
            thisUi.collapseExpand(thisUi.currentFolder.id, null);
            thisUi.showContent(thisUi.currentFolder.id, null, null);
        }
        else {
            thisUi.responseToUser('Sorry, the name "', newName, null, '" is taken.');
        }
        id = undefined;
    };
    UI.prototype.rename = function () {
        var id = $('.right-click-menu').data('id');
        if (id == 0) {
            thisUi.responseToUser('Sorry, cannot change Root directory name', null, null, null);
        }
        else {
            var newName = prompt('Enter new name');
            if (newName == null) {
                return;
            }
            else if (newName == '') {
                thisUi.responseToUser('Sorry, please enter a valid name', null, null, null);
                return;
            }
            var ifExists = thisUi.fs.findByName(thisUi.myRoot, newName);
            if (!ifExists) {
                var renamed = thisUi.fs.rename(id, newName);
                if (renamed) {
                    $('a[data-id=' + id + ']').text(newName);
                    thisUi.showContent(thisUi.currentFolder.id, null, null);
                }
            }
            else {
                thisUi.responseToUser('Sorry, the name ', newName, null, ' is taken.');
            }
        }
        id = undefined;
    };
    UI.prototype.uiDelete = function (id) {
        if (id == 0) {
            this.responseToUser("Root directory cannot be deleted", null, null, null);
        }
        else {
            var itemToDelete = this.fs.findById(this.root, id);
        }
        var areYouSure = confirm('Are you sure you want to delete ' + itemToDelete.name + '?');
        if (!areYouSure) {
            this.responseToUser("Action cancelled", null, null, null);
        }
        else {
            this.folder_to_delete_found = 0;
            this.currentFolder = this.fs.findById(this.fs.fs[0], itemToDelete.getParentId());
            var hasBeenDeleted = this.fs.deleteItem(id, this.currentFolder);
            if (hasBeenDeleted) {
                this.showContent(this.currentFolder.id, null, null);
                this.collapseExpand(this.currentFolder.id, null);
                this.collapseExpand(this.currentFolder.id, null);
                this.responseToUser(" has been deleted", itemToDelete.name, null, null);
            }
            else {
                $('.messageArea').text(itemToDelete.name + " cannot be deleted");
                setTimeout(this.clearMessage, 3000);
            }
        }
        id = undefined;
    };
    UI.prototype.open = function (id) {
        this.openFileId = id;
        var fileToOpen = this.myFs.getItem(id);
        $('.textarea').css('display', 'block');
        $('textarea').attr('data-id', id);
        $('textarea').val(fileToOpen.getContent());
        $('textarea').focus();
        $('.textarea').keyup(function (event) {
            if (event.keyCode == 27) {
                var saved = fileToOpen.setContent($('textarea').val());
                if (saved) {
                    $('.textarea').css('display', 'none');
                }
            }
        });
    };
    UI.prototype.clearFileContent = function (file) {
        $('textarea').val('');
        $('textarea').focus();
        file.setContent('');
    };
    UI.prototype.setRightClickMenu = function () {
        $('[data-custom]').off('contextmenu');
        $('[data-custom]').on('contextmenu', this.setMenu);
        $('.fileSystem').contextmenu(function () { return false; });
        //$(window).click(() => this.hideRightClickMenu);
        $(window).click(function () {
            $('menu.right-click-menu').css('display', 'none');
        });
    };
    UI.prototype.setMenu = function (event) {
        event.stopPropagation();
        // (()=> this.setRightClickMenuItems);
        // (()=> this.showRightClickMenu(event));
        thisUi.setRightClickMenuItems();
        thisUi.showRightClickMenu(event);
        return false;
    };
    UI.prototype.setRightClickMenuItems = function () {
        $('.right-click-menu > menuitem').off('click');
        $('.right-click-menu > .rename').on('click', thisUi.rename);
        $('.right-click-menu > .createFolder').on('click', thisUi.createFolder);
        $('.right-click-menu > .createFile').on('click', thisUi.createFile);
        $('.right-click-menu > .delete').on('click', function () {
            var id = $('.right-click-menu').data('id');
            //(()=> this.uiDelete(id));
            thisUi.uiDelete(id);
        });
        $('.right-click-menu > .open').on('click', function () {
            var id = $('.right-click-menu').data('id');
            thisUi.open(id);
        });
    };
    ;
    UI.prototype.hideRightClickMenu = function () {
        $('menu.right-click-menu').css('display', 'none');
    };
    UI.prototype.updateNavButtons = function () {
        if (this.myHistory.hereAndNow <= 0) {
            $('.back-btn').attr('class', 'back-btn-no-more');
        }
        else {
            $('.back-btn-no-more').attr('class', 'back-btn');
        }
        if (this.myHistory.hereAndNow != this.myHistory.myHistoryArray.length - 1 || this.myHistory.hereAndNow == undefined) {
            $('.forward-btn-no-more').attr('class', 'forward-btn');
        }
        else {
            $('.forward-btn').attr('class', 'forward-btn-no-more');
        }
    };
    UI.prototype.showAddressLine = function () {
        $('.addressLine').val(this.fs.path);
    };
    UI.prototype.setAddressLine = function () {
        $('input.addressLine').keyup(function (event) {
            if (event.keyCode == 13) {
                thisUi.fs.path = $(this).val();
                thisUi.goToAddress(thisUi.fs.path);
            }
        });
    };
    UI.prototype.goToAddress = function (path) {
        var pathElements = path.split('/');
        pathElements[0] = this.myRoot;
        for (var i = 0; i < pathElements.length; i++) {
            if (pathElements[i + 1] != '' && pathElements[i + 1] != undefined) {
                var folder = thisUi.fs.findByName(pathElements[i], pathElements[i + 1]);
                pathElements[i + 1] = folder;
            }
            else {
                break;
            }
        }
        this.showContent(folder.getId(), null, null);
    };
    UI.prototype.showRightClickMenu = function (e) {
        var id = $(e.currentTarget).attr('data-id');
        var type = $(e.currentTarget).attr('data-custom');
        $('menu.right-click-menu').css('display', 'block');
        $('menu.right-click-menu').attr('data-type', type);
        $('menu.right-click-menu').css('left', e.pageX + 'px');
        $('menu.right-click-menu').css('top', e.pageY + 'px');
        $('menu.right-click-menu').data('id', id);
    };
    return UI;
}());
//# sourceMappingURL=fileSystemUiTs.js.map