var main = function () {

   UI.init();
   UI.contentManager();
}

window.addEventListener('load',main);
window.addEventListener('popstate',Link.stateListener);
