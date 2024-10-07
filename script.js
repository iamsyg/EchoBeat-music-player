let currentSong = new Audio();
let songs;

function formatTime(seconds) {
  seconds = Math.floor(seconds); // Remove milliseconds by rounding down to the nearest whole second
  const minutes = Math.floor(seconds / 60); // Get full minutes
  const remainingSeconds = seconds % 60; // Get remaining seconds

  // Ensure seconds are always two digits (e.g., 05 instead of 5)
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/Projects/Spotify%20clone/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track, pause=false) => {
  // Assuming the songs are in the /Projects/Spotify clone/songs/ directory

  
  currentSong.src = "/Projects/Spotify clone/songs/" + track;
  if(!pause){
    currentSong.play();
    play.src = "components/pause.svg";
  }
  currentSong.play().catch((error) => {
    console.error("Error playing the audio:", error);
  });
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

  
};

async function main() {
  songs = await getSongs();
  console.log(songs);
  playMusic(songs[0], true);
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML += `
            <li>
                <img height="25" class="invert" src="components/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Sym</div>
                </div>
                <div class="playnow">
                    <span>Play now</span>
                    <img height="25" class="invert" src="components/play.svg" alt="">
                </div>
            </li>`;
  }

  // Corrected click event listener for all li elements
  document.querySelectorAll(".songList li").forEach((e) => {
    e.addEventListener("click", () => {
      let songName = e.querySelector(".info div").textContent.trim();
      playMusic(songName);
    });
  });

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "components/pause.svg";
    } else {
      currentSong.pause();
      play.src = "components/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;


    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%";
  });


  document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration)*percent)/100;
  })



//   was trying to make responsive



//   document.querySelector(".hamburger").addEventListener("click", () => {
//     document.querySelector(".left").style.left = "0"; // Show the sidebar
// });

// document.querySelector(".close").addEventListener("click", () => {
//     document.querySelector(".left").style.left = "-120%"; // Hide the sidebar
// });




    previous.addEventListener("click", ()=>{
        console.log("prev clikc");
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
    })

    next.addEventListener("click", ()=>{
        console.log("next click");
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length-1 ){
            playMusic(songs[index+1])
        }
    })


    // document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    //     currentSong.volume = parseInt(e.target.value)/100;
    // })


    document.querySelector(".range input").addEventListener("input", (e) => {
        currentSong.volume = e.target.value / 100;  // Volume should be a value between 0 and 1
    });
    
}

main();
