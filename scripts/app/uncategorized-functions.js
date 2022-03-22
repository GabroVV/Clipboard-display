//--------------Loading screen----------------------
document.onreadystatechange = function () {
   if (document.readyState === 'complete') {
      document.getElementById("loading").style.opacity = 0;
      document.getElementById("loading").style.pointerEvents = "none";
   }
 }

//---------------Keyboard functions---------------
$(document).keydown(function(e) {
   switch(e.which) {
      case 79: // o key
         sidebarToggle();
      break;
      case 80: // p key
         togglePageList();
      break;
      case 37: // left arrow
          moveBackwards();
      break;
      case 39: // right arrow
         moveForward();
      break;
      case 46: // delete key
         deleteCurrentPage();
      break;
   }
})
