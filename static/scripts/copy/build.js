var Build = {}

Build.Listeners = {}

Build.Listeners.selectListener = function () {
   
   var topicSelect = document.getElementById('topic-select');
   
   topicSelect.innerHTML = '';
   
   switch (this.value) {
   
      case '141':
         var options = Config.topics141;
         for (var i = 0; i < options.length; i++) {
            var option = document.createElement('option');
            option.setAttribute('value', options[i].value); 
            option.innerHTML = options[i].text;
            topicSelect.appendChild(option);   
         }
         break;
   
      default:
         var option = document.createElement('option');
         option.setAttribute('value', 0); 
         option.innerHTML = 'Not Selected';
         topicSelect.appendChild(option);
         break;
   }  

}

Build.Listeners.searchListener = function () {

   var className = document.getElementById('class-select').value;
   var topic = document.getElementById('topic-select').value;
   
   // AJAX to get problems
   var xmlhttp= new XMLHttpRequest();
   
   xmlhttp.open("GET","/database?class_name="+className+'&topic='+topic,true);
   xmlhttp.send();
   
   xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
         var resultList = JSON.parse(xmlhttp.responseText);
   
         var resultDiv = document.getElementById('result-div');
         resultDiv.innerHTML = '';
         
         var resultCount = document.createElement('p');
         resultCount.innerHTML = 'Search returned ' + resultList.length + ' problems.';
         resultDiv.appendChild(resultCount);
         
         for (var i = 0; i < resultList.length; i++) {
            
            var problemDiv = document.createElement('div');
            problemDiv.classList.add('padding');
            
            var problem = document.createElement('span');
            var addButton = document.createElement('button');
            
            problem.innerHTML = resultList[i].problem;
            addButton.innerHTML = 'Add';
            
            problem.setAttribute('id','problem' + i);
            problem.setAttribute('problem',resultList[i].problem);
            problem.setAttribute('solution',resultList[i].solution);
            problem.classList.add('padding');
            
            addButton.setAttribute('id', 'add' + i);
            addButton.setAttribute('problemNum', i);
            addButton.classList.add('add-button');
            addButton.classList.add('pure-button');
            addButton.classList.add('button-success');
            
            problemDiv.appendChild(problem);
            problemDiv.appendChild(addButton);  
            resultDiv.appendChild(problemDiv);
            document.getElementById('add' + i).addEventListener('click',Build.Listeners.addListener);   
         }
      }
   }
}

Build.Listeners.addListener = function () {

    var problem = document.getElementById('problem' + this.getAttribute('problemNum')).getAttribute('problem');;
    var solution = document.getElementById('problem' + this.getAttribute('problemNum')).getAttribute('solution');
    console.log("Add:\n Problem: " + problem + "\n Solution: " + solution);
    
    var startString = '\\begin{questions}\n';
    var newString = '%newproblem\n';
    var endString = '\\end{questions}\n';
    
    var content = Worksheet.content;
    var problemNum = Worksheet.attributes.numProblems;
    
    if (Worksheet.attributes.empty) {
       content = content.replace('%\\begin{questions}','\\begin{questions}');
       content = content.replace('%\\end{questions}','\\end{questions}');
       Worksheet.attributes.empty = false;
    }

    problem = '\\question ' + problem + '\n';
    
    content = content.replace(newString, '%p' + (problemNum + 1) + '\n' + problem + newString);
    
    Worksheet.attributes.numProblems++;
    Worksheet.content = content;
    Worksheet.update();
}
