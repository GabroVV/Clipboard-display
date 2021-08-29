const timer = document.getElementById("time");
const timerStart = document.getElementById("time-start");
const timerReset = document.getElementById("time-reset");

let stopwatchRunning = false;
let interval = null;
let time = 0;

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