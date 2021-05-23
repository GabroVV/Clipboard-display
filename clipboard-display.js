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
//Navbar
const backButton = document.getElementById("b-button");
const doubleBackButton = document.getElementById("bb-button");
const pageCounter = document.getElementById("page-count-button");
const forwardButton = document.getElementById("f-button");
const doubleForwardButton = document.getElementById("ff-button");
//Page list
const pageList = document.getElementById("page-list");
//Variables
let isPageListShown = false;
let isSidebarShown = false;
let animationSpeed = 1;

let clipData = [];
let localStorage = window.localStorage;
let currentPageIndex = {
   indexInternal:0,
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
function onReady(callback) {
   var intervalID = window.setInterval(checkReady, 1000);

   function checkReady() {
       if (document.getElementsByTagName('body')[0] !== undefined) {
           window.clearInterval(intervalID);
           callback.call(this);
       }
   }
}

function hide(id) {
   document.getElementById(id).style.opacity = 0;
   document.getElementById(id).style.pointerEvents = "none";
}

onReady(function () {
   hide('loading');
});
//--------------jQuery for font picker plugin----------------------
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
}

loadLocalStorageConfig();

//---------------Attempt to load previous data from local storage---------------
var clipDataRaw = localStorage.getItem('clip-data');
if(clipDataRaw !== null){
   clipData = JSON.parse(clipDataRaw);
   moveToFront();
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
function moveToIndex(newIndex){
   var oldIndex = currentPageIndex.index
   currentPageIndex.index = newIndex;
   updatePageCounter();  
   blockNavbarButtons();
   if(oldIndex < newIndex)
   {
      currentPage = currentPage.next;
      currentPage.innerText = clipData[newIndex];
      currentPage.parentNode.style.left = "0";
      currentPage.prev.parentNode.style.left = "-100vw";
      currentPage.next.parentNode.classList.add("instant-transitions");
      currentPage.next.parentNode.style.left = "100vw";
      currentPage.next.parentNode.offsetHeight;
      currentPage.next.parentNode.classList.remove("instant-transitions");
   }
   else{
      currentPage = currentPage.prev;
      currentPage.innerText = clipData[newIndex];
      currentPage.parentNode.style.left = "0";
      currentPage.next.parentNode.style.left = "100vw";
      currentPage.prev.parentNode.classList.add("instant-transitions");
      currentPage.prev.parentNode.style.left = "-100vw";
      currentPage.prev.parentNode.offsetHeight;
      currentPage.prev.parentNode.classList.remove("instant-transitions");
   }

}

function updatePageCounter(){
   var string = "";
   pageCounter.textContent = string.concat(currentPageIndex.index + 1,"/",clipData.length);
}

function moveToFront(){
   moveToIndex(clipData.length - 1);
}

function blockNavbarButtons(){
   var index =  currentPageIndex.index; 
   if(index !== 0 && index !== clipData.length - 1){
      doubleBackButton.disabled = false;
      backButton.disabled = false;
      forwardButton.disabled = false;
      doubleForwardButton.disabled = false;
   }
   else if (index == 0){
      doubleBackButton.disabled = true;
      backButton.disabled = true;
      forwardButton.disabled = false;
      doubleForwardButton.disabled = false;
   }else{
      doubleBackButton.disabled = false;
      backButton.disabled = false;
      forwardButton.disabled = true;
      doubleForwardButton.disabled = true;
   }
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

//---------------Page list open/close---------------
function openPageList(){
   isPageListShown = true;
   pageList.style.height = "90vh";
   pageList.style.left = "15vw";
   pageList.style.width = "70vw";
}

function closePageList(){
   isPageListShown = false;
   pageList.style.height = "0";
   pageList.style.left = "50vw";
   pageList.style.width = "0";
}

function togglePageList(){
   if(isPageListShown){
      closePageList();
   }
   else{
      openPageList();
   }
}