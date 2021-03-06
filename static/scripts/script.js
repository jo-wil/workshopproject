var Config, UI, Search, Display, Tools, Edit, Worksheet, MathDisplay;

/* Config Object
 * this object holds hard coded options
 * for now these are just the drop down menus
 **/
Config = {
  classes: [{'text': 'Math 141', 'value': '141'}, 
            {'text': 'Math 142', 'value': '142'}, 
            {'text': 'Math 143', 'value': '143'}],

  topics141: [{'text': 'Limits', 'value': 'limits'}, 
              {'text': 'Continuity', 'value': 'continuity'},
              {'text': 'Slopes of Curves', 'value': 'slopesofcurves'},
              {'text': 'Definition of the Derivative', 'value': 'definitionofthederivative'}, 
              {'text': 'Derivatives of Trig Functions', 'value': 'derivativesoftrigfunctions'},  
              {'text': 'Differentiation Rules', 'value': 'differentiationrules'},  
              {'text': 'Implicit Differentiation', 'value': 'implicitdifferentiation'}],  
              
  topics142: [{'text': 'Indefinite Integrals and the U substitution method', 'value': 'indefiniteintegralsandtheusubstitutionmethod'},
              {'text': 'U-substitution with initial value problem', 'value': 'u-substitutionwithinitialvalueproblem'},
              {'text': 'Definite integrals', 'value': 'definiteintegrals'},
              {'text': 'Definite integrals and symmetry', 'value': 'definiteintegralsandsymmetry'},
              {'text': 'Substitution and Area between Curves', 'value': 'substitutionandareabetweencurves'},
              {'text': 'Volume using Cross-Sections', 'value': 'volumeusingcross-sections'},
              {'text': 'Solids of Revolution by using disk/washer method', 'value': 'solidsofrevolutionbyusingdisk/washermethod'},
              {'text': 'Solids of Revolution by using shell method', 'value': 'solidsofrevolutionbyusingshellmethod'},
              {'text': 'Arc Length', 'value': 'arclength'},
              {'text': 'Areas of Surfaces of Revolution', 'value': 'areasofsurfacesofrevolution'},
              {'text': 'Inverse Functions and Their Derivatives', 'value': 'inversefunctionsandtheirderivatives'},
              {'text': 'Logarithmic Differentiation', 'value': 'logarithmicdifferentiation'},
              {'text': 'Derivative of the Exponential', 'value': 'derivativeoftheexponential'},
              {'text': 'General Exponentials', 'value': 'generalexponentials'},
              {'text': 'Indeterminate Forms and L’Hospital’s Rule', 'value': 'indeterminateformsandl’hospital’srule'},
              {'text': 'Hyperbolic Functions', 'value': 'hyperbolicfunctions'},
              {'text': 'Integration by Parts', 'value': 'integrationbyparts'},
              {'text': 'Trigonometric Integrals', 'value': 'trigonometricintegrals'},
              {'text': 'Trigonometric Substitutions', 'value': 'trigonometricsubstitutions'},
              {'text': 'Integration of Rational Functions by Partial Fractions', 'value': 'integrationofrationalfunctionsbypartialfractions'},
              {'text': 'Improper Integrals', 'value': 'improperintegrals'}],                                       
  
  topics143: []  
}

/* MathDisplay Object 
 * this object runs the mathjax engine
 **/

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

/* Main UI Object 
 * this object is called at page init and whenever the entire UI needs to be rerendered
 **/

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

/* Search Object 
 * this object creates and manages the search column
 **/

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
   
   div.append($('<h2></h2>').html('Search'));
   div.append('<hr>');
   
   if (UI.state === 'build') {
   
      div.append($('<label></label>').html('Class'));
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
      
      div.append($('<label></label>').html('Topic'));
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
                 .addClass('pure-button pure-button-primary')
                 .html('Search')
                 .on('click', Search.Listeners.searchButton));
  
      div.append($('<div></div>').addClass('padding').attr('id','search-results'));
   }
   
   this.content.empty();
   this.content.append(div);   
}

/* Listeners Object
 * this object contains all of the listeners for the search column
 **/ 
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
                          .html('Add')
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

/* Display Object 
 * this object creates and runs the display object
 **/

Display = {}

