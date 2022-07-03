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
   function clearHistory(){
      clipData = [];
      localStorage.setItem("clip-data", JSON.stringify(clipData));
      currentPage.updateIndex();
      updateViewOnDataChange();
   }

   function clearHistoryPopup(){
      var div = document.createElement("DIV");
      var checkbox = document.createElement("INPUT")
      checkbox.setAttribute("type", "checkbox")
      checkbox.setAttribute("id", "resetcheckbox")
      var label = document.createElement("LABEL")
      label.setAttribute("for","resetcheckbox")
      label.innerHTML = "Reset character count"
      div.appendChild(label);
      div.appendChild(checkbox);
      swal("Clear history","", {
         content:{
            element: div
         } ,
         buttons: {
           cancel: "Cancel",
           history: {
              text: "Clear history",
              value: "history"
           }
         },
       })
       .then((value) => {
         clearHistory();
         switch (value) {
           case "history":
              var result = checkbox.checked

              if(result){
               resetCharacterCount()
               swal("Cleared history and reset character count.");
              }
              else{
               swal("Cleared history.");
              }
             break;
            
           default:
             
         }
       });
   }

   function deleteCurrentPage(){
      deletePage(currentPage.index);
   }
