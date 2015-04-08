var Worksheet = {}

Worksheet.content = '\\documentclass{exam}\n' +
                    '\\title{Worksheet}\n' +
                    '\\begin{document}\n' +
                    '\\maketitle\n' +
                    '%\\begin{questions}\n' +
                    '%newproblem\n' +
                    '%\\end{questions}\n' +
                    '\\end{document}';
    
Worksheet.attributes = {
   
   empty: true,
   numProblems: 0
}

Worksheet.update = function () {

   var xmlhttp= new XMLHttpRequest();
   xmlhttp.open('POST','/worksheet',true);
   xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
   xmlhttp.send('worksheet=' + Worksheet.content);
   
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
         if (xmlhttp.responseText === '1') { // Error creating the pdf
            document.getElementById('preview-iframe').src = '/static/worksheets/error.txt'; 
         }
         else {
            document.getElementById('preview-iframe').src = '/static/worksheets/worksheet.txt'; 
         }
      }
   }
}
