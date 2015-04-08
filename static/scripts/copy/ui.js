var UI = {}

UI.init = function () {

   this.content = document.getElementById('content');	
   Link.init();
}

UI.contentManager = function () {

   var linkString;

   linkString = window.location.pathname.replace('/','');

   if(linkString === '') { // TODO could redirect to home maybe
      linkString = 'home';
   }

   var xmlhttp = new XMLHttpRequest();
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
         UI.content.innerHTML=xmlhttp.responseText;
         UI.render(linkString);
      }
   }
   xmlhttp.open('GET', '/content?page='+linkString, true);
   xmlhttp.send();
   
}

UI.render = function (link) {
   
   switch (link) {
   
      case 'build':
         Render.build();
         break;
      case 'add':
         // TODO
         break;
   }
}
