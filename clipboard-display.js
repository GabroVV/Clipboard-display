//---------------Document element constants---------------
const currentLineDiv = document.getElementById("current-line");
const prevLineDiv = document.getElementById("prev-line");
const nextLineDiv = document.getElementById("next-line");
const text = document.getElementsByClassName("text-container");
//Sidebar
const fontSilder = document.getElementById("font-size-input");
const fontTextInput = document.getElementById("font-size-text-input");
const fontColorPicker = document.getElementById("font-color-picker");
const bgColorPicker = document.getElementById("bg-color-picker")
const animationSpeedSlider = document.getElementById("animation-speed-slider");
const animationSpeedText = document.getElementById("animation-speed-text");
const animationType = document.getElementById("animation-type");
//Navbar
const backButton = document.getElementById("b-button");
const doubleBackButton = document.getElementById("bb-button");
const pageCounter = document.getElementById("page-count-button");
const forwardButton = document.getElementById("f-button");
const doubleForwardButton = document.getElementById("ff-button");
//Page list
const pageListDiv = document.getElementById("page-list-div");
const pageList = document.getElementById("page-list");

//Variables
let isPageListShown = false;
let isSidebarShown = false;
let animationSpeed = 1;

let clipData = [];
let localStorage = window.localStorage;
let currentPageIndex = {
   indexInternal: -1,
   set index(val) {
      this.indexInternal = val;
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
//--------------Loading screen----------------------
document.onreadystatechange = function () {
   if (document.readyState === 'complete') {
      document.getElementById("loading").style.opacity = 0;
      document.getElementById("loading").style.pointerEvents = "none";
   }
 }

//---------jQuery for font picker plugin----------------------
$(document).ready(function() {
   $('input.fonts').fontpicker({
      lang: 'en',
      variants: true,
      lazyLoad: true,
      showClear: false,
      nrRecents: 3,
      googleFonts: true,
   });
});
//---------------Attempt to load config from local storage---------------
function loadLocalStorageConfig(){
   var fontSize = localStorage.getItem('font-size');
   var bgHex = localStorage.getItem('bg-hex');
   var fontHex = localStorage.getItem('font-hex');
   var font = localStorage.getItem('font');
   var animationSpeedSaved = localStorage.getItem('animation-speed');
   var animationTypeSaved = localStorage.getItem('animation-type');
   if(fontSize !== null){
      setFontSize(fontSize);
   }
   if(bgHex !== null){
      setBackgroundColor(bgHex);
   }
   if(fontHex !== null){
      setFontColor(fontHex);
   }
   if(font !== null){
      $('#font').val(font).trigger('change');
   } else {
      $('#font').val("Tahoma:400").trigger('change')
   }
   if(animationSpeedSaved !== null){
      setAnimationSpeed(animationSpeedSaved);
   }
   if(animationTypeSaved !== null){
      setAnimationType(animationTypeSaved);
   }
}

loadLocalStorageConfig();

//---------------Attempt to load previous data from local storage---------------
var clipDataRaw = localStorage.getItem('clip-data');
if(clipDataRaw !== null){
   clipData = JSON.parse(clipDataRaw);
   moveToFront();
}else{
   updatePageCounter();
   updateNavbarButtonsDisabled();
}

//---------------Manage page list elements---------------
function generatePageList(){
   for (const element of clipData) {
      addNewListElement(element);
   }
}

function addNewListElement(element){
   var listElement = document.createElement("li");
   listElement.jsId = element.id;
   listElement.onclick = function() {pageListElementChosen(this.jsId)};
   listElement.appendChild(document.createTextNode(element.text));
   document.getElementById("page-list").prepend(listElement);
}

function pageListElementChosen(id){
   var listElement = clipData.find(element => element.id == id);
   moveToIndex(clipData.indexOf(listElement));
   closePageList();
}
generatePageList();
//---------------Clipboard addon handling---------------
   const observer = new MutationObserver(function DOMMutationHandler(mutationList, observer) {
      for(const mutation of mutationList){
          let nodes = mutation.addedNodes;
          for(let node of nodes) {
            if(node.tagName === "P"){ // Find <p> tag added by addon
              handleNewNode(node.innerText);
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

function handleNewNode(text){
   var id;
   if(clipData.length > 0){
    id = clipData[clipData.length - 1].id + 1;
   } else {
      id = 0;
   }
   var clipElement = {id: id ,text: text}
   clipData.push(clipElement);
   addNewListElement(clipElement);
   localStorage.setItem("clip-data", JSON.stringify(clipData)); // Add new data to localStorage
   moveToFront();
}

function moveForward(){
   moveToIndex(currentPageIndex.index + 1);
}

function moveBackwards(){
   moveToIndex(currentPageIndex.index - 1);
}

function moveToRear(){
   moveToIndex(0);
}

function moveToFront(){
   moveToIndex(clipData.length - 1);
}
function moveToIndex(newIndex){
   var oldIndex = currentPageIndex.index
   if(!(oldIndex === newIndex)){ //avoid moving to same element
      currentPageIndex.index = newIndex;
      updatePageCounter();  
      updateNavbarButtonsDisabled();
      if(oldIndex < newIndex)
      {
         currentPage = currentPage.next;
         currentPage.innerText = clipData[newIndex].text;
         currentPage.parentNode.style.left = "0";
         currentPage.prev.parentNode.style.left = "-100vw";
         currentPage.next.parentNode.classList.add("instant-transitions");
         currentPage.next.parentNode.style.left = "100vw";
         currentPage.next.parentNode.offsetHeight;
         currentPage.next.parentNode.classList.remove("instant-transitions");
      }
      else{
         currentPage = currentPage.prev;
         currentPage.innerText = clipData[newIndex].text;
         currentPage.parentNode.style.left = "0";
         currentPage.next.parentNode.style.left = "100vw";
         currentPage.prev.parentNode.classList.add("instant-transitions");
         currentPage.prev.parentNode.style.left = "-100vw";
         currentPage.prev.parentNode.offsetHeight;
         currentPage.prev.parentNode.classList.remove("instant-transitions");
      }
   }
}

function updatePageCounter(){
   var string = "";
   pageCounter.textContent = string.concat(currentPageIndex.index + 1,"/",clipData.length);
}



function updateNavbarButtonsDisabled(){
   var index =  currentPageIndex.index; 
   if(index !== 0 && index !== clipData.length - 1){
      doubleBackButton.disabled = false;
      backButton.disabled = false;
      forwardButton.disabled = false;
      doubleForwardButton.disabled = false;
   }
   else if (index == 0 && clipData.length !== 1){
      doubleBackButton.disabled = true;
      backButton.disabled = true;
      forwardButton.disabled = false;
      doubleForwardButton.disabled = false;
   }else if(clipData.length > 1){
      doubleBackButton.disabled = false;
      backButton.disabled = false;
      forwardButton.disabled = true;
      doubleForwardButton.disabled = true;
   }else{
      doubleBackButton.disabled = true;
      backButton.disabled = true;
      forwardButton.disabled = true;
      doubleForwardButton.disabled = true;
   }
}




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

document.addEventListener("click", function(event){
   if(isSidebarShown && !(event.target.closest("#sidebar, #sidebar-button, .font-picker, .jscolor-picker"))){
      sidebarToggle();
   }
})
 //---------------Font Slider---------------
 fontSilder.oninput = function() {
    setFontSize(this.value);
 }

 function setFontSize(value){
   fontTextInput.value = value;
   fontSilder.value = value;
   for (block of text){
     block.style.fontSize = value.concat("em"); //change font size to slider value in em unit
     }
   localStorage.setItem('font-size',value)
 }

 //---------------Font change---------------
 function fontChange(newFont){
   localStorage.setItem("font", newFont);
   var fontProps = newFont.split(':');
   var fontFamily = fontProps[0];
   console.log(fontProps[1]);
   console.log(fontProps[1].includes("i"));
   var fontStyle = (fontProps[1].includes("i") ? "italic" : "normal");
   var fontWeight = parseInt(fontProps[1],10) || '400';
   for (block of text){
      block.style.fontStyle = fontStyle;
      block.style.fontWeight = fontWeight;
      block.style.fontFamily = fontFamily; 
   }
   pageList.style.fontStyle = fontStyle;
   pageList.style.fontWeight = fontWeight;
   pageList.style.fontFamily = fontFamily; 
 }
 //---------------Font Color---------------
function setFontColor(color) {
   fontColorPicker.value = color;
    for (block of text){
       block.style.color = color; //change font color to hex value from picker
    }
    localStorage.setItem("font-hex", color);

}
  //---------------Background Color---------------
function setBackgroundColor(color) {
   document.body.style.backgroundColor = color; //change background color to hex value from picker
   bgColorPicker.value = color;
   localStorage.setItem("bg-hex", color);
}

 //---------------Animation speed Slider---------------
 animationSpeedSlider.oninput = function() {
   setAnimationSpeed(this.value);
}

function setAnimationSpeed(value){
   animationSpeedText.value = value;
   animationSpeedSlider.value = value;
   for (block of text){
     block.style.transitionDuration = value.concat("s");
   }
   localStorage.setItem('animation-speed', value)
}
 //---------------Animation Type---------------
function setAnimationType(value){
   animationType.value = value;
   for (block of text){
      block.style.transitionTimingFunction = value;
    }
    localStorage.setItem('animation-type', value)
}

//---------------Page list open/close---------------
function openPageList(){
   isPageListShown = true;
   pageListDiv.style.height = "90vh";
   pageListDiv.style.left = "15vw";
   pageListDiv.style.width = "70vw";
}

function closePageList(){
   isPageListShown = false;
   pageListDiv.style.height = "0";
   pageListDiv.style.left = "50vw";
   pageListDiv.style.width = "0";
}

function togglePageList(){
   if(isPageListShown){
      closePageList();
   }
   else{
      openPageList();
   }
}