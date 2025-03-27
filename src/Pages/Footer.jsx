import React, { useEffect, useState } from "react";
// import Song from './Song';
import { useData } from "./DataContext";
import js from "@eslint/js";
import { useLocation } from "react-router-dom";
import Login from "./Login";
import toast from "react-hot-toast";
import axios from "axios";

var song;
// var audio = new Audio();

function Footer() {
  const {
    song,
    setSong,
    songId,
    setSongId,
    setCurrId,
    loading,
    suggestion,
    audio,
    playlistData,
  } = useData();

  const [currentSong, setCurrentSong] = useState();
  const [downloadAudio, setDownloadAudio] = useState();
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("0");
  const location = useLocation();

  useEffect(() => {
    setIndex(0);
  }, [suggestion]);

  const getdownloadAudio = async() => {
    const options = {method: 'GET', url: `https://jiosavan-api2.vercel.app/api/songs/${songId}`};
    try {
      const { data } = await axios.request(options);
      console.log(data.data[0].downloadUrl[4].url);
       audio.src = data.data[0].downloadUrl[4].url
         audio.load()
         audio.play()
         let {download} =  await axios.request(options)

        if (audio.played) {  
          let download =  await fetch(song.filter(
            (item) => item.id === songId
          )[0].downloadUrl[4].url)
          console.log(song.filter(
            (item) => item.id === songId
          )[0].name);
          
          
          setDownloadAudio(await download.blob())
        }  
    } catch (error) {
      console.error(error);
    }
  
    
     console.log();
    
    // console.log(download);
   


   
  
  }

  

  useEffect(() => {
    if (
      songId !== undefined &&
      song.findIndex((item) => item.id === songId) !== -1
    ) {
      setCurrentSong(song.filter((item) => item.id === songId));
      // setIndex(song.findIndex((item) => item.id === songId));
      if (suggestion.length !== 0) {
        setIndex(suggestion.findIndex((item) => item.id === songId));
      }
   let src = song.filter((item) => item.id === songId)[0].downloadUrl[4].url
   console.log(src);
    //  let srcd = fetch(src)
    //   audio.src = src;
    // //   audio.load()
    //   audio.play()
 
     audio.volume = 0.7;

      document.getElementById("progressBar").disabled = false;
      document.getElementById("progressBar").style.cursor = "pointer";
      setInterval(() => {
        if (audio.played) {
          document.getElementById("current-time").innerHTML = `${convertToMMSS(
            Math.floor(audio.currentTime)
          )}`;
          document.getElementById("duration-time").innerHTML = `${
            !audio.duration ? "0:00" : convertToMMSS(Math.floor(audio.duration))
          }`;
          // document.getElementById('duration-time').innerHTML = `${convertToMMSS(Math.floor(audio.duration))===NaN?"0:00":convertToMMSS(Math.floor(audio.duration))}`
          document.getElementById("progressBar").value = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );
          document.getElementById(
            "progressBar"
          ).style.background = `linear-gradient(to right,   rgb(255, 255, 255) ${Math.floor(
            (audio.currentTime / audio.duration) * 100
          )}%,  rgba(153, 153, 153, 0.774) ${Math.floor(
            (audio.currentTime / audio.duration) * 100
          )}%)`;
        }
        if (audio.paused) {
          document.getElementById("pause").style.display = "block";
          document.getElementById("play").style.display = "none";
        } else {
          document.getElementById("pause").style.display = "none";
          document.getElementById("play").style.display = "block";
        }
      }, 1000);
      document.getElementById("player-button").style.backgroundColor = "white";
      document.getElementById("player-button").style.cursor = "pointer";
      document.getElementById("player-button").disabled = false;
    }

    //  else {
    //   document.getElementById("progressBar").disabled = true;
    //   document.getElementById("progressBar").style.cursor = "not-allowed";
    //   document.getElementById("player-button").style.cursor = "not-allowed";
    //   document.getElementById("player-button").style.cursor = "not-allowed";
    //   document.getElementById("player-button").disabled = true;
    //   document.getElementById("player-button").style.backgroundColor =
    //     "rgb(179 179 179)";
    // }

    function convertToMMSS(seconds) {
      // Calculate minutes
      const minutes = Math.floor(seconds / 60);
      // Calculate remaining seconds
      const remainingSeconds = seconds % 60;
      // Pad with leading zero for single-digit seconds
      const formattedSeconds =
        remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
      // Return formatted string
      return `${minutes}:${formattedSeconds}`;
    }

    if (songId) {
      const textElement = document.getElementById("Artist");

      if (textElement) {
        // Remove the animation class to reset it (if already animated)
        textElement.classList.remove("PlayerArtist");

        // Force reflow to restart the animation
        void textElement.offsetWidth;

        // Add the animation class to start the animation
        textElement.classList.add("PlayerArtist");
      }
    }
    getdownloadAudio() 
  }, songId);

  function next() {
    if (suggestion !== undefined && index < suggestion.length) {
      let next = index + 1;
      console.log(next);

      if (next < suggestion.length) {
        setIndex(next);
        setCurrentSong([suggestion[next]]);

        setSongId(suggestion[next].id);
        let src = suggestion[next].downloadUrl[4].url;
        // audio.src = src;
        // audio.play();
      } else {
        audio.pause();
      }
    } else {
      // document.getElementById("player-next").disabled = true;
      document.getElementById("player-button").disabled = true;
      // document.getElementById("player-next").style.cursor = "not-allowed";
      document.getElementById("player-button").style.cursor = "not-allowed";
    }
  }

  function pause() {
    if (audio.paused) {
      audio.play();

      document.getElementById("pause").style.display = "none";
      document.getElementById("play").style.display = "block";
    } else {
      audio.pause();
      document.getElementById("pause").style.display = "block";
      document.getElementById("play").style.display = "none";
    }
  }

  function prev() {
    if (suggestion !== undefined && index > 0) {
      let next = index - 1;
      if (next < suggestion.length) {
        setIndex(next);
        setCurrentSong([suggestion[next]]);
        setSongId(suggestion[next].id);
        let src = suggestion[next].downloadUrl[4].url;
        // audio.src = src;
        // audio.play();
        document.getElementById("player-prev").disabled = false;
        document.getElementById("player-prev").style.cursor = "pointer";
      } else {
        audio.pause();
        document.getElementById("player-prev").disabled = true;
        document.getElementById("player-prev").style.cursor = "not-allowed";
      }
    } else {
    }
  }

  audio.addEventListener("ended", () => {
    if (suggestion !== undefined) {
      let next = index + 1;
      if (next < suggestion.length) {
        setIndex(next);
        setCurrentSong([suggestion[next]]);
        setSongId(suggestion[next].id);
        let src = suggestion[next].downloadUrl[4].url;
        // audio.src = src;
        // audio.play();
      } else {
        audio.pause();
      }
    }
  });

  function Progress(e) {
    let value = e.target.value;
    setValue(value);
    let max = e.target.max;
    let percentage = Math.floor((value / max) * 100);
    audio.currentTime = (audio.duration / 100) * value;
    document.getElementById(
      "progressBar"
    ).style.background = `linear-gradient(to right,   rgb(255, 255, 255) ${percentage}%,  rgba(153, 153, 153, 0.774) ${percentage}%)`;
  }

  async function download(audiolink, fileName) {

    // let download = await  fetch(audiolink)

    // const url = window.URL.createObjectURL(await download.blob()) 
    const url = window.URL.createObjectURL(downloadAudio)
    const link = document.createElement('a');
    console.log(url);

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);  // Clean up memory
    toast.success('Downloaded Successfully')
  }

  return (
    <>
      <footer
        style={{
          width: "100%",
          height: "80px",
          overflow: "hidden",
          position: "fixed",
          bottom: "0",
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          left: "0px",
          zIndex: "2",
        }}
      >
        <div
          id="songName"
          style={{
            display: "flex",
            width: "250px",
            maxHeight: "80px",
            alignItems: "center",
            gap: "10px",
            padding: "0px 15px",
          }}
        >
          {currentSong ? (
            <>
              {" "}
              <div id="songimg">
                <img
                  style={{ borderRadius: "5px" }}
                  width="60px"
                  height="60px"
                  src={
                    currentSong !== undefined
                      ? currentSong[0].image[2].url
                      : "#"
                  }
                  alt=""
                />
              </div>
              <div
                style={{
                  Width: "250px",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    Width: "250px",
                    display: "flex",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  className="tbname"
                >
                  {currentSong[0].name}
                </div>
                <div
                  className="PlayerArtist"
                  id="Artist"
                  style={{
                    fontSize: "14px",
                    color: "#898686",
                    fontWeight: "bold",
                  }}
                >
                  {currentSong[0].artists.all.map((artist) => {
                    return artist.name + ",";
                  })}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>

        <div className="Player" style={{ width: "500px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "30px",
              alignItems: "center",
            }}
          >
            <button
              className="player-prev"
              id="player-prev"
              onClick={() => {
                prev();
              }}
            >
              <svg
                fill="rgb(179 179 179)"
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                class="Svg-sc-ytk21e-0 dYnaPI e-9541-icon"
                viewBox="0 0 16 16"
              >
                <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path>
              </svg>
            </button>
            <button
              className="player-button"
              id="player-button"
              onClick={() => {
                pause();
              }}
            >
              <svg
                width="16px"
                height="16px"
                fill="black"
                id="pause"
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                class="Svg-sc-ytk21e-0 dYnaPI e-9541-icon"
                viewBox="0 0 16 16"
              >
                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
              </svg>
              <svg
                width="16px"
                height="16px"
                fill="black"
                id="play"
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                class="Svg-sc-ytk21e-0 dYnaPI e-9541-icon"
                viewBox="0 0 16 16"
              >
                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
              </svg>
            </button>
            <button
              className="player-next"
              id="player-next"
              onClick={() => {
                next();
              }}
            >
              <svg
                fill="rgb(179 179 179)"
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                class="Svg-sc-ytk21e-0 dYnaPI e-9541-icon"
                viewBox="0 0 16 16"
              >
                <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
              </svg>
            </button>
          </div>
          <div
            className="spotify-progress"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
              gap: "5px",
            }}
          >
            <div
              className="current-time"
              style={{
                fontSize: "13px",
                fontWeight: 100,
                color: "#898686",
                width: "25px",
                height: "18px",
                display: "flex",
              }}
              id="current-time"
            >
              0:00
            </div>
            <input
              className="progress-bar"
              id="progressBar"
              onChange={Progress}
              type="range"
              min="0"
              max="100"
              value={value}
            />
            <div
              className="duration-time"
              style={{
                fontSize: "13px",
                fontWeight: 100,
                color: "#898686",
                width: "25px",
                height: "18px",
                display: "flex",
              }}
              id="duration-time"
            >
              0:00
            </div>
          </div>
        </div>
        <div
          className="Controller"
          style={{ width: "250px",display:"flex",marginRight:"10px",height:"100%",justifyContent:"space-evenly",alignItems:"center"}}
        >
          <div style={{position:"relative"}}>
            {currentSong?<button  style={{border:"none",backgroundColor:"transparent",cursor:"pointer"}} onClick={()=>{download(currentSong[0].downloadUrl[4].url, currentSong[0].name)}} className="download">
            <svg viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="#ffffff"></path> <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#ffffff"></path> </g></svg>
            </button>:""}
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
