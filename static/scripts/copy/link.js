Link = {}

Link.init = function () {

   var navs = document.getElementsByClassName('link');

   for (var i = 0; i < navs.length; i++) {
      navs[i].addEventListener('click',Link.linkListener);
   }
}

Link.linkListener = function (event) {
   history.pushState(null, '', this.id);
   UI.contentManager();
}

Link.stateListener = function (event) {
   UI.contentManager();
}
