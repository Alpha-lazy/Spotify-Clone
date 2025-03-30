import React, { useEffect, useState } from "react";
import "../App.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useData } from "./DataContext";
import toast from "react-hot-toast";
var array = [];
function Playlist_track() {
  const {
    setPlaylistData,
    playlistData,
    loading,
    songId,
    setSongId,
    setSong,
    setLoading,
    setSuggestion,
    fevroite,
    setFevroite,
    setCurrPlaylist,
    privatePlaylist,
    setPrivatePlaylist,
  } = useData();
  // console.log(loading);

  const [playlistTrack, setPlaylistTrack] = useState();
  const [fevData, setFevData] = useState({
    name: "",
    url: "",
    songCount: "",
    imageUrl: "",
  });
  const [fontSize, setFontSize] = useState(40);
  const navigate = useNavigate();
  // const[loader,setLoader] = useState(false)

  useEffect(() => {
    if (playlistData) {
      let songs = playlistData.songs;
      setPlaylistTrack(songs);
      setSong(songs);
      if (playlistData.playlistId !== undefined) {
        setLoading(true);
      }

      // setLoading(true)
    }
  }, [playlistData]);

  const playsong = (id) => {
    setSuggestion(playlistData.songs);

    setCurrPlaylist(playlistData);
    setSong(playlistData.songs);
    setSongId(id);
  };
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

  async function getAverageColor(imageUrl, ratio = 0.1) {
    // Create dummy image to load source
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    // Wait for image to load
    await new Promise((resolve) => (img.onload = resolve));

    // Create canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions based on ratio
    canvas.width = img.naturalWidth * ratio;
    canvas.height = img.naturalHeight * ratio;

    // Draw image to canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let r = 0,
      g = 0,
      b = 0,
      count = 0;

    // Loop through pixels
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue; // Skip transparent pixels

      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    // Calculate averages
    const avgR = Math.round(r / count);
    const avgG = Math.round(g / count);
    const avgB = Math.round(b / count);

    // Format conversions
    const toHex = (value) => value.toString(16).padStart(2, "0");
    const hex = `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;

    return {
      rgb: `rgb(${avgR}, ${avgG}, ${avgB})`,
      hex: hex.toUpperCase(),
    };
  }

  // Usage
  useEffect(() => {
    if (loading) {
      // 5% size ratio

      // linear-gradient(to bottom, #926445, transparent)
      if (playlistData.image !== undefined) {
        getAverageColor(`${playlistData.image[2].url}`, 4)
          .then(
            (color) =>
              (document.getElementById(
                "playlistInfo"
              ).style.background = `linear-gradient(to bottom, ${color.rgb}, transparent)`)
          )
          .catch(console.error);
      }
      else if (playlistData !== undefined && playlistData.songs.length !==0) {
        getAverageColor(`${playlistData.songs.length !==0?playlistData.songs[0].image[2].url:""}`, 4)
        .then(
          (color) =>
            (document.getElementById(
              "playlistInfo"
            ).style.background = `linear-gradient(to bottom, ${color.rgb}, transparent)`)
        )
        .catch(console.error);
      }
    }

    //   if (playlistData !== undefined && playlistData.songs.length !==0) {
    //   getAverageColor(`${playlistData.songs[0].image[2].url}`, 4)
    //   .then(
    //     (color) =>
    //       (document.getElementById(
    //         "playlistInfo"
    //       ).style.background = `linear-gradient(to bottom, ${color.rgb}, transparent)`)
    //   )
    //   .catch(console.error);
    // }
  }, [playlistData]);

  const header = () => {
    const header = document.getElementById("theader");

    const rect = header.getBoundingClientRect();

    if (rect.top <= 72) {
      header.classList.add("stuck");
      // console.log("stuck");
    } else {
      header.classList.remove("stuck");
    }
  };

  // get fev plalist
  const fetchfevorite = async () => {
    try {
      if (localStorage.getItem("token")) {
        await axios({
          method: "get",
          url: "https://authentication-seven-umber.vercel.app/api/playlists/favorites",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            // setFevroite((data)=>[...data,""])
            // setFevroite([])

            setFevroite((prev) =>
              prev.filter((item) => item.id !== response.data.playlistId)
            );
          })

          .catch((error) => {
            console.log(error.response.data.message);
          });
      }
    } catch (error) {
      toast.error("Network Error");
    }
  };

  useEffect(() => {
    if (
      fevroite &&
      playlistTrack &&
      playlistData &&
      loading &&
      playlistData.image !== undefined
    ) {
      const filtered = fevroite.filter(
        (playlist) => playlist.id === playlistData.id
      );
      if (filtered.length !== 0) {
        document.getElementById("addfev").style.display = "none";
        document.getElementById("removefev").style.display = "block";
      } else {
        document.getElementById("addfev").style.display = "block";
        document.getElementById("removefev").style.display = "none";
      }
    }
  }, [playlistTrack, fevroite]);
  

  // Add feverate plalist

  const addFeverate = async () => {
    try {
      if (localStorage.getItem("token")) {
        await axios({
          method: "post",
          url: "https://authentication-seven-umber.vercel.app/api/playlists/favorite",
          data: {
            playlistId: playlistData.id,
            name: playlistData.name,
            url: playlistData.url,
            songCount: playlistData.songCount,
            imageUrl: playlistData.image[1].url,
          }, // Body
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            toast.success("Added to library", { duration: 2000 });
            fetchfevorite();
            // setFevroite([])
          })
          .catch((error) => {
            toast.error(error.response.data.message, { duration: 2000 });
          });
      } else {
        toast.error("Please login or signup first");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Remove favorite playlist

  const removeFavorite = async (id) => {
    console.log(id);

    try {
      if (localStorage.getItem("token")) {
        await axios({
          method: "delete",
          url: `https://authentication-seven-umber.vercel.app/api/playlists/unfavorite/${id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            toast.success("Remove from library", { duration: 2000 });
            fetchfevorite();
            
            // setFevroite([])
          })
          .catch((error) => {
            toast.error(error.response.data.message, { duration: 2000 });
          });
      } else {
        toast.error("Please login or signup first");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const PrivatePlaylisttrack = async (name, desc, playlistId) => {
    // let array = songs
    await axios({
      method: "get",
      url: `https://authentication-seven-umber.vercel.app/api/playlist${playlistId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      // toast.success(response.data.message, { duration: 2000 });
      let array = response.data.playlist[0].songs;
      console.log(array);

      if (array.length !== 0) {
        array.forEach(async (id) => {
          await axios
            .get(`https://jiosavan-api2.vercel.app/api/songs/${id}`)
            .then(async (responce) => {
              let index = array.indexOf(id);
              array.splice(index, 1, await responce.data.data[0]);
              setPlaylistData([]);
              let data = {
                name: name,
                desc: desc,
                playlistId: playlistId,
                songs: array,
              };
              setCurrPlaylist(data);
              console.log(data);

              setPlaylistData(data);
              navigate("/playlist/track");

              console.log({
                name: name,
                desc: desc,
                playlistId: playlistId,
                songs: array,
              });
            })
            .then(() => {
              setLoading(true);
            });

        
        });
      } else {
        setPlaylistData({
          name: name,
          desc: desc,
          playlistId: playlistId,
          songs: [],
        });
      }

      
    });
  };

  const remove = async (playlistId, songid,imageUrl) => {
    try {
      if (localStorage.getItem("token")) {
        await axios({
          method: "post",
          url: `https://authentication-seven-umber.vercel.app/api/playlists/remove/songs${playlistId}`,
          data: {
            songs: songid,
            imageUrl:imageUrl
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            setPrivatePlaylist((item)=>[...item,""]);
            toast.success("Remove from library", { duration: 2000 });
            
            PrivatePlaylisttrack(
              playlistData.name,
              playlistData.desc,
              playlistData.playlistId
            );

            // navigate('/')
            // setFevroite([])
          })
          .catch((error) => {
            toast.error("Error to remove the song", { duration: 2000 });
            console.log(error);
          });
      } else {
        toast.error("Please login or signup first");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePrivatPlaylist = async(playlistId) => {
     try {
      console.log(playlistId);
      
      if (localStorage.getItem('token')) {
        await axios({
           method:"delete",
           url:`https://authentication-seven-umber.vercel.app/api/remove/playlist${playlistId}`,
           headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
 
        }
     
      ).then((responce)=>{
        navigate('/')
        setPrivatePlaylist([]);
             toast.success(responce.data.message);  
        })
      }
     } catch (error) {
      toast.error(responce.data.message);  
       console.log("Error to delete private playlist :" +error);
     }
  }
  return (
    <div
      id="dynamicDiv"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "90vh",
        width: "100%",
        borderRadius: "10px",
      }}
    >
      <div className="content" id="content" style={{ padding: "0px 0px" }}>
        {loading ? (
          <div
            onScroll={header}
            className="track"
            id="track"
            style={{
              width: "100%",
              height: "100%",
              overflow: "auto",
              margin: "auto",
              position: "relative",
              overflowX: "hidden",
            }}
          >
            <div
              className="playlistInfo"
              id="playlistInfo"
              style={{
                display: "flex",
                gap: "20px",
                width: "100%",
                // height: "260px",
                height: "470px",
                // alignItems: "center",
                padding: "0px 25px",
                position: "absolute",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "265px",
                  gap: "20px",
                }}
              >
                <div id="PlaylistImg">
                  {playlistTrack !== undefined &&
                  playlistData.image !== undefined &&
                  playlistData.songs !== undefined ? (
                    // && playlistData.songs.length  >=4
                    <img
                      width="225px"
                      style={{
                        borderRadius: "5px",
                        boxShadow: "black 0px 0px 14px 0px",
                      }}
                      height="225px"
                      // src={playlistData.playlistId ===undefined?playlistData.image[2].url:playlistData !==undefined? playlistData.songs[0].image[2].url:""}
                      src={playlistData.image[2].url}
                      alt=""
                    />
                  ) : playlistData !== undefined &&
                    playlistData.songs.length >= 1 ? (
                    <div
                      style={
                        playlistData.songs.length < 4
                          ? {
                              gridTemplateColumns: "repeat(1, 1fr)",
                              gridTemplateRows: "repeat(1, 1fr)",
                            }
                          : {}
                      }
                      className="playlist-cover"
                    >
                      {playlistData.songs !== undefined &&
                      playlistData.songs.length > 3 ? (
                        <>
                          <img
                            className="cover-img"
                            src={
                              playlistData.songs[0].id !== undefined
                                ? playlistData.songs[0].image[2].url
                                : ""
                            }
                            alt=""
                          />
                          <img
                            className="cover-img"
                            src={
                              playlistData.songs[1].id !== undefined
                                ? playlistData.songs[1].image[2].url
                                : ""
                            }
                            alt=""
                          />
                          <img
                            className="cover-img"
                            src={
                              playlistData.songs[2].id !== undefined
                                ? playlistData.songs[2].image[2].url
                                : ""
                            }
                            alt=""
                          />
                          <img
                            className="cover-img"
                            src={
                              playlistData.songs[3].id !== undefined
                                ? playlistData.songs[3].image[2].url
                                : ""
                            }
                            alt=""
                          />
                        </>
                      ) : playlistData.songs !== undefined &&
                        playlistData.songs[0].id !== undefined ? (
                        <img
                          className="cover-img"
                          src={
                            playlistData.songs[0].id !== undefined
                              ? playlistData.songs[0].image[2].url
                              : ""
                          }
                          alt=""
                        />
                      ) : (
                        ""
                      )}

                      {/* :""} */}
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "200px",
                        height: "200px",
                        backgroundColor: "#282828",
                        borderRadius: "5px",
                        boxShadow: "#000000a3 0px 0px 14px 0px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        class="e-9640-icon"
                        data-testid="playlist"
                        viewBox="0 0 24 24"
                        style={{
                          width: "50px",
                          heightL: "50px",
                          fill: "rgb(127 127 127",
                        }}
                      >
                        <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path>
                      </svg>
                    </div>
                  )}
                </div>

                <div
                  id="PlaylistName"
                  style={{
                    height: "200px",
                    width: "100%",
                    display: "flex",
                    alignItems: "end",
                    float: "left",
                  }}
                >
                  <div>
                    <div>playlist</div>
                    <div
                      id="textEl"
                      style={{
                        color: "white",
                        margin: "0px",
                        padding: "0px",
                        fontSize: "40px",
                      }}
                    >
                      {playlistData.name}
                    </div>

                    <div
                      style={{
                        color: "rgb(127,127,127)",
                        fontSize: "14px",
                        marginTop: "-7px",
                      }}
                    >
                      {playlistData.description !== undefined
                        ? playlistData.description
                        : playlistData.desc}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <li
                        style={{
                          color: "rgb(127,127,127)",
                          fontSize: "14px",
                          marginTop: "10px",
                        }}
                      >
                        {playlistData.songCount !== undefined
                          ? playlistData.songCount + " songs"
                          : playlistData.songs.length + " songs"}
                      </li>
                      {!playlistData.playlistId  ? (
                        <div>
                          <button
                            id="addfev"
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              width: "20px",
                              height: "20px",
                            }}
                            onClick={addFeverate}
                          >
                            <svg
                              data-encore-id="icon"
                              role="img"
                              aria-hidden="true"
                              class="e-9640-icon"
                              viewBox="0 0 24 24"
                              width="30px"
                              height="30px"
                              fill="#b3b3b3"
                              style={{ cursor: "pointer" }}
                            >
                              <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"></path>
                              <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1z"></path>
                            </svg>
                          </button>

                          <button
                            id="removefev"
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              width: "20px",
                              height: "20px",
                            }}
                            onClick={() => {
                              removeFavorite(playlistData.id);
                            }}
                          >
                            <svg
                              data-encore-id="icon"
                              role="img"
                              aria-hidden="true"
                              class="e-9640-icon"
                              viewBox="0 0 24 24"
                              fill="rgb(10 255 98)"
                              width="30px"
                              height="30px"
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm16.398-2.38a1 1 0 0 0-1.414-1.413l-6.011 6.01-1.894-1.893a1 1 0 0 0-1.414 1.414l3.308 3.308 7.425-7.425z"></path>
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      {
                        privatePlaylist && playlistData.playlistId !== undefined?
                        (
                          <button
                          id="addfev"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            width: "20px",
                            height: "20px",
                          }}
                          title="delete playlist"
                          onClick={()=>{deletePrivatPlaylist(playlistData.playlistId)}}
                        >
                         
                          <svg
                         data-encore-id="icon"
                         role="img"
                         aria-hidden="true"
                         class="e-9640-icon"
                         viewBox="0 0 16 16"
                            width="25px"
                            height="25px"
                            fill="#b3b3b3"
                            style={{ cursor: "pointer" }}
                       >
                         <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                         <path d="M12 8.75H4v-1.5h8v1.5z"></path>
                       </svg>
                        </button>
                        
                        ):
                        (
                          <div></div>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tcontainer"
              style={{
                width: "100%",
                position: "absolute",
                top: "260px",
              }}
            >
              <table
                style={{
                  padding: "0px",
                  borderCollapse: "separate",
                  borderSpacing: "0px 0px",
                  width: "100%",
                  maxHeight: "1000px",
                  backgroundColor: "rgb(0,0,0,0.1)",
                  zIndex: "0",
                }}
              >
                <thead>
                  <tr
                    id="theader"
                    style={{
                      height: "50px",
                      position: "sticky",
                      top: "0px",
                      width: "100%",
                    }}
                  >
                    <th
                      style={{
                        borderBottom: "1px solid rgb(56, 56, 56)",
                        color: "rgb(179 179 179)",
                        fontSize: "15px",
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid rgb(56, 56, 56)",
                        color: "rgb(179 179 179)",
                        textAlign: "left",
                        fontSize: "15px",
                      }}
                    >
                      Title
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid rgb(56, 56, 56)",
                        color: "rgb(179 179 179)",
                        textAlign: "left",
                        fontSize: "15px",
                      }}
                    >
                      Aulbum
                    </th>
                    <th style={{ borderBottom: "1px solid rgb(56, 56, 56)" }}>
                      <svg
                        width="18px"
                        height="18px"
                        fill="rgb(179 179 179)"
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        class="Svg-sc-ytk21e-0 dYnaPI e-9541-icon"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                        <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"></path>
                      </svg>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {playlistTrack &&
                  playlistData.songs !== undefined &&
                  playlistTrack.length !== 0
                    ? playlistTrack.map((data, index) => {
                        return (
                          <tr
                            className="PlaylistRow"
                            style={{ height: "60px", cursor: "pointer" }}
                            id={data.id}
                          >
                            <td
                              onClick={() => {
                                playsong(data.id);
                              }}
                              className={
                                songId === data.id ? "Active-audio" : "tbname"
                              }
                              style={{
                                width: "5%",
                                textAlign: "center",
                                fontSize: "15px",
                                borderRadius: "10px 0 0 10px",
                              }}
                            >
                              {songId === data.id ? (
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3.99902 14H5.99902V0H3.99902V14ZM-0.000976562 14H1.99902V4H-0.000976562V14ZM12 7V14H14V7H12ZM8.00002 14H10V10H8.00002V14Z"
                                    fill="#1DB954"
                                  />
                                </svg>
                              ) : (
                                index + 1
                              )}
                            </td>
                            <td
                              onClick={() => {
                                playsong(data.id);
                              }}
                              style={{
                                display: "flex",
                                gap: "15px",
                                alignItems: "center",
                                height: "60px",
                                paddingRight: "5px",
                              }}
                            >
                              <img
                                className="tbimg"
                                width="45px"
                                height="45px"
                                style={{ borderRadius: "5px" }}
                                src={
                                  data.image !== undefined
                                    ? data.image[2].url
                                    : ""
                                }
                                alt=""
                              />

                              <div>
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "15px",
                                    width: "300px",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    marginRight: "50%",
                                  }}
                                  className={
                                    songId === data.id
                                      ? "Active-audio"
                                      : "tbname"
                                  }
                                >
                                  {data.name}
                                </div>
                                <div
                                  className="responceArtistName"
                                  style={{
                                    fontSize: "14px",
                                    color: "#898686",
                                    fontWeight: "500",
                                    width: "350px",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    marginRight: "50%",
                                    paddingRight: " 15px",
                                  }}
                                >
                                  {data.id !== undefined
                                    ? data.artists.all.map((artist) => {
                                        return artist.name + ", ";
                                      })
                                    : ""}
                                </div>
                              </div>
                              {/* data.artists.all[0].name */}
                            </td>
                            <td
                              onClick={() => {
                                playsong(data.id);
                              }}
                              className="tbalbum"
                              style={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                fontSize: "13px",
                                fontWeight: "bold",
                                color: "#b3b3b3",
                              }}
                            >
                              <div
                                className="tbalbum"
                                style={{
                                  maxWidth: "350px",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  fontSize: "13px",
                                  fontWeight: "bold",
                                  color: "#b3b3b3",
                                }}
                              >
                                {data.album !== undefined
                                  ? data.album.name
                                  : ""}
                              </div>
                            </td>
                            <td
                              className="tbduration"
                              style={{
                                width: "15%",
                                textAlign: "center",
                                borderRadius: "0 10px 10px 0px",
                                fontSize: "14px",

                                // justifyContent:"space-between",
                                // gap:"5px"

                                // marginRight:"20px"
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-evenly",
                                }}
                              >
                                {playlistData.playlistId !== undefined ? (
                                  <button
                                    className="removesongs"
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "none",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      remove(playlistData.playlistId,data.id,data.image[2].url);
                                    }}
                                  >
                                    <svg
                                      data-encore-id="icon"
                                      role="img"
                                      aria-hidden="true"
                                      class="e-9640-icon"
                                      viewBox="0 0 16 16"
                                      width="17px"
                                      height="17px"
                                      fill="#b3b3b3"
                                      style={{ cursor: "pointer" }}
                                    >
                                      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                                      <path d="M12 8.75H4v-1.5h8v1.5z"></path>
                                    </svg>
                                  </button>
                                ) : null}
                                {convertToMMSS(Math.floor(data.duration))}
                                <div
                                  style={{ width: "15px", height: "15px" }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    : ""}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Playlist_track;
