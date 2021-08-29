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