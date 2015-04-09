Config =
   topics141: [{'text':'Not Selected','value':'0'},
               {'text':'Limits','value':'limits'},
               {'text':'Derivatives','value':'derivatives'},
               {'text':'Integrals','value':'integrals'}]

class UI

  constructor: ->
    @addListeners()

  addListeners: ->
    console.log("Adding listeners")
    
    Listen = new Listeners()
    
    document.getElementById('class-select').addEventListener('change',Listen.classSelectListener)
    document.getElementById('search-button').addEventListener('click',Listen.searchButtonListener)
    
    return

class Listeners
  
  constructor: ->
    @worksheet = window.worksheet
    
  classSelectListener: ->
   
    topicSelect = document.getElementById('topic-select')
    topicSelect.innerHTML = ''
   
    switch @.value
      when '141'
        options = Config.topics141
        for o in options
          option = document.createElement('option')
          option.setAttribute('value', o.value)
          option.innerHTML = o.text
          topicSelect.appendChild(option)
   
      else
        option = document.createElement('option')
        option.setAttribute('value', 0)
        option.innerHTML = 'Not Selected'
        topicSelect.appendChild(option)
        
    return

  searchButtonListener: ->    
    #// AJAX to get problems
    
    className = document.getElementById('class-select').value
    topic = document.getElementById('topic-select').value
    
    xmlhttp = new XMLHttpRequest();
   
    xmlhttp.open("GET","/database?class_name="+className+'&topic='+topic,true);
    xmlhttp.send()
   
    xmlhttp.onreadystatechange = ->
       if xmlhttp.readyState is 4 and xmlhttp.status is 200
         
         resultList = JSON.parse(xmlhttp.responseText)
         resultDiv = document.getElementById('result-div')
         resultDiv.innerHTML = ''
         
         resultCount = document.createElement('p')
         resultCount.innerHTML = 'Search returned ' + resultList.length + ' problems.'
         resultDiv.appendChild(resultCount)
         
         Listen = new Listeners()
         
         for result, index in resultList
           problemDiv = document.createElement('div')
           problemDiv.classList.add('padding')
           problem = document.createElement('span')
           addButton = document.createElement('button')
            
           problem.innerHTML = result.problem
           addButton.innerHTML = 'Add'
            
           problem.setAttribute('id','problem' + index)
           problem.setAttribute('problem',result.problem)
           problem.setAttribute('solution',result.solution)
           problem.classList.add('padding')
            
           addButton.setAttribute('id', 'add' + index)
           addButton.setAttribute('problemNum', index)
           addButton.classList.add('add-button')
           addButton.classList.add('pure-button')
           addButton.classList.add('button-success')
            
           problemDiv.appendChild(problem)
           problemDiv.appendChild(addButton)  
           resultDiv.appendChild(problemDiv)
           document.getElementById('add' + index).addEventListener('click',Listen.addButtonListener)

    return
    
  addButtonListener: ->
    problem = document.getElementById('problem' + @.getAttribute('problemNum')).getAttribute('problem')
    solution = document.getElementById('problem' + @.getAttribute('problemNum')).getAttribute('solution')
    worksheet.addProblem(problem, solution)
    console.log(problem)
    console.log(solution)
    return

class Worksheet

   constructor: ->
     @problems = []
     @defaultContent = """\\documentclass{article}
                          \\title{Worksheet}
                          \\author{SWM}
                          \\begin{document}
                          \\maketitle\n
                          %problems
                          \\end{document}"""
     @content = @defaultContent
     @update()
                 
   addProblem: (problem, solution) ->
   
     @problems.push({'problem':problem,'solution':solution})
   
     @content = @defaultContent
     
     problemString = '%problems\n'
     
     space = '\\vspace{5mm}\n\n'
     
     for p in @problems
       problem = p.problem + '\n\n'
       solution = p.solution + '\n\n'
       @content = @content.replace(problemString, problem + solution + space + problemString)   
        
     @update()
     return
     
   update: ->
     #// AJAX to refresh worksheet
     
     xmlhttp= new XMLHttpRequest()
     xmlhttp.open('POST','/worksheet',true)
     xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded')
     xmlhttp.send('worksheet=' + @content)
   
     xmlhttp.onreadystatechange = ->
       if xmlhttp.readyState is 4 and xmlhttp.status is 200 
         document.getElementById('preview-iframe').contentWindow.location.reload() #// = "/static/worksheets/worksheet.txt"
         return
        
     return
    
main = ->
  UI = new UI()
  window.worksheet = new Worksheet()

window.addEventListener('load', main)
