var Render = {}

Render.build = function () {

   var classSelect = document.getElementById('class-select');
   
   var options = Config.classes;
   for (var i = 0; i < options.length; i++) {
      var option = document.createElement('option');
      option.setAttribute('value', options[i].value); 
      option.innerHTML = options[i].text;
      classSelect.appendChild(option);   
   }

   document.getElementById('class-select').addEventListener('change', Build.Listeners.selectListener);
   document.getElementById('search-button').addEventListener('click',Build.Listeners.searchListener);
   document.getElementById('reload-button').addEventListener('click',Iframe.refresh);
  
   Worksheet.update();
}
