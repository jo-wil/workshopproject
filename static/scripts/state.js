var UI, Search, Display, Tools, Edit, Worksheet, MathDisplay;

/* Main UI Object */

UI = {}

UI.init = function () {

   this.content = $('#content');
   this.content.addClass('pure-g');
   
   this.state = 'build'; // other options are view and edit

   Worksheet.init();
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
      
      this.content.append(Search.content);
      this.content.append(Display.content);
      this.content.append(Tools.content);
   }
   else if (this.state === 'edit') {
      
      Edit.render();
      Display.render();
      
      this.content.append(Edit.content);
      this.content.append(Display.content);
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
   
   var div, classSelect, topicSelect;
   
   div = $('<div></div>');
   div.addClass('padding text-center pure-form pure-form-stacked');
   
   div.append($('<h2></h2>').text('Search'));
   div.append($('<hr>'));
   
   if (UI.state === 'build') {
   
      div.append($('<label></label>').text('Class'));
      div.append($('<select></select>').addClass('max-width').attr('id','class-select'));
      
      div.append($('<label></label>').text('Topic'));
      div.append($('<select></select>').addClass('max-width').attr('id','topic-select'));
      
      div.append($('<br>'));
      div.append($('<button></button>')
                 .addClass('pure-button button-success')
                 .text('Search')
                 .on('click', Search.Listeners.searchButton));
  
      div.append($('<div></div>').addClass('padding').attr('id','search-results'));
   }
   
   this.content.empty();
   this.content.append(div);   
}

Search.Listeners = {}

Search.Listeners.searchButton = function () {
   
   var results, r, container, i, len;
   
   container = $('#search-results');
   container.empty();
   container.append('<br>');
   
   $.get('/database', {'class_name': '141', 'topic': 'limits'}, function (data) {
      
      results = JSON.parse(data);
      
      len = results.length;
      for (i = 0; i < len; i++) {
         r = results[i];
         container.append($('<span></span>').addClass('margin').html(r.problem));
         container.append($('<button></button>')
                          .addClass('margin pure-button button-success')
                          .attr({'problem':r.problem, 'solution':r.solution})
                          .text('Add')
                          .on('click', Search.Listeners.addButton));
         container.append($('<br>'))
      }
   });
}

Search.Listeners.addButton = function () {

   var problem, solution, button;
   
   button = $(this);
   
   problem = button.attr('problem');
   solution = button.attr('solution');
   
   Worksheet.problems.push({'directions':'', 'problem':problem, 'solution':solution});
   
   Display.render();
    
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
   
   var div, iframe, header, i, len, p, container, directions, problem, solution;
   
   div = $('<div></div>');
   div.addClass('margin border padding max-height');
   
   if (UI.state === 'build') {
      
      header = $('<div></div>');
      header.addClass('text-center click-me');
      header.append($('<h1></h1>').text(Worksheet.title));
      div.append(header);
      header.on('click', Display.Listeners.editTitle);
      
      len = Worksheet.problems.length;
      
      for (i = 0; i < len; i++) {
         p = Worksheet.problems[i];
         container = $('<div></div>').addClass('padding click-me').attr('index',i);
         container.append($('<p></p>').html('Directions: ' + p.directions));
         container.append($('<p></p>').html('Problem: ' + p.problem));
         container.append($('<p></p>').html('Solution: ' + p.solution));
         div.append(container);
      }
      
      container = $('<div></div>');
      container.addClass('padding').attr('id','worksheet-problems');
      div.append(container);
   
   }
   if (UI.state === 'view') {
      iframe = $('<iframe></iframe>');
      iframe.addClass('max-height max-width').attr('src','/static/worksheets/worksheet.txt');
      div.append(iframe);
   }
   
   this.content.empty();
   this.content.append(div);
}

Display.Listeners = {}

Display.Listeners.editTitle = function () {
   
   var div, oldTitle, editTitle, saveButton, cancelButton;
    
   div = $(this);
   oldTitle = div.children().html();
   
   div.empty();
   div.unbind('click');
   div.addClass('pure-form');
   
   editTitle = $('<input></input>').addClass('padding margin').attr('id','new-title').val(oldTitle);
   saveButton = $('<button></button>')
                .addClass('pure-button button-success margin')
                .text('Save')
                .on('click', Display.Listeners.saveTitle);
   cancelButton = $('<button></button>')
                  .addClass('pure-button button-warning margin')
                  .text('Cancel')
                  .on('click', Display.Listeners.cancel);
   
   div.append(editTitle);
   div.append('<br>');
   div.append(saveButton);
   div.append(cancelButton);
}

Display.Listeners.saveTitle = function () {
   
   Worksheet.title = $('#new-title').val();
   Display.render();
}

Display.Listeners.cancel = function () {
   
   Display.render();
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
   
   div = $('<div></div>');
   div.addClass('padding text-center pure-form pure-form-stacked');
   
   div.append($('<h2></h2>').text('Tools'));
   div.append($('<hr>'));
   
   this.content.empty();
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
   
   div = $('<div></div>');
   
   div.html('Edit');
   
   this.content.empty();
   this.content.append(div);  
}

/* Worksheet Object */

Worksheet = {}

Worksheet.init = function () {
   
   this.title = 'Worksheet'
   this.problems = []
}

/* MathDisplay Object */

MathDisplay = {}

MathDisplay.init = function () {
   // Config MathJax
   MathJax.Hub.Config({
      showProcessingMessages: true,
      showMathMenu: false,
      tex2jax: { inlineMath: [['$','$']] }
   });
}

MathDisplay.parseLatex = function () {
   MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

/* MAIN */
$(document).ready(function() {
   UI.init();
});
