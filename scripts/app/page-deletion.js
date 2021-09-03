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
       adjustCharacterCount(removed.pop().text, -1);
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
    var deleteButtons = document.getElementsByClassName("delete-page-button");
    for (const buttons of deleteButtons){
       buttons.remove();
    }
   }