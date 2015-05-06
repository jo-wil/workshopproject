var UI, Search, Display, Tools, Edit;

/* Main UI Object */

UI = {}

UI.init = function () {

   this.content = $('#content');
   this.content.addClass('pure-g');
   
   this.state = 'build'; // other options are view and edit

   Search.init();
   Display.init();
   Tools.init();
   Edit.init();
   
   UI.render();
   
}

UI.render = function () {

   UI.content.empty();

   if (this.state === 'build' || this.state === 'view') {
      
      Search.render();
      Display.render();
      Tools.render();
      
      UI.content.append(Search.content);
      UI.content.append(Display.content);
      UI.content.append(Tools.content);
   }
   else if (this.state === 'edit') {
      
      Edit.render();
      Display.render();
   
      UI.content.append(Edit.content);
      UI.content.append(Display.content);
   }

}

/* Search Object */

Search = {}

Search.init = function () {

   var content;

   content = $('<div></div>');
   content.addClass('pure-u-1-4');
   
   this.content = content;
   this.changed = true;
}

Search.render = function () {
   
   var div;
   
   if (this.changed === false) {
      return;
   }
   this.changed = false;
   
   div = $('<div></div>');
   
   div.html('Search');
   
   this.content.append(div);   
}

/* Display Object */

Display = {}

Display.init = function () {

   var content;

   content = $('<div></div>');
   content.addClass('pure-u-1-2');
   
   this.content = content;
   this.changed = true;
}

Display.render = function () {
   
   var div;
   
   if (this.changed === false) {
      return;
   }
   this.changed = false;
   
   div = $('<div></div>');
   
   div.html('Display');
   
   this.content.append(div);   
}

/* Tools Object */

Tools = {}

Tools.init = function () {

   var content;

   content = $('<div></div>');
   content.addClass('pure-u-1-4');
   
   this.content = content;
   this.changed = true;
}

Tools.render = function () {
   
   var div;
   
   if (this.changed === false) {
      return;
   }
   this.changed = false;
   
   div = $('<div></div>');
   
   div.html('Tools');
   
   this.content.append(div);   
}

/* Edit Object */

Edit = {}

Edit.init = function () {

   var content;

   content = $('<div></div>');
   content.addClass('pure-u-1-2');
   
   this.content = content;
   this.changed = true;
}

Edit.render = function () {
   
   var div;
   
   if (this.changed === false) {
      return;
   }
   this.changed = false;
   
   div = $('<div></div>');
   
   div.html('Edit');
   
   this.content.append(div);   
}

/* MAIN */
$(document).ready(function() {
   UI.init();
});
