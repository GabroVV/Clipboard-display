let clipData = [];

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
 adjustCharacterCount(text, 1);
 moveToFront();
}