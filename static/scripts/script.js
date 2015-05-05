var Config, UI, Worksheet, Listeners, MathDisplay; 

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

/* UI Object */
UI = {}

UI.init = function () {

   UI.initSelect();
   UI.initListeners();
   UI.initTools();
   MathDisplay.init();
   Worksheet.render();
}

UI.initListeners = function () {
   $('#class-select').on('change',Listeners.classSelect);
   $('#search-button').on('click',Listeners.searchButton);
   $('#add-button').on('click',Listeners.addNewButton);
   $('#save-button').on('click',Listeners.saveButton);
   $('#load-button').on('click',Listeners.loadButton);
   $('#toggle-button').on('click',Listeners.toggleButton);
   $('#solutions-checkbox').on('change',Listeners.solutionsCheckbox);
   $('#vertical-select').on('change',Listeners.verticalSelect);
   $('#latex-help-label').on('click',Listeners.displayTool);
   $('#add-problem-label').on('click',Listeners.displayTool);
   $('#manage-worksheet-label').on('click',Listeners.displayTool);
   $('#options-label').on('click',Listeners.displayTool);
   $('#latex-edit-button').on('click',Listeners.editButton);
   $('#refresh-button').on('click',Listeners.refreshButton);
}

UI.initTools = function () {
   
   $('#solutions-checkbox').attr('checked', false);
   $('#vertical-select').val('1');
   Worksheet.verticalSpace = '1';
}

