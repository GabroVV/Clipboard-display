let isSidebarShown = false;

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

//Close sidebar on outside click
document.addEventListener("click", function(event){
    if(isSidebarShown && !(event.target.closest("#sidebar, #sidebar-button, .font-picker, .jscolor-picker"))){
       sidebarToggle();
    }
})