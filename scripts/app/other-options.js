const bgColorPicker = document.getElementById("bg-color-picker")
const animationSpeedSlider = document.getElementById("animation-speed-slider");
const animationSpeedText = document.getElementById("animation-speed-text");
const animationType = document.getElementById("animation-type");
let animationSpeed = 1000;
let animationTypeText = "linear";

  function setBackgroundColor(color) {
    document.body.style.backgroundColor = color; //change background color to hex value from picker
    bgColorPicker.value = color;
    localStorage.setItem("bg-hex", color);
 }
 
  animationSpeedSlider.oninput = function() {
    setAnimationSpeed(this.value);
 }
 
 function setAnimationSpeed(value){
    animationSpeed = value * 1000;
    animationSpeedText.value = value;
    animationSpeedSlider.value = value;
    localStorage.setItem('animation-speed', value)
 }
 function setAnimationType(value){
    animationTypeText = value;
    animationType.value = value;
    textContainer.style.transitionTimingFunction = value;
    localStorage.setItem('animation-type', value)
 }