Display.init = function () {

   var content;

   this.latex = false;
   this.editing = false;

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

   var div, header, i, len, p, container, newDirections, newProblem, newSolution, addButton;

   this.editing = false;
   
   div = $('<div></div>')
         .addClass('margin border padding max-height');
         
   header = $('<div></div>');
   header.addClass('text-center click-me');
   header.append($('<h1></h1>').html(Worksheet.title));
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
   container.addClass('padding pure-form');
   
   container.append($('<textarea></textarea>')
                    .addClass('margin padding')
                    .attr({'id':'add-directions','placeholder':'directions'}));
   container.append($('<textarea></textarea>')
                    .addClass('margin padding')
                    .attr({'id':'add-problem','placeholder':'problem'}));
   container.append($('<textarea></textarea>')
                    .addClass('margin padding')
                    .attr({'id':'add-solution','placeholder':'solution'}));
   container.append($('<button></button>')
                    .addClass('pure-button button-success margin')
                    .html('Add')
                    .on('click', Display.Listeners.addProblem));
   
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
   
   if (this.latex === false) {
      content = Worksheet.createLatex();
      this.latex = true;
   } 
   
   $.post("/worksheet", {worksheet: content}).done( function (data) {
       if (data === '0') {
          div.append($('<iframe></iframe>').addClass('max-height max-width').attr('src','/static/worksheets/worksheet.pdf'));
       } else {
          div.append($('<iframe></iframe>').addClass('max-height max-width').attr('src','/static/worksheets/error.txt'));
       }       
   });
   
   this.content.empty();
   this.content.append(div);
   
}
/* Listeners Object
 * this object contains all of the listeners for the display column
 **/ 
Display.Listeners = {}

Display.Listeners.editTitle = function () {
   
   var div, oldTitle, editTitle, saveButton, cancelButton;
   
   if (Display.editing === true) {
      return;
   }
   Display.editing = true;
    
   div = $(this);
   oldTitle = div.children().html();
   
   div.empty();
   div.unbind('click');
   div.addClass('pure-form');
   
   div.append($('<input></input>').addClass('padding margin').attr('id','new-title').val(oldTitle));
   div.append('<br>');
   div.append($('<button></button>')
              .addClass('pure-button button-success margin')
              .html('Save')
              .on('click', Display.Listeners.saveTitle));
   div.append($('<button></button>')
              .addClass('pure-button button-warning margin')
              .html('Cancel')
              .on('click', Display.Listeners.cancel));
}

Display.Listeners.addProblem = function () {

   var directions, problem, solution;
   
   directions = $('#add-directions').val();
   problem = $('#add-problem').val();
   solution = $('#add-solution').val();
   
   Worksheet.problems.push({'directions':directions,'problem':problem,'solution':solution});
   
   Display.render();

}

Display.Listeners.editProblem = function () {

   var div, index, p;
   
   if (Display.editing === true) {
      return;
   }
   Display.editing = true;
   
   div = $(this);
   index = parseInt(div.attr('index'),10);
   p = Worksheet.problems[index];
   
   div.empty();
   div.unbind('click');
   div.addClass('pure-form');
    
   div.append($('<textarea></textarea>')
              .addClass('margin padding')
              .attr({'id':'edit-directions','placeholder':'directions'})
              .val(p.directions));
   div.append($('<textarea></textarea>')
              .addClass('margin padding')
              .attr({'id':'edit-problem','placeholder':'problem'})
              .val(p.problem));
   div.append($('<textarea></textarea>')
              .addClass('margin padding')
              .attr({'id':'edit-solution','placeholder':'solution'})
              .val(p.solution));
   div.append($('<button></button>')
              .addClass('pure-button button-success margin')
              .html('Save')
              .on('click', Display.Listeners.saveProblem));
   div.append($('<button></button>')
              .addClass('pure-button button-warning margin')
              .html('Cancel')
              .on('click', Display.Listeners.cancel));
   div.append($('<button></button>')
              .addClass('pure-button button-error margin')
              .html('Delete')
              .on('click', Display.Listeners.deleteProblem));
   div.append($('<button></button>')
              .addClass('pure-button pure-button-primary margin')
              .html('Move Up')
              .on('click', Display.Listeners.moveUp));
   div.append($('<button></button>')
              .addClass('pure-button pure-button-primary margin')
              .html('Move Down')
              .on('click', Display.Listeners.moveDown));
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

/* Tools Object 
 * this object creates and runs the tools column
 **/

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
   
   div.append($('<h2></h2>').html('Tools'));
   div.append('<hr>');

   if (UI.state === 'build') {
      div.append($('<button></button>')
                 .addClass('pure-button pure-button-primary margin')
                 .html('View PDF')
                 .on('click',Tools.Listeners.viewState));
      div.append($('<h3></h3>').html('Manage Worksheets'));
      div.append($('<button></button>')
                 .addClass('pure-button pure-button-primary margin')
                 .html('Save')
                 .on('click',Tools.Listeners.saveButton));
      div.append($('<button></button>')
                 .addClass('pure-button button-warning margin')
                 .html('Load')
                 .on('click',Tools.Listeners.loadButton));
      div.append($('<div></div>').attr('id','saved-worksheets'));
     
   }
   if (UI.state === 'view') {
      div.append($('<button></button>')
                 .addClass('pure-button pure-button-primary margin')
                 .html('Build Worksheet')
                 .on('click',Tools.Listeners.buildState));
      div.append($('<button></button>')
                 .addClass('pure-button button-error margin')
                 .html('Edit Latex')
                 .on('click',Tools.Listeners.editState));
      div.append('<br><br><br>');   
      div.append($('<input></input>')
                 .addClass('margin')
                 .attr('type','checkbox')
                 .on('change',Tools.Listeners.solutionsCheckbox));
      div.append('Show Solutions');
      div.append($('<h3></h3>').html('Manage Worksheets'));
      div.append($('<button></button>')
                 .addClass('pure-button pure-button-primary margin')
                 .html('Save')
                 .on('click',Tools.Listeners.saveButton));
      div.append($('<div></div>').attr('id','saved-worksheets'));
   }
   
   this.content.empty();
   this.content.append(div);   
}

