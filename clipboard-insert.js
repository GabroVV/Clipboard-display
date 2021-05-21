//---------------Clipboard addon handling---------------

const newLineDiv = document.getElementById("new-line");
const prevLineDiv = document.getElementById("prev-line");

const observer = new MutationObserver(function DOMMutationHandler(mutationList, observer) {
   for(const mutation of mutationList){
       let nodes = mutation.addedNodes;
       for(let node of nodes) {
         if(node.tagName === "P"){ // Find <p> tag added by addon
           console.log("Why");
           prevLineDiv.innerText = newLineDiv.innerText;
           newLineDiv.innerText = node.innerText;
           node.remove(); // Remove <p> tag added by addon
           break;
        }
       };
       
   }
}
)

// Only observe childList mutations
const config = { attributes: false, childList: true, subtree: false };
const observerTargetNode = document.body;
observer.observe(observerTargetNode, config);

//---------------Sidebar---------------
let isSidebarShown = false;
function sidebarToggle() {
   if(isSidebarShown){
      closeSidebar();
   }
   else{
      openSidebar();
   }
   isSidebarShown = !isSidebarShown;
}
/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openSidebar() {
   document.getElementById("sidebar").style.width = "250px";
   document.getElementById("main").style.marginRight = "250px";
 }
 
 /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
 function closeSidebar() {
   document.getElementById("sidebar").style.width = "0";
   document.getElementById("main").style.marginRight = "0";
 } 
