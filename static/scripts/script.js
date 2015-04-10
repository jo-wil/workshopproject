var Config, UI, Worksheet, Listeners; 

/* Config Object */
Config = {
  topics141: [{'text': 'Not Selected', 'value': '0'},
              {'text': 'Limits', 'value': 'limits'}, 
              {'text': 'Derivatives', 'value': 'derivatives'},
              {'text': 'Integrals','value': 'integrals'}]
}

/* UI Object */
UI = {}

UI.init = function () {

   $('#class-select').on('change',Listeners.classSelect);
   $('#search-button').on('click',Listeners.searchButton);
   Worksheet.render();
}

/* Worksheet Object */
Worksheet = {}

Worksheet.title = 'Worksheet';
Worksheet.problems = [];
Worksheet.state = 'HTML'; // other option is Latex

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

   var i, len, problemSpan, worksheetDiv, worksheetHeader, problemDiv, titleDiv, title, p;

   worksheetHeader = $('#worksheet-header');
   worksheetHeader.empty();
   
   titleDiv = $('<div></div>').addClass('border').on('click',Listeners.editTitle);
   title = $('<h1></h1>').addClass('text-center click-me').html(Worksheet.title);
   titleDiv.append(title);
   
   worksheetHeader.append(titleDiv);

   worksheetDiv = $('#worksheet-content');
   worksheetDiv.empty();
   len = Worksheet.problems.length;
   
   for (i = 0; i < len; i++) {
      p = Worksheet.problems[i];
      problemSpan = $('<span></span>').addClass('padding').attr({'problem':p.problem, 'solution':p.solution}).html(p.problem);
      problemDiv = $('<div></div>').addClass('padding border');
      problemDiv.append(problemSpan);
      worksheetDiv.append(problemDiv);
   }
}

Worksheet.renderLatex = function () {
 // TODO
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
         for (i = 0, len = options.length; i < len; i++) {
            o = options[i];
            option = $('<option></option>').attr('value',o.value).html(o.text);
            topicSelect.append(option);
         }
         break;
      default:
         option = document.createElement('option');
         option = $('<option></option>').attr('value',0).html('Not Selected');
         topicSelect.append(option);
   }
}

Listeners.searchButton = function () {
   var i, len, className, topic, result, resultList, resultDiv, resultCount, problemDiv;
    className = $('#class-select').val();
    topic = $('#topic-select').val();
    $.get("/database", {'class_name':className,'topic':topic}, function (data, status) {
    
       resultList = JSON.parse(data);
       len = resultList.length;
       
       resultDiv = $('#result-div');
       resultDiv.empty();
       
       resultCount = $('<p></p>').html('Search returned ' + len + ' problems.');
       resultDiv.append(resultCount);
       
       for (i = 0; i < len; i++) {
          result = resultList[i];
          problemDiv = $('<div></div>').addClass('padding');
          problem = $('<span></span>').addClass('padding').attr({'problem':result.problem, 'solution':result.solution}).html(result.problem);
          button = $('<button></button>').addClass('add-button pure-button button-success').attr('problem',i).html('Add');
          problemDiv.append(problem);
          problemDiv.append(button);
          resultDiv.append(problemDiv);
          button.on('click',Listeners.addButton);
       }
    });
}

Listeners.addButton = function () {

   var problem, solution, problemSpan;
   problemSpan = $(this).parent().find('span');
   
   problem = problemSpan.attr('problem');
   solution = problemSpan.attr('solution');
   
   Worksheet.problems.push({'problem':problem, 'solution':solution})
   Worksheet.render();
}

Listeners.editTitle = function () {
   var div, oldText, editText, saveButton, cancelButton;
   
   div = $(this);
   oldText = div.children().html();
   
   div.empty();
   div.unbind('click');
   
   editText = $('<input></input>').addClass('margin small-padding').attr('id','new-title').val(oldText);
   saveButton = $('<button></button>').addClass('add-button pure-button button-success margin').html('Save').on('click',Listeners.saveTitle);
   editButton = $('<button></button>').addClass('add-button pure-button button-error margin').html('Cancel').on('click',Listeners.cancel);
   
   div.append(editText);
   div.append('<br>')
   div.append(saveButton);
   div.append(editButton);
      
}

Listeners.saveTitle = function () {
   
   Worksheet.title = $('#new-title').val();
   Worksheet.render();
}

Listeners.cancel = function () {
   Worksheet.render();
}

$(document).ready(function() {
   UI.init();
});
