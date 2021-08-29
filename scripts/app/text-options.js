const fontSilder = document.getElementById("font-size-input");
const fontTextInput = document.getElementById("font-size-text-input");
const fontColorPicker = document.getElementById("font-color-picker");
const whitespaceCheckbox = document.getElementById("whitespace-checkbox");

let showWhitespace = true;

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

 fontSilder.oninput = function() {
   setFontSize(this.value);
}

function setFontSize(value){
  fontTextInput.value = value;
  fontSilder.value = value;
  textContainer.style.fontSize = value.concat("em"); //change font size to slider value in em unit
  localStorage.setItem('font-size',value)
}

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
function setFontColor(color) {
  fontColorPicker.value = color;
  textContainer.style.color = color; //change font color to hex value from picker
  timer.style.color = color;
  localStorage.setItem("font-hex", color);
}
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