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

function openSidebar() {
   document.getElementById("sidebar").style.opacity = "1";
   document.getElementById("sidebar").style.right = "0px";
   document.getElementById("main").style.marginRight = "300px";
}
 
function closeSidebar() {
   document.getElementById("sidebar").style.opacity = "0";
   document.getElementById("sidebar").style.right = "-300px";
   document.getElementById("main").style.marginRight = "0";
} 
 //---------------Font Slider---------------

 const fontSilder = document.getElementById("font-size-input");
 const fontTextInput = document.getElementById("font-size-text-input");
 const text = document.getElementsByClassName("text-container");

 fontSilder.oninput = function() {
    console.log("ekee")
    var fontSize = this.value;
    for (block of text){
       fontTextInput.value = this.value;
       block.style.fontSize = fontSize.concat("em"); //change font size to slider value in em unit
    }
 }

 function fontSizeTextInput() {
    var fontSize = fontTextInput.value;
    console.log(fontSize);
    fontSilder.value = fontSize
    for (block of text){
      block.style.fontSize = fontSize.concat("em"); //change font size to slider value in em unit
   }
 }

 //---------------Font Color---------------
function fontColorChange(color) {
    for (block of text){
       block.style.color = color.toHEXString(); //change font color to hex value from picker
    }
}
  //---------------Background Color---------------
function backgroundColorChange(color) {
   document.body.style.backgroundColor = color.toHEXString(); //change background color to hex value from picker
}