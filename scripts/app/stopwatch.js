let stopwatchRunning = false;
let interval = null;

function iterateTimer() {
   time++;
   updateTimerView();
   localStorage.setItem("time", time);
 }

 function updateTimerView(){
   var seconds = time;
   var hours = Math.floor(seconds / 3600);
   seconds -= hours * 3600;
   var mins = Math.floor(seconds / 60);
   seconds -= mins * 60;

   if (hours<10) { hours = "0" + hours; }
   if (mins<10) { mins = "0" + mins; }
   if (seconds<10) { seconds = "0" + seconds; }
   timer.innerHTML = hours + ":" + mins + ":" + seconds;
 }

 function toggleTimer(){
   timerStart.classList.toggle("bi-pause-fill")
   timerStart.classList.toggle("bi-play-fill")
    if(stopwatchRunning){
      clearInterval(interval);
    }
    else{
      interval = setInterval(iterateTimer, 1000);
    }
    stopwatchRunning = !stopwatchRunning
 }

 function resetTimer(){
    time = 0;
    updateTimerView();
    if(stopwatchRunning){
       toggleTimer();
       toggleTimer();
    }
 }

 //---------------Attempt to load config from local storage---------------
function loadLocalStorageConfig(){
    var fontSize = localStorage.getItem('font-size');
    var bgHex = localStorage.getItem('bg-hex');
    var fontHex = localStorage.getItem('font-hex');
    var font = localStorage.getItem('font');
    var animationSpeedSaved = localStorage.getItem('animation-speed');
    var animationTypeSaved = localStorage.getItem('animation-type');
    var whitespace = localStorage.getItem('whitespace');
    var timeLocal = localStorage.getItem('time');
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
    if(timeLocal !== null){
       time = timeLocal;
       updateTimerView();
    }
 }
 
 loadLocalStorageConfig();
 
 //---------------Attempt to load previous data from local storage---------------
 var clipDataRaw = localStorage.getItem('clip-data');
 if(clipDataRaw !== null && clipDataRaw.length > 0){
    clipData = JSON.parse(clipDataRaw);
    moveToFront();
 }
 
 var charactersFromStorage = localStorage.getItem('char-count');
 if(charactersFromStorage !== null){
    characters = JSON.parse(charactersFromStorage);
    updateCharacterCountDisplay();
 }
 updateViewOnDataChange();