UI.initSelect = function () {

   var i, len, o, option, options, topicSelect, classSelect;
   
   classSelect = $('#class-select');
   classSelect.empty();
   
   options = Config.classes;
   len = options.length;
   for (i = 0; i < len; i++) {
      o = options[i];
      option = $('<option></option>').attr('value',o.value).html(o.text);
      classSelect.append(option);
   }
   
   topicSelect = $('#topic-select');
   topicSelect.empty();
   
   options = Config.topics141;
   len = options.length;
   for (i = 0; i < len; i++) {
      o = options[i];
      option = $('<option></option>').attr('value',o.value).html(o.text);
      topicSelect.append(option);
   }
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

/* Worksheet Object */
Worksheet = {}

Worksheet.title = 'Worksheet';
Worksheet.problems = [];
Worksheet.state = 'HTML'; // other option is Latex
Worksheet.solutions = false; // denotes whether the solutions should be displayed in the worksheet 
Worksheet.verticalSpace = '1';
Worksheet.editing = false; // mutex so only one element is edited at a time

Worksheet.renderHTMLHeader = function (worksheet) {

   var worksheetHeader, titleDiv, title;

   worksheetHeader = $('<div></div>').attr('id','worksheet-header');
   
   titleDiv = $('<div></div>').on('click',Listeners.editTitle);
   title = $('<h1></h1>').addClass('text-center click-me').html(Worksheet.title);
   titleDiv.append(title);
   
   worksheetHeader.append(titleDiv);
   
   worksheet.append(worksheetHeader);
}

Worksheet.renderHTMLProblem = function (index, worksheetDiv, p) {
   var problemSpan, solutionSpan, problemDiv, directions;
   
   problemDiv = $('<div></div>').addClass('padding click-me').attr('index',index).on('click', Listeners.editProblem);
   
   directions = $('<p></p>').html('Directions: ' + p.directions);
   problemDiv.append(directions);
   
   problemSpan = $('<p></p>').html('Problem: ' + p.problem);
   problemDiv.append(problemSpan);
   
   solutionSpan = $('<p></p>').html('Solution: ' + p.solution);
   problemDiv.append(solutionSpan);
   
   worksheetDiv.append(problemDiv);
}

Worksheet.renderHTMLContent = function (worksheet) {

   var i, len, problemSpan, worksheetDiv, problemDiv, p;

   worksheetDiv = $('<div></div>').attr('id','worksheet-content');
   len = Worksheet.problems.length;
   
   for (i = 0; i < len; i++) {
      p = Worksheet.problems[i];
      Worksheet.renderHTMLProblem(i, worksheetDiv, p);
   }
   
   worksheet.append(worksheetDiv);
}

Worksheet.render = function () {

   Worksheet.editing = false;
   
   if (Worksheet.state === 'HTML') {
      Worksheet.renderHTML();
   } else if (Worksheet.state === 'Latex') {
      Worksheet.renderLatex('worksheet', Worksheet.createLatex());
   } else {
      console.log('Rendering Error!');
   }
}

Worksheet.renderHTML = function () {

   var worksheet;
   
   worksheet = $('#worksheet');
   worksheet.empty();
   
   Worksheet.renderHTMLHeader(worksheet);
   Worksheet.renderHTMLContent(worksheet);
   
   MathDisplay.parseLatex();
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

Worksheet.renderLatex = function (id, content) {

   var worksheet, iframe;
   
   worksheet = $('#'+id);
   worksheet.empty();
      
   $.post("/worksheet", {worksheet: content}).done( function (data) {
       if (data === '0') {
          iframe = $('<iframe></iframe>').addClass('max-height max-width').attr('src','/static/worksheets/worksheet.pdf');
       } else {
          iframe = $('<iframe></iframe>').addClass('max-height max-width').attr('src','/static/worksheets/error.txt');
       }
       worksheet.append(iframe);
   });
   
}

/* Listeners Object */
Listeners = {}

Listeners.classSelect = function () {
  
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

Listeners.toggleButton = function () {

   var button;
   
   button = $('#toggle-button');
   if (Worksheet.state === 'HTML') {
      Worksheet.state = 'Latex';
      button.html('Edit Worksheet');
      $('#format-div').toggleClass('hidden');
      $('#edit-div').toggleClass('hidden');
      $('#search-button').toggleClass('hidden');
      $('#result-div').toggleClass('hidden');
   } else if (Worksheet.state === 'Latex') {
      Worksheet.state = 'HTML';
      button.html('View As PDF');
      $('#format-div').toggleClass('hidden');
      $('#edit-div').toggleClass('hidden');
      $('#search-button').toggleClass('hidden');
      $('#result-div').toggleClass('hidden');
   } else {
      console.log('Toggle Error');
   }
   Worksheet.render();
}

/* ----- Begin Left Colum Listeners ------ */

Listeners.searchButton = function () {
   
   var i, len, classSelect, topicSelect, classVal, topicVal, className, topicText, result, resultList, resultDiv, resultCount, problemDiv;
   classSelect = $('#class-select');
   topicSelect = $('#topic-select');
   classVal = classSelect.val();
   topicVal = topicSelect.val();
   className = classSelect.children("option:selected").html();
   topicText = topicSelect.children("option:selected").html();
    
   $.get("/database", {'class_name': classVal, 'topic': topicVal}, function (data, status) {
    
      resultList = JSON.parse(data);
      len = resultList.length;
       
      resultDiv = $('#result-div');
      resultDiv.empty();
       
      resultCount = $('<p></p>').html('Search for ' + className + ' ' + topicText + ' returned ' + len + ' problems.');
      resultDiv.append(resultCount);
       
      for (i = 0; i < len; i++) {
         result = resultList[i];
         problemDiv = $('<div></div>').addClass('padding');
         problem = $('<span></span>').addClass('padding math').attr({'problem':result.problem, 'solution':result.solution}).html(result.problem);
         button = $('<button></button>').addClass('add-button pure-button button-success').html('Add');
         problemDiv.append(problem);
         problemDiv.append(button);
         resultDiv.append(problemDiv);
         button.on('click',Listeners.addButton);
      }
      MathDisplay.parseLatex();
   });
}

Listeners.addButton = function () {

   var problem, solution, problemSpan;
   problemSpan = $(this).parent().find('span');
   
   problem = problemSpan.attr('problem');
   solution = problemSpan.attr('solution');
   
   Worksheet.problems.push({'directions':'', 'problem':problem, 'solution':solution})
   Worksheet.render();
}

Listeners.saveButton = function () {
   
   var resultMessage, resultDiv;

   resultDiv = $('#saved-worksheets');
   resultDiv.empty(); 

   localStorage.setItem(Worksheet.title, JSON.stringify(Worksheet.problems));
   
   resultMessage = $('<p></p>').html('Worksheet saved!');
   resultDiv.append(resultMessage);
}

Listeners.loadButton = function () {
   
   var i, len, worksheetDiv, worksheetName, reloadButton, deleteButton, resultDiv, emptyMessage;
   
   resultDiv = $('#saved-worksheets');
   resultDiv.empty(); 
   
   len = localStorage.length;
   
   if (len === 0) {
      emptyMessage = $('<p></p>').html('There are no saved worksheets.');
      resultDiv.append(emptyMessage);
   }
   
   for (i = 0; i < len; i++){
      worksheetDiv = $('<div></div>').addClass('padding');
      worksheetName = $('<span></span>').addClass('padding').html(localStorage.key(i));
      reloadButton = $('<button></button>').addClass('add-button pure-button button-success margin').html('Reload');
      deleteButton = $('<button></button>').addClass('add-button pure-button button-error margin').html('Delete');
      worksheetDiv.append(worksheetName);
      worksheetDiv.append(reloadButton);
      worksheetDiv.append(deleteButton);
      resultDiv.append(worksheetDiv);
      reloadButton.on('click',Listeners.reloadButton);  
      deleteButton.on('click',Listeners.deleteButton);
        
   }
}

Listeners.reloadButton = function () {

   var key;

   key = $(this).parent().find('span').html();

   Worksheet.title = key;
   Worksheet.problems = JSON.parse(localStorage.getItem(key));

   Worksheet.render();
}

Listeners.deleteButton = function () {

   var key;

   key = $(this).parent().find('span').html();
   
   localStorage.removeItem(key);
   
   Listeners.loadButton();

}


/* ----- End Left Colum Listeners ------ */

/* ----- Begin Right Colum Listeners ------ */

Listeners.addNewButton = function () {
   
   var directions, problem, solution;
   
   directions = $('#new-directions');
   problem = $('#new-problem');
   solution = $('#new-solution');
   
   Worksheet.problems.push({'directions':directions.val(), 'problem':problem.val(), 'solution':solution.val()})
   
   directions.val('');
   problem.val('');
   solution.val('');
   
   Worksheet.render();
}

Listeners.solutionsCheckbox = function () {

   if (this.checked === true) {
      Worksheet.solutions = true;
   } else {
      Worksheet.solutions = false;  
   }
   Worksheet.render();
}

Listeners.verticalSelect = function () {
   Worksheet.verticalSpace = this.value;
   Worksheet.render();
}
                          
Listeners.displayTool = function () {
   
   var id;
   
   id = $(this).attr('for');

   $('#'+id).toggleClass('hidden');
}
Listeners.editButton = function () {

   var content;

   $('#build-div').addClass('hidden');
   $('#latex-div').removeClass('hidden');
   
   content = Worksheet.createLatex();
   
   $('#latex-textarea').val(content);
   Worksheet.renderLatex('latex-iframe', Worksheet.createLatex());
}

/* ----- End Right Colum Listeners ------ */

/* ----- Begin Middle Column Listeners ------ */

Listeners.editTitle = function () {
   
   var div, oldText, editTitle, saveButton, cancelButton;
   
   if (Worksheet.editing === true) {
      return;
   }
   Worksheet.editing = true;
   
   div = $(this);
   oldText = div.children().html();
   
   div.empty();
   div.unbind('click');
   div.addClass('pure-form');
   
   editTitle = $('<input></input>').addClass('margin small-padding').attr('id','new-title').val(oldText);
   saveButton = $('<button></button>').addClass('pure-button button-success margin').html('Save').on('click', Listeners.saveTitle);
   cancelButton = $('<button></button>').addClass('pure-button button-warning margin').html('Cancel').on('click', Listeners.cancel);
   
   div.append(editTitle);
   div.append('<br>')
   div.append(saveButton);
   div.append(cancelButton);
      
}

Listeners.editProblem = function () {
   
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
    
   editDirections = $('<textarea></textarea>').addClass('margin small-padding').attr({'id':'edit-directions','placeholder':'directions'}).val(p.directions);
   editProblem = $('<textarea></textarea>').addClass('margin small-padding').attr({'id':'edit-problem','placeholder':'problem'}).val(p.problem);
   editSolution = $('<textarea></textarea>').addClass('margin small-padding').attr({'id':'edit-solution','placeholder':'solution'}).val(p.solution);
   saveButton = $('<button></button>').addClass('pure-button button-success margin').html('Save').on('click', Listeners.saveProblem);
   cancelButton = $('<button></button>').addClass('pure-button button-warning margin').html('Cancel').on('click', Listeners.cancel);
   deleteButton = $('<button></button>').addClass('pure-button button-error margin').html('Delete').on('click', Listeners.deleteProblem);
   upButton = $('<button></button>').addClass('pure-button pure-button-primary margin').html('Move Up').on('click', Listeners.moveUp);
   downButton = $('<button></button>').addClass('pure-button pure-button-primary margin').html('Move Down').on('click', Listeners.moveDown);
   
   div.append(editDirections);
   div.append(editProblem);
   div.append(editSolution);
   div.append('<br>')
   div.append(saveButton);
   div.append(cancelButton);
   div.append(deleteButton);
   div.append(upButton);
   div.append(downButton);
}

Listeners.saveTitle = function () {
   
   Worksheet.title = $('#new-title').val();
   Worksheet.editing = false;
   Worksheet.render();
}

Listeners.saveProblem = function () {
 
   var div, directions, problem, solution, index;
   
   div = $(this).parent();
   index = parseInt(div.attr('index'),10);
   
   directions = $('#edit-directions').val();
   problem = $('#edit-problem').val();
   solution = $('#edit-solution').val();
   
   Worksheet.problems[index] = {'directions':directions,'problem':problem,'solution':solution};
   
   Worksheet.render();
}

Listeners.cancel = function () {
   
   Worksheet.render();
}

Listeners.deleteProblem = function () {

   var div, directions, problem, solution, index;
   
   div = $(this).parent();
   index = parseInt(div.attr('index'),10);
 
   Worksheet.problems.splice(index, 1);   
   
   Worksheet.render();
}

Listeners.moveUp = function () {

   var div, index, tmp;

   div = $(this).parent();
   index = parseInt(div.attr('index'),10);
   
   if (index === 0) {
      return;
   }

   tmp = Worksheet.problems[index];
   Worksheet.problems[index] = Worksheet.problems[index - 1];
   Worksheet.problems[index - 1] = tmp;
   
   Worksheet.render();
}

Listeners.moveDown = function () {

   var div, index, tmp;

   div = $(this).parent();
   index = parseInt(div.attr('index'),10);
   
   if (index === Worksheet.problems.length - 1) {
      return;
   }

   tmp = Worksheet.problems[index];
   Worksheet.problems[index] = Worksheet.problems[index + 1];
   Worksheet.problems[index + 1] = tmp;
   
   Worksheet.render();
}

/* ----- End Middle Column Listeners ------ */

/* ----- Begin Edit Page Listeners ----- */
Listeners.refreshButton = function () {
   
   var content;
   
   content = $('#latex-textarea').val();
   
   console.log()
   
   Worksheet.renderLatex('latex-iframe', content);
}

/* MAIN */
$(document).ready(function() {
   UI.init();
});
