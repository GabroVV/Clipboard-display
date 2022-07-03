const charCount = document.getElementById("char-count-value");
const charCountDiv = document.getElementById("char-count-div")
const totalCount = document.getElementById("total-count-value");
const japanCount = document.getElementById("japanese-count-value");
const kataCount = document.getElementById("katakana-count-value");
const hiraCount = document.getElementById("hiragana-count-value");
const kanjiCount = document.getElementById("kanji-count-value");
const latinCount = document.getElementById("roman-count-value");
const otherCount = document.getElementById("other-count-value");

let characters = {
    total : 0,
    japanse : 0,
    kanji : 0,
    kata : 0,
    hira : 0,
    roman : 0,
    other : 0
 }
 let isCharCountShown = false;

 //---------------Character counter---------------

function openCharacterCountList(){
    isCharCountShown = true;
    charCountDiv.style.opacity = "1";
    charCountDiv.style.left = "0";
 }
 
 function closeCharacterCountList(){
    isCharCountShown = false;
    charCountDiv.style.opacity = "0";
    charCountDiv.style.left = "-300px";
 }
 
 function toggleCharacterCountList(){
    if(isCharCountShown){
       closeCharacterCountList();
    }
    else{
       openCharacterCountList();
    }
 }
 //Close char count on outside click
document.addEventListener("click", function(event){
    if(isCharCountShown && !(event.target.closest("#char-count-div, #char-count"))){
       toggleCharacterCountList();
    }
 })

 function adjustCharacterCount(string,multiplier){
    (characters.total += string.length * multiplier) <  0 ? characters.total = 0 : true;
    for(let char of string){
       if(char >= "\u3040" && char <= "\u309f"){
          (characters.hira += 1 * multiplier) < 0 ? characters.hira = 0 : true;
          (characters.japanse += 1 * multiplier) < 0 ? characters.japanse = 0 : true;
       }else if (char >= "\u30a0" && char <= "\u30ff" || char>='ｦ' && char <= 'ﾝ'){
          (characters.kata += 1 * multiplier) < 0 ? characters.kata = 0 :true ;
          (characters.japanse += 1 * multiplier) < 0 ? characters.japanse = 0 : true;
       }else if (char >= "\u4e00" && char <= "\u9faf"){
          (characters.kanji += 1 * multiplier) < 0 ? characters.kanji = 0 :true ;
          (characters.japanse += 1 * multiplier) < 0 ? characters.japanse = 0 :true ;
       }else if (char >= "\u3400" && char <= "\u4dbf"){
          (characters.kanji += 1 * multiplier) < 0 ? characters.kanji = 0 : true;
          (characters.japanse += 1 * multiplier) < 0 ? characters.japanse = 0 : true;
       }else if (char >= "\u30a0" && char <= "\u30ff"){
          (characters.kata += 1 * multiplier) < 0 ? characters.kata = 0 : true;
          (characters.japanse += 1 * multiplier) < 0 ? characters.japanse = 0 :true ;
       }else if(char>='0' && char<='9' || char>='A' && char <= 'z' ||char>='Ａ' && char <= 'Ｚ' || char>='ａ' && char <= 'ｚ'){
          (characters.roman += 1 * multiplier) < 0 ? characters.roman = 0 : true;
       }else{
          (characters.other += 1 * multiplier) < 0 ? characters.other = 0 : true;
       }
    }
       localStorage.setItem("char-count", JSON.stringify(characters));
       updateCharacterCountDisplay();
 }
 
 function subtractStringCharactersLength(string){
    characters.total -= string.length;
 }
 
 function updateCharacterCountDisplay(){
    charCount.innerHTML = characters.total;
    totalCount.innerHTML = characters.total;
    japanCount.innerHTML = characters.japanse;
    kataCount.innerHTML = characters.kata;
    hiraCount.innerHTML = characters.hira;
    latinCount.innerHTML = characters.roman;
    kanjiCount.innerHTML = characters.kanji;
    otherCount.innerHTML = characters.other;
 }
 
 function resetCharacterCountWindow() {
    if(confirm("Reset character count")){
     resetCharacterCount()
    }
}

function resetCharacterCount(){
   {
      characters = {
           total : 0,
           japanse : 0,
           kanji : 0,
           kata : 0,
           hira : 0,
           roman : 0,
           other : 0
        }
      updateCharacterCountDisplay();
      localStorage.setItem("char-count", JSON.stringify(characters));
     }
}