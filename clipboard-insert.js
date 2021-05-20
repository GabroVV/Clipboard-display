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


