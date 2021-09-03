const textContainer = document.getElementById("main");
const backButton = document.getElementById("b-button");
const doubleBackButton = document.getElementById("bb-button");
const pageCounter = document.getElementById("page-count-button");
const forwardButton = document.getElementById("f-button");
const doubleForwardButton = document.getElementById("ff-button");

let animationStack = [];
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

const DirectionEnum = Object.freeze({"Left":0, "Right":1});

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
       createAndMoveTextElement(currentPage.object.text, direction, currentPage.index);
    }
 }
 
 function finishLeftoverAnimations(){
    animationStack.forEach(element => {
       element.finish();
       animationStack = animationStack.slice(animationStack.indexOf(element), 1);
    });
 }
 
 //Create new text element on the side
 function createNewTextElement(text, direction,index){
    var outsideDiv = document.createElement("div");
    var topDiv = document.createElement("div");
    var newText = document.createElement("span");
    var deleteButton = document.createElement("i");
    deleteButton.pageIndex = index;
    deleteButton.onclick = function deleteCurrentPage() {
     deletePage(this.pageIndex);
    }
    deleteButton.classList.add("delete-page-button","bi", "bi-x-lg");
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
    topDiv.appendChild(deleteButton);
    outsideDiv.appendChild(topDiv);
    return outsideDiv;
 }
 
 function createAndMoveTextElement(text,direction,index){
    finishLeftoverAnimations();
    if(!showWhitespace){
       text = text.replace(/\s/g, "");
    }
    var topDiv = createNewTextElement(text,direction,index);
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