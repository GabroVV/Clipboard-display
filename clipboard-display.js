//---------------Document element constants---------------
const DirectionEnum = Object.freeze({"Left":0, "Right":1});
const textContainer = document.getElementById("main");
//Sidebar
const fontSilder = document.getElementById("font-size-input");
const fontTextInput = document.getElementById("font-size-text-input");
const fontColorPicker = document.getElementById("font-color-picker");
const bgColorPicker = document.getElementById("bg-color-picker")
const animationSpeedSlider = document.getElementById("animation-speed-slider");
const animationSpeedText = document.getElementById("animation-speed-text");
const animationType = document.getElementById("animation-type");
const whitespaceCheckbox = document.getElementById("whitespace-checkbox");
//Navbar
const backButton = document.getElementById("b-button");
const doubleBackButton = document.getElementById("bb-button");
const pageCounter = document.getElementById("page-count-button");
const forwardButton = document.getElementById("f-button");
const doubleForwardButton = document.getElementById("ff-button");
//Page list
const pageListDiv = document.getElementById("page-list-div");
const pageList = document.getElementById("page-list");
//Character count
const charCount = document.getElementById("char-count-value");
const charCountDiv = document.getElementById("char-count-div")
const totalCount = document.getElementById("total-count-value");
const japanCount = document.getElementById("japanese-count-value");
const kataCount = document.getElementById("katakana-count-value");
const hiraCount = document.getElementById("hiragana-count-value");
const kanjiCount = document.getElementById("kanji-count-value");
const latinCount = document.getElementById("roman-count-value");
const otherCount = document.getElementById("other-count-value");

//Variables
let characters = {
   total : 0,
   japanse : 0,
   kanji : 0,
   kata : 0,
   hira : 0,
   roman : 0,
   other : 0
}
let isPageListShown = false;
let isCharCountShown = false;
let isSidebarShown = false;
let animationSpeed = 1000;
let animationTypeText = "linear";
let clipData = [];
let animationStack = [];
let showWhitespace = true;
let localStorage = window.localStorage;
let currentPage = {
   indexInternal: -1,
   objectInternal: {text: ""},
   set index(val) {
      this.indexInternal = val;
    },
    get index() {
      return this.indexInternal;
    },
    set object(val) {
      this.objectInternal = val;
    },
    get object() {
      return this.objectInternal;
    },
    updateIndex : function () {
      this.index = clipData.findIndex(element => element.id === this.objectInternal.id);
    },
};
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
   var whitespace = localStorage.getItem('whitespace');
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
   if(whitespace !== null){
      showWhitespace = whitespace == 'true';
   }
   whitespaceCheckbox.checked = showWhitespace;
}

loadLocalStorageConfig();

//---------------Attempt to load previous data from local storage---------------
var clipDataRaw = localStorage.getItem('clip-data');
if(clipDataRaw !== null && clipDataRaw.length > 0){
   clipData = JSON.parse(clipDataRaw);
   moveToFront();
}
updateViewOnDataChange();

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
   localStorage.setItem("clip-data", JSON.stringify(clipData)); // Add new data to localStorage
   addStringCharactersLength(text);
   moveToFront();
}

function moveForward(){
   moveToIndex(currentPage.index + 1);
}

function moveBackwards(){
   moveToIndex(currentPage.index - 1);
}

function moveToRear(){
   moveToIndex(0);
}

function moveToFront(){
   moveToIndex(clipData.length - 1);
}
function moveToIndex(newIndex){
   currentPage.object = clipData[newIndex];
   var oldIndex = currentPage.index;
   if(!(oldIndex === newIndex) && newIndex < clipData.length && newIndex >= 0){ //avoid moving to same element or outside of bounds
      currentPage.index = newIndex;
      updateViewOnDataChange();
      var direction;
      if(oldIndex < newIndex){
         direction = DirectionEnum.Left;
      }
      else{
         direction = DirectionEnum.Right;
      }
      createAndMoveTextElement(currentPage.object.text, direction);
   }
}

function finishLeftoverAnimations(){
   animationStack.forEach(element => {
      element.finish();
      animationStack = animationStack.slice(animationStack.indexOf(element), 1);
   });
}

