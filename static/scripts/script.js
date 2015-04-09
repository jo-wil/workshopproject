var Config, UI, Worksheet, Listeners; 

/* Config Object */
Config = {
  topics141: [{'text': 'Not Selected', 'value': '0'},
              {'text': 'Limits', 'value': 'limits'}, 
              {'text': 'Derivatives', 'value': 'derivatives'},
              {'text': 'Integrals','value': 'integrals'}]
};


/* UI bject */
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
       }
    });
     /* var Listen, addButton, i, index, len, problem, problemDiv, result, resultCount, resultDiv, resultList, results;
        resultList = JSON.parse(xmlhttp.responseText);
        resultDiv = document.getElementById('result-div');
        resultDiv.innerHTML = '';
        resultCount = document.createElement('p');
        resultCount.innerHTML = 'Search returned ' + resultList.length + ' problems.';
        resultDiv.appendChild(resultCount);
        Listen = new Listeners();
        results = [];
        for (index = i = 0, len = resultList.length; i < len; index = ++i) {
          result = resultList[index];
          problemDiv = document.createElement('div');
          problemDiv.classList.add('padding');
          problem = document.createElement('span');
          addButton = document.createElement('button');
          problem.innerHTML = result.problem;
          addButton.innerHTML = 'Add';
          problem.setAttribute('id', 'problem' + index);
          problem.setAttribute('problem', result.problem);
          problem.setAttribute('solution', result.solution);
          problem.classList.add('padding');
          addButton.setAttribute('id', 'add' + index);
          addButton.setAttribute('problemNum', index);
          addButton.classList.add('add-button');
          addButton.classList.add('pure-button');
          addButton.classList.add('button-success');
          problemDiv.appendChild(problem);
          problemDiv.appendChild(addButton);
          resultDiv.appendChild(problemDiv);
          results.push(document.getElementById('add' + index).addEventListener('click', Listen.addButtonListener));
        }
        return results;
      }
    };*/
}

$(document).ready(function() {
   UI.init();
});
