var Config, UI, Search, Display, Tools, Edit, Worksheet, MathDisplay;

/* Config Object */
Config = {
  classes: [{'text': 'Math 141', 'value': '141'}, 
            {'text': 'Math 142', 'value': '142'}, 
            {'text': 'Math 143', 'value': '143'}],
  
  topics141: [{'text': 'Limits', 'value': 'limits'}, 
              {'text': 'Derivatives', 'value': 'derivatives'},
              {'text': 'Integrals','value': 'integrals'}],
              
  topics142: [{'text': 'asdf', 'value': 'asdf'},
              {'text': 'asdf', 'value': 'hgsd'}],                                       
  
  topics143: [{'text': 'gfsd', 'value': 'erwt'},
              {'text': 'wert', 'value': 'ewrt'}]  
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

/* Main UI Object */

UI = {}

UI.init = function () {

   this.content = $('#content');
   this.content.addClass('pure-g');
   
   this.state = 'build'; // other options are view and edit

   MathDisplay.init();
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
}

Search.render = function () {
   
   var div, classSelect, topicSelect, classSelect, topicSelect, options, o, i, len;
   
   div = $('<div></div>')
         .addClass('padding text-center pure-form pure-form-stacked');
   
   div.append($('<h2></h2>').text('Search'));
   div.append('<hr>');
   
   if (UI.state === 'build') {
   
      div.append($('<label></label>').text('Class'));
      classSelect = $('<select></select>');
      classSelect.addClass('max-width')
                 .attr('id', 'class-select')
                 .on('change', Search.Listeners.classSelect);
      
      options = Config.classes;
      len = options.length;
      for (i = 0; i < len; i++) {
         o = options[i];
         classSelect.append($('<option></option>').attr('value',o.value).html(o.text));
      }
      
      div.append(classSelect);
      
      div.append($('<label></label>').text('Topic'));
      topicSelect = $('<select></select>').addClass('max-width').attr('id','topic-select');
      
      options = Config.topics141;
      len = options.length;
      for (i = 0; i < len; i++) {
         o = options[i];
         topicSelect.append($('<option></option>').attr('value',o.value).html(o.text));
      }
      
      div.append(topicSelect);
      
      div.append('<br>');
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

Search.Listeners.classSelect = function () {
  
   var i, len, o, option, options, topicSelect;
   topicSelect = $('#topic-select');
   topicSelect.empty();
   switch (this.value) {
      case '141':
         options = Config.topics141;
         break;
      case '142':
         options = Config.topics142;
         break;   
      case '143':
         options = Config.topics143;
         break;
   }
   len = options.length
   for (i = 0; i < len; i++) {
      o = options[i];
      option = $('<option></option>').attr('value',o.value).html(o.text);
      topicSelect.append(option);
   }
}

Search.Listeners.searchButton = function () {
   
   var classSelect, topicSelect, classVal, topicVal, classText, topicText, resultMessage, results, r, container, i, len;
   
   classSelect = $('#class-select');
   topicSelect = $('#topic-select');
   classVal = classSelect.val();
   topicVal = topicSelect.val();
   classText = classSelect.children("option:selected").html();
   topicText = topicSelect.children("option:selected").html();
   
   container = $('#search-results');
   container.empty();
   container.append('<br>');
   
   $.get('/database', {'class_name': classVal, 'topic': topicVal}, function (data) {
      
      results = JSON.parse(data);
      
      len = results.length;
      
      resultMessage = $('<p></p>').html('Search for ' + classText + ' ' + topicText + ' returned ' + len + ' problems.');
      container.append(resultMessage);
      
      for (i = 0; i < len; i++) {
         r = results[i];
         container.append($('<span></span>').addClass('margin').html(r.problem));
         container.append($('<button></button>')
                          .addClass('margin pure-button button-success')
                          .attr({'problem':r.problem, 'solution':r.solution})
                          .text('Add')
                          .on('click', Search.Listeners.addButton));
         container.append('<br>')
      }
      MathDisplay.parseLatex();
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
}

Display.render = function () {
     
   if (UI.state === 'build') {
      Display.renderBuild();   
      MathDisplay.parseLatex();
   }
   if (UI.state === 'view') {
      Display.renderView();
   }
   if (UI.state === 'edit') {
      Display.renderEdit();
   }
}

Display.renderBuild = function () {

   var div, header, i, len, p, container, directions, problem, solution;

   Worksheet.editing = false;
   
   div = $('<div></div>')
         .addClass('margin border padding max-height');
         
   header = $('<div></div>');
   header.addClass('text-center click-me');
   header.append($('<h1></h1>').text(Worksheet.title));
   div.append(header);
   header.on('click', Display.Listeners.editTitle);
   
   len = Worksheet.problems.length;
   
   for (i = 0; i < len; i++) {
      p = Worksheet.problems[i];
      container = $('<div></div>')
                  .addClass('padding click-me')
                  .attr('index',i)
                  .on('click', Display.Listeners.editProblem);
      container.append($('<p></p>').html('Directions: ' + p.directions));
      container.append($('<p></p>').html('Problem: ' + p.problem));
      container.append($('<p></p>').html('Solution: ' + p.solution));
      div.append(container);
   }
   
   container = $('<div></div>');
   container.addClass('padding').attr('id','worksheet-problems');
   div.append(container);
   
   this.content.empty();
   this.content.append(div);
}

Display.renderView = function () {

   var div, content;

   div = $('<div></div>')
         .addClass('margin max-height');

   content = Worksheet.createLatex();
      
   $.post("/worksheet", {worksheet: content}).done( function (data) {
       if (data === '0') {
          iframe = $('<iframe></iframe>').addClass('max-height max-width').attr('src','/static/worksheets/worksheet.pdf');
       } else {
          iframe = $('<iframe></iframe>').addClass('max-height max-width').attr('src','/static/worksheets/error.txt');
       }
       div.append(iframe);
   });
   
   this.content.empty();
   this.content.append(div);
}

Display.renderEdit = function () {
   
   var div, content;

   div = $('<div></div>')
         .addClass('margin max-height');
   
   content = $('#latex-edit').val();
   
   if (Worksheet.latex === false) {
      content = Worksheet.createLatex();
      Worksheet.latex = true;
   } 
   
   $.post("/worksheet", {worksheet: content}).done( function (data) {
       if (data === '0') {
          iframe = $('<iframe></iframe>').addClass('max-height max-width').attr('src','/static/worksheets/worksheet.pdf');
       } else {
          iframe = $('<iframe></iframe>').addClass('max-height max-width').attr('src','/static/worksheets/error.txt');
       }
       div.append(iframe);
   });
   
   this.content.empty();
   this.content.append(div);
   
}

Display.Listeners = {}

Display.Listeners.editTitle = function () {
   
   var div, oldTitle, editTitle, saveButton, cancelButton;
   
   if (Worksheet.editing === true) {
      return;
   }
   Worksheet.editing = true;
    
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

Display.Listeners.editProblem = function () {

   var div, index, editDirections, editProblem, editSolution, saveButton, cancelButton, deleteButton, p;
   
   if (Worksheet.editing === true) {
      return;
   }
   Worksheet.editing = true;
   
   div = $(this);
   index = parseInt(div.attr('index'),10);
   p = Worksheet.problems[index];
   
   div.empty();
   div.unbind('click');
   div.addClass('pure-form');
    
   editDirections = $('<textarea></textarea>')
                    .addClass('margin padding')
                    .attr({'id':'edit-directions','placeholder':'directions'})
                    .val(p.directions);
   editProblem = $('<textarea></textarea>')
                 .addClass('margin padding')
                 .attr({'id':'edit-problem','placeholder':'problem'})
                 .val(p.problem);
   editSolution = $('<textarea></textarea>')
                  .addClass('margin padding')
                  .attr({'id':'edit-solution','placeholder':'solution'})
                  .val(p.solution);
   saveButton = $('<button></button>')
                .addClass('pure-button button-success margin')
                .text('Save')
                .on('click', Display.Listeners.saveProblem);
   cancelButton = $('<button></button>')
                  .addClass('pure-button button-warning margin')
                  .text('Cancel')
                  .on('click', Display.Listeners.cancel);
   deleteButton = $('<button></button>')
                  .addClass('pure-button button-error margin')
                  .text('Delete')
                  .on('click', Display.Listeners.deleteProblem);
   upButton = $('<button></button>')
              .addClass('pure-button pure-button-primary margin')
              .html('Move Up')
              .on('click', Display.Listeners.moveUp);
   downButton = $('<button></button>')
                .addClass('pure-button pure-button-primary margin')
                .html('Move Down')
                .on('click', Display.Listeners.moveDown);
   
   div.append(editDirections);
   div.append(editProblem);
   div.append(editSolution);
   div.append(saveButton);
   div.append(cancelButton);
   div.append(deleteButton);
   div.append(upButton);
   div.append(downButton);
}

Display.Listeners.saveTitle = function () {
   
   Worksheet.title = $('#new-title').val();
   Display.render();
}

Display.Listeners.saveProblem = function () {

   var div, directions, problem, solution, index;
   
   div = $(this).parent();
   index = parseInt(div.attr('index'),10);
   
   directions = $('#edit-directions').val();
   problem = $('#edit-problem').val();
   solution = $('#edit-solution').val();
   
   Worksheet.problems[index] = {'directions':directions,'problem':problem,'solution':solution};
   
   Display.render();

}

Display.Listeners.cancel = function () {
   
   Display.render();
}

Display.Listeners.deleteProblem = function () {

   var div, directions, problem, solution, index;
   
   div = $(this).parent();
   index = parseInt(div.attr('index'),10);
 
   Worksheet.problems.splice(index, 1);   
   
   Display.render();
}

Display.Listeners.moveUp = function () {

   var div, index, tmp;

   div = $(this).parent();
   index = parseInt(div.attr('index'),10);
   
   if (index === 0) {
      return;
   }

   tmp = Worksheet.problems[index];
   Worksheet.problems[index] = Worksheet.problems[index - 1];
   Worksheet.problems[index - 1] = tmp;
   
   Display.render();
}

Display.Listeners.moveDown = function () {

   var div, index, tmp;

   div = $(this).parent();
   index = parseInt(div.attr('index'),10);
   
   if (index === Worksheet.problems.length - 1) {
      return;
   }

   tmp = Worksheet.problems[index];
   Worksheet.problems[index] = Worksheet.problems[index + 1];
   Worksheet.problems[index + 1] = tmp;
   
   Display.render();
}

/* Tools Object */

Tools = {}

Tools.init = function () {

   var content;

   content = $('<div></div>');
   content.addClass('pure-u-1-4');
   
   this.content = content;
}

Tools.render = function () {
   
   var div;
   
   div = $('<div></div>');
   div.addClass('padding text-center pure-form pure-form-stacked');
   
   div.append($('<h2></h2>').text('Tools'));
   div.append('<hr>');

   if (UI.state === 'build') {
      div.append($('<button></button>')
              .addClass('pure-button pure-button-primary')
              .text('View PDF')
              .on('click',Tools.Listeners.viewState)
      );
   }
   if (UI.state === 'view') {
      div.append($('<button></button>')
              .addClass('pure-button pure-button-primary margin')
              .text('Build Worksheet')
              .on('click',Tools.Listeners.buildState)
      );
      div.append($('<button></button>')
              .addClass('pure-button button-error margin')
              .text('Edit Latex')
              .on('click',Tools.Listeners.editState)
      );
   }
   
   this.content.empty();
   this.content.append(div);   
}

Tools.Listeners = {}

Tools.Listeners.buildState = function () {
   
   UI.state = 'build'
   UI.render();
}

Tools.Listeners.viewState = function () {
   
   UI.state = 'view'
   UI.render();
}

Tools.Listeners.editState = function () {
   
   UI.state = 'edit'
   UI.render();
}

/* Edit Object */

Edit = {}

Edit.init = function () {

   var content;

   content = $('<div></div>');
   content.addClass('pure-u-1-2');
   
   this.content = content;
}

Edit.render = function () {
   
   var div, textarea, content;
   
   div = $('<div></div>');
   div.addClass('margin max-height');
   
   div.append($('<button></button>')
               .addClass('pure-button pure-button-primary max-width margin')
               .text('Refresh')
               .on('click',Edit.Listeners.refresh)
   );
   
   content = Worksheet.createLatex();
   
   textarea = $('<textarea></textarea>')
              .addClass('max-height max-width padding')
              .attr({'id':'latex-edit','spellcheck':'false'})
              .val(content);
   
   div.append(textarea);
   
   this.content.empty();
   this.content.append(div);  
}

Edit.Listeners = {}

Edit.Listeners.refresh = function () {

   Display.render();
}

/* Worksheet Object */

Worksheet = {}

Worksheet.init = function () {
   
   this.title = 'Worksheet';
   this.problems = [];
   
   this.solutions = true;
   this.editing = false;
   this.latex = false;
   this.verticalSpace = 1;
}

Worksheet.createLatex = function () {

   var content, i , len, p;

   content = '\\documentclass[12pt]{article}\n' +
             '\\title{' + Worksheet.title + '}\n' +
             '\\author{SWM}\n' +
             '\\begin{document}\n' +
             '\\maketitle\n';
             
   len = Worksheet.problems.length;          
   for (i = 0; i < len; i++) {
      p = Worksheet.problems[i];
      content += p.directions + '\n\\vspace{1cm}\n\n';
      if (Worksheet.solutions) {
         content += p.problem + '\n\\vspace{1cm}\n\n';
         content += p.solution + '\n\\vspace{' + Worksheet.verticalSpace + 'cm}\n\n';
      } else {
         content += p.problem + '\n\\vspace{' + Worksheet.verticalSpace + 'cm}\n\n';
      }
   }
   
   content += '\\end{document}';

   return content;
}

/* MAIN */
$(document).ready(function() {
   UI.init();
});