//Create new text element on the side
function createNewTextElement(text, direction){
   var outsideDiv = document.createElement("div");
   var topDiv = document.createElement("div");
   var newText = document.createElement("div");
   newText.innerText = text;
   outsideDiv.classList.add("outside-div");
   newText.classList.add("content");
   topDiv.classList.add("new-page");
   if(direction === DirectionEnum.Right){
      topDiv.classList.add("right");
   }else{
      topDiv.classList.add("left");
   }
   textContainer.appendChild(outsideDiv);
   topDiv.appendChild(newText);
   outsideDiv.appendChild(topDiv)
   return outsideDiv;
}

function createAndMoveTextElement(text,direction){
   finishLeftoverAnimations();
   if(!showWhitespace){
      text = text.replace(/\s/g, "");
   }
   var topDiv = createNewTextElement(text,direction);
   var pages = document.getElementsByClassName("outside-div");
   //Mark text element
   for (page of pages) {
      page.current = false;
   }
   topDiv.current = true;
   var from, to, fromPrevious,toPrevious;
   if(direction === DirectionEnum.Right){
      from = "-100vw";
      to = "0";
      fromPrevious = "0";
      toPrevious = "100vw";
    }
   if(direction === DirectionEnum.Left){
      from = "100vw";
      to = "0";
      fromPrevious = "0";
      toPrevious = "-100vw";
   }
   // New text animation
   var animation = topDiv.animate([
   {
      left:from
   },
   { 
      left:to      }
   ], {duration: animationSpeed, easing: animationTypeText});
   animationStack.push(animation);
   // Destroy other text elements on animation finish
   animation.onfinish = function() {
      var pages = document.getElementsByClassName("outside-div");
      for (page of pages) {
         if(!page.current){
            page.remove();
         }
      }
   }
    // All other leftover text animation
    for(page of pages){
       if(!page.current){
         var animationPrevious = page.animate([
            {
              left:fromPrevious
            },
            {
              left:toPrevious      }
          ], {duration: animationSpeed, easing: animationTypeText});
          animationStack.push(animationPrevious);
       }
    };
}


function updatePageCounter(){
   var string = "";
   pageCounter.textContent = string.concat(currentPage.index + 1,"/",clipData.length);
}

