var Config, UI, Worksheet, Listeners; 

/* Config Object */
Config = {
  topics141: [{'text': 'Not Selected', 'value': '0'},
              {'text': 'Limits', 'value': 'limits'}, 
              {'text': 'Derivatives', 'value': 'derivatives'},
              {'text': 'Integrals','value': 'integrals'},
              {'text': 'Taylor and Maclaurin Series','value': 'sdal'}]
};


/* UI Object */
UI = {}

UI.init = function () {

   console.log('Init UI...');
   $('#class-select').on('change',Listeners.classSelect);
   $('#search-button').on('click',Listeners.searchButton);

}

/* Worksheet Object */


/* Listeners Object */
Listeners = {}

Listeners.classSelect = function () {
   var i, len, o, option, options, topicSelect;
   topicSelect = $('#topic-select');
   topicSelect.html('');
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
   var className, topic, len, result, resultList, resultDiv, resultCount, problemDiv;
    className = $('#class-select').val();
    topic = $('#topic-select').val();
    $.get("/database", {'class_name':className,'topic':topic}, function (data, status) {
    
       resultList = JSON.parse(data);
       len = resultList.length;
       
       resultDiv = $('#result-div');
       resultDiv.html('');
       
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

   var problem, solution, parentDiv, problemSpan, worksheetDiv, problemDiv;
   parentDiv = $(this).parent();
   problemSpan = parentDiv.find('span');
   
   problem = problemSpan.attr('problem');
   solution = problemSpan.attr('solution');
   problemSpan = $('<span></span>').addClass('padding').attr({'problem':problem, 'solution':solution}).html(problem);
   worksheetDiv = $('#worksheet-content');
   problemDiv = $('<div></div>').addClass('padding border');
   problemDiv.append(problemSpan);
   worksheetDiv.append(problemDiv);
   
   // TODO Add to worksheet datastructure
}

$(document).ready(function() {
   UI.init();
});
