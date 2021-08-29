const pageListDiv = document.getElementById("page-list-div");
const pageList = document.getElementById("page-list");
let isPageListShown = false;

//---------------Page list open/close---------------
function openPageList(){
    closingPageList = false;
    isPageListShown = true;
    pageListDiv.style.height = "90vh";
    pageListDiv.style.left = "15vw";
    pageListDiv.style.width = "70vw";
    pageList.animate([
       {
          opacity:0
       },
       {
          opacity:1    }
     ], {duration: 500, easing: "ease-in"});
    generatePageList();
 }
 
 let closingPageList = false;
 
 function closePageList(){
    isPageListShown = false;
    pageListDiv.style.height = "0";
    pageListDiv.style.left = "50vw";
    pageListDiv.style.width = "0";
    closingPageList = true;
    var animation = pageList.animate([
       {
          opacity:1
       },
       {
          opacity:0    }
     ], {duration: 500, easing: "ease-in"});
     animation.onfinish = function() {
       if(closingPageList){
          clearPageList();
       }
       closingPageList = false;
       }
    
 }
 
 function togglePageList(){
    if(isPageListShown){
       closePageList();
    }
    else{
       openPageList();
    }
 }

 //Close page list on outside click
 document.addEventListener("click", function(event){
   if(isPageListShown && !(event.target.closest("#page-list-div, #page-count-button"))){
      togglePageList();
   }
})
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

