var Config, UI, Worksheet, Listeners, MathDisplay; 

/* Config Object */
Config = {
  classes: [{'text': 'Math 141', 'value': '141'}, 
            {'text': 'Math 142', 'value': '142'}, 
            {'text': 'Math 143', 'value': '143'}],
            
  topics141: [{'text': 'Limits', 'value': 'limits'}, 
              {'text': 'Derivatives', 'value': 'derivatives'},
              {'text': 'Integrals','value': 'integrals'}],
              
  topics143: [{'text': 'Series', 'value': 'series'}]
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
   $('#toggle-button').on('click',Listeners.toggleButton);
   $('#solutions-checkbox').on('change',Listeners.solutionsCheckbox);
   $('#vertical-select').on('change',Listeners.verticalSelect);
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

   if (Worksheet.state === 'HTML') {
      Worksheet.renderHTML();
   } else if (Worksheet.state === 'Latex') {
      Worksheet.renderLatex();
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

Worksheet.renderLatex = function () {

   var content, worksheet, iframe, i, len, p;
   
   worksheet = $('#worksheet');
   worksheet.empty();
   
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
         len = options.length
         for (i = 0; i < len; i++) {
            o = options[i];
            option = $('<option></option>').attr('value',o.value).html(o.text);
            topicSelect.append(option);
         }
         break;
      case '143':
         options = Config.topics143;
         len = options.length
         for (i = 0; i < len; i++) {
            o = options[i];
            option = $('<option></option>').attr('value',o.value).html(o.text);
            topicSelect.append(option);
         }
         break;
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
   } else if (Worksheet.state === 'Latex') {
      Worksheet.state = 'HTML';
      button.html('View As PDF');
      $('#format-div').toggleClass('hidden');
      $('#edit-div').toggleClass('hidden');
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

   console.log(this.value);
   Worksheet.verticalSpace = this.value;
   Worksheet.render();
}

/* ----- End Right Colum Listeners ------ */

/* ----- Begin Middle Column Listeners ------ */

Listeners.editTitle = function () {
   
   var div, oldText, editTitle, saveButton, cancelButton;
   
   if (Worksheet.editing === false) {
      Worksheet.editing = true;
   } else {
      return;
   }
   
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
   
   if (Worksheet.editing === false) {
      Worksheet.editing = true;
   } else {
      return;
   }
   
   div = $(this);
   index = parseInt(div.attr('index'),10);
   p = Worksheet.problems[index];
   
   div.empty();
   div.unbind('click');
   div.addClass('pure-form');
    
   editDirections = $('<textarea></textarea>').addClass('margin small-padding').attr({'id':'new-directions','placeholder':'directions'}).val(p.directions);
   editProblem = $('<textarea></textarea>').addClass('margin small-padding').attr({'id':'new-problem','placeholder':'problem'}).val(p.problem);
   editSolution = $('<textarea></textarea>').addClass('margin small-padding').attr({'id':'new-solution','placeholder':'solution'}).val(p.solution);
   saveButton = $('<button></button>').addClass('pure-button button-success margin').html('Save').on('click', Listeners.saveProblem);
   cancelButton = $('<button></button>').addClass('pure-button button-warning margin').html('Cancel').on('click', Listeners.cancel);
   deleteButton = $('<button></button>').addClass('pure-button button-error margin').html('Delete').on('click', Listeners.deleteProblem);
   upButton = $('<button></button>').addClass('pure-button margin').html('Move Up').on('click', Listeners.moveUp);
   downButton = $('<button></button>').addClass('pure-button margin').html('Move Down').on('click', Listeners.moveDown);
   
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
   
   directions = $('#new-directions').val();
   problem = $('#new-problem').val();
   solution = $('#new-solution').val();
   
   Worksheet.problems[index] = {'directions':directions,'problem':problem,'solution':solution};
   
   Worksheet.editing = false;
   Worksheet.render();
}

Listeners.cancel = function () {
   
   Worksheet.editing = false;
   Worksheet.render();
}

Listeners.deleteProblem = function () {

   var div, directions, problem, solution, index;
   
   div = $(this).parent();
   index = parseInt(div.attr('index'),10);
 
   Worksheet.problems.splice(index, 1);   
   
   Worksheet.editing = false;
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
   
   Worksheet.editing = false;
   Worksheet.render();
   div.click();
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
   
   Worksheet.editing = false;
   Worksheet.render();
}

/* ----- End Middle Column Listeners ------ */


/* MAIN */
$(document).ready(function() {
   UI.init();
});