/* Listenser Object
 * this contains all the listeners for the tools column
 **/

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

Tools.Listeners.solutionsCheckbox = function () {

   if (this.checked === true) {
      Worksheet.solutions = true;
   } else {
      Worksheet.solutions = false;  
   }
   Display.render();
}

Tools.Listeners.saveButton = function () {
   localStorage.setItem(Worksheet.title, JSON.stringify(Worksheet.problems));
   $('#saved-worksheets').html($('<p></p>').html('Worksheet Saved!'));
}

Tools.Listeners.loadButton = function () {
   
   var i, len, container, div;
   
   div = $('#saved-worksheets');
   div.empty(); 
   
   len = localStorage.length;
   
   if (len === 0) {
      div.append($('<p></p>').html('There are no saved worksheets.'));
      return;
   }
   
   div.append($('<p></p>').html('Saved Worksheets:'));
   for (i = 0; i < len; i++){
      container = $('<div></div>').addClass('padding');
      container.append($('<span></span>').addClass('padding').html(localStorage.key(i)));
      container.append($('<button></button>')
                       .addClass('pure-button button-success margin')
                       .html('Reload')
                       .on('click',Tools.Listeners.reloadButton));
      container.append($('<button></button>')
                       .addClass('pure-button button-error margin')
                       .html('Delete')
                       .on('click',Tools.Listeners.deleteButton));
      div.append(container);
   }
}

Tools.Listeners.reloadButton = function () {

   var key;

   key = $(this).parent().find('span').html();

   Worksheet.title = key;
   Worksheet.problems = JSON.parse(localStorage.getItem(key));

   Display.render();
}

Tools.Listeners.deleteButton = function () {

   var key;

   key = $(this).parent().find('span').html();
   
   localStorage.removeItem(key);
   
   Tools.Listeners.loadButton();
}

/* Edit Object 
 * this object creates and runs the latex texteditor
 **/

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
               .html('Refresh')
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

/* Listenser Object
 * this contains all the listeners for the Edit column
 * */
Edit.Listeners = {}

Edit.Listeners.refresh = function () {

   Display.render();
}

/* Worksheet Object 
 * this object stores all the data for the worksheet
 * */

Worksheet = {}

Worksheet.init = function () {
   
   this.title = 'Worksheet';
   this.problems = [];
   
   this.solutions = false;
   this.verticalSpace = 3;
}

Worksheet.createLatex = function () {

   var content, i , len, p;

   content = '\\documentclass[12pt]{article}\n' +
             '\\title{' + Worksheet.title + '}\n' +
             '\\author{SWM}\n' +
             '\\begin{document}\n' +
             '\\maketitle\n\n';
             
   len = Worksheet.problems.length;
   content += '% ----- PROBLEMS START -----\n\n'          
   for (i = 0; i < len; i++) {
      p = Worksheet.problems[i];
      content += '% ----- PROBLEM '+ (i+1) +' -----\n\n'          
      if(p.directions) {
         content += p.directions + '\n\n\\vspace{1cm}\n\n';
      }
      if (Worksheet.solutions && p.solution) {
         content += p.problem + '\n\n\\vspace{1cm}\n\n';
         content += p.solution + '\n\n\\vspace{' + Worksheet.verticalSpace + 'cm}\n\n';
      } else {
         content += p.problem + '\n\n\\vspace{' + Worksheet.verticalSpace + 'cm}\n\n';
      }
   }
   
   content += '\\end{document}';

   return content;
}

/* MAIN */
$(document).ready(function() {
   UI.init();
});
