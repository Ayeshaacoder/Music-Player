// let's select all required tags or elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener("click", ()=>{
   showMoreBtn.click();
});

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //calling load music function once window
    playingNow();
});

//load music function
function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//next music function
function nextMusic(){
   //here we will just inrement of index by 1
   musicIndex++;
   //if musicIndex is greater than array lenght then musicaindex will be 1 so the first song will be play
   musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
   loadMusic(musicIndex);
   playMusic();
   playingNow();
}

//prev music function
function prevMusic(){
    //here we will just decrement of index by 1
    musicIndex--;
    //if musicIndex is less than 1  then musicaindex will be array lenght so the last song will be play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
 }

// play or music button event
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusic is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

//next music button event
nextBtn.addEventListener("click", ()=>{
    nextMusic();  //calling next music funtion
});

//prev music button event
prevBtn.addEventListener("click",()=>{
    prevMusic(); //calling prev music funtion
})

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; //getting current time of song
    const duration = e.target.duration; //getting total duration of song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
     musicDuartion = wrapper.querySelector(".duration"); 
   mainAudio.addEventListener("loadeddata",()=>{       
        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ //adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuartion.innerText = `${totalMin}:${totalSec}`;
      });
       //update song total duration
       let currentMin = Math.floor(currentTime/ 60);
       let currentSec = Math.floor(currentTime % 60);
       if(currentSec < 10){ //adding 0 if sec is less than 10
          currentSec = `0${currentSec}`;
       }
       musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
     });

     //let's update playing song current time according to the progress bar width
     progressArea.addEventListener("click", (e)=>{
        let progressWidthval = progressArea.clientWidth; //getting width of progress bar
        let clickedOffsetX = e.offsetX; //getting offset x value
        let songDuration = mainAudio.duration; //getting song total duration

        mainAudio.currentTime = (clickedOffsetX / progressWidthval) * songDuration;
        playMusic();
     });

     //let's work on repeat, shuffle song according to the icon
     const repeatBtn = wrapper.querySelector("#repeat-plist");
     repeatBtn.addEventListener("click",()=>{
        //first we get the innerText of the icon then we will change accordingly
        let getText = repeatBtn.innerText; //getting innerText of icon
        //let's do different changes on diffrent icon click using switch
     switch(getText){
        case "repeat": //if this icon is repeat
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one": //if this icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle")
            break;

        case "shuffle": //if this icon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped")
            break;
    }    
    
});

//above we just changed the icon, now let's work on what to do
//after the song ended

//code for what to do after song ended
mainAudio.addEventListener("ended", ()=>{
    // we'll do according to the icon means if user has set icon to
    // loop song then we'll repeat the current song and will do accordingly
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch(getText){
        case "repeat":
        nextMusic(); //calling nextMusic function
        break;
      case "repeat_one":
        mainAudio.currentTime = 0; //setting audio current time to 0
        loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
        playMusic(); //calling playMusic function
        break;
      case "shuffle":
        //generating random index between the max range of array lenght
        let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
        do{
          randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
        musicIndex = randIndex; //passing randomIndex to musicIndex
        loadMusic(musicIndex); //calling loadMusic function
        playMusic(); //calling playMusic function
        playingNow(); //calling play music song
        break;
    }
  }); 

  const ulTag = wrapper.querySelector("ul");
  // let create li tags according to array length for list
  for (let i = 0; i < allMusic.length; i++) {
    //let's pass the song name, artist from the array
    let liTag = `<li li-index="${i + 1}">
                  <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                  </div>
                  <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                  <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag
  
    let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", ()=>{
      let duration = liAudioTag.duration;
      let totalMin = Math.floor(duration / 60);
      let totalSec = Math.floor(duration % 60);
      if(totalSec < 10){ //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
      };
      liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
      //adding t duration attribut which we will use below
      liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
    });
  }

  //let's work on play particular song on click
  const allLiTags = ulTag.querySelectorAll("li");
 function playingNow(){
    for(let j = 0; j < allLiTags.length; j++){
        let audioTag = allLiTags[j].querySelector(".audio-duration");
       //let's remove playing class from all other li expect the last one which is clicked
       if(allLiTags[j].classList.contains("playing")){
         allLiTags[j].classList.remove("playing");
         //let's get that audio duration value and pass to .audio-duration innertext
         let adDuration = audioTag.getAttribute("t-duration");
         audioTag.innerText = adDuration; //passing t-duration value to audio dusration innerText
       }
        //if there is an li tag which li-index is equal to musicIndex
        //then this music is playing now and we will tyle it
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
           allLiTags[j].classList.add("playing");
           audioTag.innerText  = "playing";
     }
    
     //adding onclick attribute in all li tags
     allLiTags[j].setAttribute("onclick", "clicked(this)");
     }
 }

 //let's play song on li click
 function clicked(element){
    //getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //passing that li index to musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();

 }