function updateNavbarButtonsDisabled(){
   var index =  currentPage.index; 
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

function updateViewOnDataChange(){
   updateNavbarButtonsDisabled();
   updatePageCounter();
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
}
 
function closeSidebar() {
   document.getElementById("sidebar").style.opacity = "0";
   document.getElementById("sidebar").style.right = "-300px";
} 

//Close sidebars on outside click
document.addEventListener("click", function(event){
   if(isSidebarShown && !(event.target.closest("#sidebar, #sidebar-button, .font-picker, .jscolor-picker"))){
      sidebarToggle();
   }
   if(isCharCountShown && !(event.target.closest("#char-count-div, #char-count"))){
      toggleCharacterCountList();
   }
})
 //---------------Font Slider---------------
 fontSilder.oninput = function() {
    setFontSize(this.value);
 }

 function setFontSize(value){
   fontTextInput.value = value;
   fontSilder.value = value;
   textContainer.style.fontSize = value.concat("em"); //change font size to slider value in em unit
   localStorage.setItem('font-size',value)
 }

 //---------------Font change---------------
 function fontChange(newFont){
   localStorage.setItem("font", newFont);
   var fontProps = newFont.split(':');
   var fontFamily = fontProps[0];
   var fontStyle = (fontProps[1].includes("i") ? "italic" : "normal");
   var fontWeight = parseInt(fontProps[1],10) || '400';
   textContainer.style.fontStyle = fontStyle;
   textContainer.style.fontWeight = fontWeight;
   textContainer.style.fontFamily = fontFamily; 
   pageList.style.fontStyle = fontStyle;
   pageList.style.fontWeight = fontWeight;
   pageList.style.fontFamily = fontFamily; 
 }
 //---------------Font Color---------------
function setFontColor(color) {
   fontColorPicker.value = color;
   textContainer.style.color = color; //change font color to hex value from picker
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
   animationSpeed = value * 1000;
   animationSpeedText.value = value;
   animationSpeedSlider.value = value;
   localStorage.setItem('animation-speed', value)
}
 //---------------Animation Type---------------
function setAnimationType(value){
   animationTypeText = value;
   animationType.value = value;
   textContainer.style.transitionTimingFunction = value;
   localStorage.setItem('animation-type', value)
}
 //---------------Whitespace---------------
 function updateShowWhitespace(){
   showWhitespace = whitespaceCheckbox.checked;
   var text = currentPage.object.text;
   if(!showWhitespace){
     text = text.replace(/\s/g, "");
   }
   var contents = document.getElementsByClassName("content");
   for(const content of contents){
      content.innerText = text;
   }
   localStorage.setItem('whitespace', showWhitespace);
   
}


//---------------Page list open/close---------------
function openPageList(){
   isPageListShown = true;
   pageListDiv.style.height = "90vh";
   pageListDiv.style.left = "15vw";
   pageListDiv.style.width = "70vw";
   generatePageList();
}

function closePageList(){
   isPageListShown = false;
   pageListDiv.style.height = "0";
   pageListDiv.style.left = "50vw";
   pageListDiv.style.width = "0";
   clearPageList();
}

function togglePageList(){
   if(isPageListShown){
      closePageList();
   }
   else{
      openPageList();
   }
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

function clearPageList(){
   pageList.innerHTML = '';
}

function pageListElementChosen(id){
   var listElement = clipData.find(element => element.id == id);
   moveToIndex(clipData.indexOf(listElement));
   closePageList();
}
//---------------Delete page---------------
function deletePage(pageNumber){
   if(clipData.length <= 1){
      clearPage();
   }
   else if(pageNumber === currentPage.index && pageNumber !== 0){
      moveBackwards();
   }
   else if (pageNumber === currentPage.index && pageNumber === 0){
      moveForward();
   }

   if(pageNumber >= 0 && pageNumber < clipData.length){
      let removed = clipData.splice(pageNumber, 1);
      subtractStringCharactersLength(removed.pop().text);
      localStorage.setItem("clip-data", JSON.stringify(clipData));
      currentPage.updateIndex();
      updateViewOnDataChange();
   }
}

function clearPage(){
   var pages = document.getElementsByClassName("content");
   for (const page of pages) {
      page.innerText  = "";
      console.log(page);
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
         deletePage(currentPage.index);
      break;
   }
})

//---------------Character counter---------------

function openCharacterCountList(){
   isCharCountShown = true;
   charCountDiv.style.opacity = "1";
   charCountDiv.style.left = "0";
}

function closeCharacterCountList(){
   isCharCountShown = false;
   charCountDiv.style.opacity = "0";
   charCountDiv.style.left = "-300px";
}

function toggleCharacterCountList(){
   if(isCharCountShown){
      closeCharacterCountList();
   }
   else{
      openCharacterCountList();
   }
}
function addStringCharactersLength(string){
   characters.total += string.length;
   for(let char of string){
      if(char >= "\u3040" && char <= "\u309f"){
         characters.hira++;
         characters.japanse++;
      }else if (char >= "\u30a0" && char <= "\u30ff" || char>='ｦ' && char <= 'ﾝ'){
         characters.kata++;
         characters.japanse++;
      }else if (char >= "\u4e00" && char <= "\u9faf"){
         characters.kanji++;
         characters.japanse++;
      }else if (char >= "\u3400" && char <= "\u4dbf"){
         characters.kanji++;
         characters.japanse++;
      }else if (char >= "\u30a0" && char <= "\u30ff"){
         characters.kata++;
         characters.japanse++;    
      }else if(char>='0' && char<='9' || char>='A' && char <= 'z' ||char>='Ａ' && char <= 'Ｚ' || char>='ａ' && char <= 'ｚ'){
         characters.roman++;
      }else{
         characters.other++;
      }
   }
      updateCharacterCountDisplay()
}

function subtractStringCharactersLength(string){
   characters.total -= string.length;
}

function updateCharacterCountDisplay(){
   totalCount.innerHTML = characters.total;
   japanCount.innerHTML = characters.japanse;
   kataCount.innerHTML = characters.kata;
   hiraCount.innerHTML = characters.hira;
   latinCount.innerHTML = characters.roman;
   kanjiCount.innerHTML = characters.kanji;
   otherCount.innerHTML = characters.other;
}
