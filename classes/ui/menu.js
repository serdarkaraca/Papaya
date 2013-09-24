
var papaya = papaya || {};
papaya.ui = papaya.ui || {};


papaya.ui.Menu = papaya.ui.Menu || function (label, icon, callback, dataSource, modifier, isRight) {
    this.label = label;
    this.icon = icon;
    this.callback = callback;
    this.dataSource = dataSource;
    this.items = new Array();

    if ((modifier == undefined) || (modifier == null)) {
        this.modifier = "";
    } else {
        this.modifier = modifier;
    }

    this.buttonId = this.label.replace(/ /g,"_").replace("...", "_")+modifier;
    this.menuId = (this.label + "Menu").replace(/ /g,"_").replace("...", "_")+modifier;
    this.isRight = isRight;
}



papaya.ui.Menu.prototype.buildMenuButton = function() {
    $("#"+this.buttonId).remove();

    var html = null;

    if (this.icon) {
        html = "<span id='" + this.buttonId + "' class='unselectable menuIcon imageButton' " + (this.isRight ? " style='float:right'" : "") + ">" +
                "<img style='width:" + papaya.viewer.ColorTable.ICON_SIZE + "px; height:" + papaya.viewer.ColorTable.ICON_SIZE + "px; vertical-align:bottom; ";

        if (this.dataSource.isSelected(this.modifier) && this.dataSource.isSelectable()) {
            html += "border:2px outset #FF5A3D;";
        } else {
            html += "border:2px outset lightgray;";
        }

        html +="' src='" + this.icon + "' /></span>";
    } else {
        html = "<span id='" + this.buttonId + "' class='unselectable menuLabel'>" + this.label + "</span>";
    }

    $("#"+PAPAYA_TOOLBAR_ID).append(html);
    $("#"+this.buttonId).click(bind(this, this.showMenu));

    var menu = this;

    if (this.icon) {
        $("#"+this.buttonId + " > img").hover(
            function(){$(this).css({"border-color":"#FF5A3D"})},
            bind(menu,function(){
                if (menu.dataSource.isSelected(menu.modifier) && menu.dataSource.isSelectable()) {
                    $("#"+menu.buttonId + " > img").css({"border-color":"#FF5A3D"});
                } else {
                    $("#"+menu.buttonId + " > img").css({"border-color":"lightgray"});
                }
            })
        );

        $("#"+this.buttonId + " > img").mousedown(function() {
            $(this).css({ 'border': '2px inset lightgray' });
        });

        $("#"+this.buttonId + " > img").mouseup(function() {
            $(this).css({ 'border': '2px outset lightgray' });
        });
    } else {
        $("#"+this.buttonId).hover(function(){$(this).toggleClass('menuButtonHover');});
    }

    return this.buttonId;
}


papaya.ui.Menu.prototype.setMenuButton = function(buttonId) {
    this.buttonId = buttonId;
}



papaya.ui.Menu.prototype.buildMenu = function() {
    var html = "<ul id='" + this.menuId + "' class='menu'></ul>";
    $("#"+PAPAYA_TOOLBAR_ID).append(html);

    for (var ctr = 0; ctr < this.items.length; ctr++) {
        var buttonHtml = this.items[ctr].buildHTML(this.menuId);
    }
}



papaya.ui.Menu.prototype.addMenuItem = function(menuitem) {
    this.items.push(menuitem);
}



papaya.ui.Menu.prototype.showMenu = function() {
    var isShowing = $("#"+this.menuId).is(":visible");
    this.callback(this.buttonId);
    $("#"+this.menuId).remove();

    if (!isShowing) {
        var button = $("#"+this.buttonId);
        this.buildMenu();
        $("#"+this.menuId).hide();
        showMenu(papayaMain.papayaViewer, button[0], $("#"+this.menuId)[0], this.isRight);
    }
}
