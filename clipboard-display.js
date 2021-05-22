//---------------Document element constants---------------
const currentLineDiv = document.getElementById("current-line");
const prevLineDiv = document.getElementById("prev-line");
const nextLineDiv = document.getElementById("next-line");
const fontSilder = document.getElementById("font-size-input");
const fontTextInput = document.getElementById("font-size-text-input");
const fontColorPicker = document.getElementById("font-color-picker");
const bgColorPicker = document.getElementById("bg-color-picker")
const text = document.getElementsByClassName("text-container");
let isSidebarShown = false;
let clipData = [];
let localStorage = window.localStorage;
let currentPageIndex = {
   indexInternal:0,
   set index(val) {
      this.indexInternal = val;
      console.log("Someone changed the value of index to " + val)
    },
    get index() {
      return this.indexInternal;
    },
};

let currentPage = currentLineDiv;
//--------------Div ordering----------------------
currentLineDiv.next = nextLineDiv;
prevLineDiv.next = currentLineDiv;
nextLineDiv.next = prevLineDiv;

currentLineDiv.prev = prevLineDiv;
prevLineDiv.prev = nextLineDiv;
nextLineDiv.prev = currentLineDiv;
//---------------Attempt to load config from local storage---------------
function loadLocalStorageConfig(){
   var fontSize = localStorage.getItem('font-size');
   var bgHex = localStorage.getItem('bg-hex');
   var fontHex = localStorage.getItem('font-hex');
   if(fontSize !== null){
      for (block of text){
         block.style.fontSize = fontSize; //change font size to localstorage value in em
      }
      fontSizeNumber = fontSize.substring(0,fontSize.indexOf("em"));
      fontTextInput.value = fontSizeNumber; //change font size inputs to new value
      fontSilder.value = fontSizeNumber; 
   }

   if(bgHex !== null){
      document.body.style.backgroundColor = bgHex; //change background color to hex value from localstorage
      bgColorPicker.value = bgHex;  //change color picker display to new value
   }
   if(fontHex !== null){
      for (block of text){
         block.style.color = fontHex; //change font color to hex value from localstorage
      }
      fontColorPicker.value = fontHex; //change color picker display to new value
   }
}

loadLocalStorageConfig();

//---------------Attempt to load previous data from local storage---------------
var clipDataRaw = localStorage.getItem('clip-data');
if(clipDataRaw !== null){
   clipData = JSON.parse(clipDataRaw);
   console.log(clipData);
}
//---------------Clipboard addon handling---------------

const observer = new MutationObserver(function DOMMutationHandler(mutationList, observer) {
   for(const mutation of mutationList){
       let nodes = mutation.addedNodes;
       for(let node of nodes) {
         if(node.tagName === "P"){ // Find <p> tag added by addon
           clipData.push(node.innerText); 
           localStorage.setItem("clip-data", JSON.stringify(clipData)); // Add new data to localStorage
           node.remove(); // Remove <p> tag added by addon
           moveToFront();
           break;
        }
       };
   }
}
)

function moveForward(){
   moveToIndex(currentPageIndex.index + 1);
}

function moveBackwards(){
   moveToIndex(currentPageIndex.index - 1);
}

function moveToRear(){
   moveToIndex(0);
}
function moveToIndex(index){
   currentPage = currentPage.next;
   currentPageIndex.index = index;  
   currentPage.innerText = clipData[index];
   currentPage.parentNode.style.left = "0";
   currentPage.prev.parentNode.style.left = "-100vw";
   currentPage.next.parentNode.classList.add("instant-transitions");
   currentPage.next.parentNode.style.left = "100vw";
   currentPage.next.parentNode.offsetHeight;
   currentPage.next.parentNode.classList.remove("instant-transitions");
}
function moveToFront(){
   moveToIndex(clipData.length - 1);
}


// Only observe childList mutations
const config = { attributes: false, childList: true, subtree: false };
const observerTargetNode = document.body;
observer.observe(observerTargetNode, config);

//---------------Sidebar---------------
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
   document.getElementsByTagName("main")[0].style.marginRight = "300px";
}
 
function closeSidebar() {
   document.getElementById("sidebar").style.opacity = "0";
   document.getElementById("sidebar").style.right = "-300px";
   document.getElementsByTagName("main")[0].style.marginRight = "0";
} 
 //---------------Font Slider---------------
 fontSilder.oninput = function() {
    var fontSize = this.value;
    for (block of text){
       fontTextInput.value = this.value;
       block.style.fontSize = fontSize.concat("em"); //change font size to slider value in em unit
    }
    localStorage.setItem('font-size',fontSize.concat("em"))
 }

 function fontSizeTextInput() {
    var fontSize = fontTextInput.value;
    fontSilder.value = fontSize
    for (block of text){
      block.style.fontSize = fontSize.concat("em"); //change font size to slider value in em unit
      }
    localStorage.setItem('font-size',fontSize.concat("em"))
 }

 //---------------Font Color---------------
function fontColorChange(color) {
   var fontHex = color.toHEXString();
    for (block of text){
       block.style.color = fontHex; //change font color to hex value from picker
    }
    localStorage.setItem("font-hex", fontHex);

}
  //---------------Background Color---------------
function backgroundColorChange(color) {
   var bgHex = color.toHEXString();
   document.body.style.backgroundColor = bgHex; //change background color to hex value from picker
   localStorage.setItem("bg-hex", bgHex);
}

