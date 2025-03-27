import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import { useData } from "./DataContext";
import playing from "../Images/CurrMusci.svg";
import toast from "react-hot-toast";

function Song() {
  const {
    song,
    setSong,
    songId,
    setSongId,
    setAlbum,
    album,
    setLoading,
    setSuggestion,
    suggestion,
    search,
    setCurrPlaylist,
    setPlaylistData,
    setPrivatePlaylist,
    playlistData,
    privatePlaylist,
  } = useData();
  const [page, setPage] = useState(1);
  const [AddplaylistId, setAddplaylistId] = useState([{}]);
  // const [totalResults, setTotalResults] = useState(0);
  // const [songData, setSongData] = useState();
  // const [isMounted, setIsMounted] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  // const [prevSongId, setPrevSongId] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  // Reset states when component mounts

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
  useEffect(() => {
    setSong([]);
    setAlbum([]);
  }, [search]);
  const fetchSongs = async () => {
    try {
      await axios
        // .get("https://saavn.dev/api/search/songs", {
        .get("https://jiosavan-api2.vercel.app/api/search/songs", {
          params: {
            query: location.pathname.startsWith("/search")
              ? search
              : "new 2025",
            limit: 40,
            page: page,
          },
        })
        .then((response) => {
          //  localStorage.setItem("song", JSON.stringify(await response.data.data.results))
          // setSong(response.data.data)
          setAlbum((prev) => {
            // Use Set to ensure unique IDs
            const existingIds = new Set(prev.map((album) => album.id));
            const newSongs = response.data.data.results.filter(
              (album) => !existingIds.has(album.id)
            );
            return [...prev, ...newSongs];
          });
          setSong((prev) => {
            // Use Set to ensure unique IDs
            const existingIds = new Set(prev.map((song) => song.id));
            const newSongs = response.data.data.results.filter(
              (song) => !existingIds.has(song.id)
            );
            return [...prev, ...newSongs];
          });
          setLoading(true);
        });
      //  if (album.length !== 0) {

      //   localStorage.setItem("song", JSON.stringify(song))
      //  }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [page, search]); // Add page as dependency to refetch when page changes

  const infinitescroll = () => {
    if (
      document.getElementById("track").scrollTop +
        document.getElementById("track").clientHeight +
        1 >=
      document.getElementById("track").scrollHeight
    ) {
      // Check if current page is less than 5 before updating
      setPage((prevPage) => {
        if (prevPage >= 5) return prevPage; // Stop at page 5
        return prevPage + 1;
      });
    }
  };

  useEffect(() => {
    const trackElement = document.getElementById("track");
    trackElement.addEventListener("scroll", infinitescroll);

    // Cleanup event listener
    return () => trackElement.removeEventListener("scroll", infinitescroll);
  }, []);

  const RetriveSuggestion = (id) => {
    setSuggestion([]);
    axios
      .get(
        `https://jiosavan-api2.vercel.app/api/songs/${id}/suggestions`,
        {
          params: {
            limit: 100,
          },
        }
      )
      .then((responce) => {
        // setSuggestion(currentSong)
        if (song) {
          song.map((data) => {
            if (data.id === id) {
              setSuggestion([data]);
            }
          });
        }

        setSuggestion((prev) => [...prev, ...responce.data.data]);
      });
  };

  const playsong = (id) => {
    RetriveSuggestion(id);
    setSong(album);
    setSongId(id);

    // }
  };

  const PrivatePlaylisttrack = async (name, desc, playlistId) => {
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
              setPlaylistData(data);
              // console.log(data);

              setSong(data.songs);
              // setLoading(true)
            })
            .then(() => {
              // navigate("/playlist/track");
              // setLoading(true);
            });

          //  playlistData({name:name,desc:desc,playlistId:playlistId,songs:[]})
          //  console.log(playlistId,songs);
        });
      } else {
        setPlaylistData({
          name: name,
          desc: desc,
          playlistId: playlistId,
          songs: [],
        });
        // navigate("/playlist/track");
        // setLoading(true);
      }

      // setFevroite([])
    });
  };

  const addthesongs = async (id, imageUrl) => {
    try {
      if (localStorage.getItem("token")) {
        AddplaylistId.forEach(async (element) => {
          await axios({
            method: "post",
            url: `https://authentication-seven-umber.vercel.app/api/playlists/add/songs${element.id}`,
            data: {
              songs: [id],
              imageUrl: [imageUrl],
            }, // Body
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((response) => {
              toast.success(response.data.message, { duration: 2000 });
              setPrivatePlaylist((item)=>[...item,""]);
              PrivatePlaylisttrack(element.name, element.desc, element.id);
              // setFevroite([])
            })
            .catch((error) => {
              toast.error(error.response.data.message, { duration: 2000 });
            });
        });
      } else {
        toast.error("Please login or signup first");
      }
    } catch (error) {
      toast.error("Internla server Error");
    }
  };

  // useEffect(()=>{
  //   if ( document.getElementById("dropdown_Container" + prevSongId)) {
  //     document.getElementById("dropdown_Container" + prevSongId).classList.remove('show')
  //    }
  // },[prevSongId])
  // function toggleDropdown(id) {
  //   // Close any open dropdowns

  //   if (
  //     !document.getElementById("dropdown_Container" + id).classList.contains('show')
  //   ) {
  //     document.getElementById("dropdown_Container" + id).classList.add('show');
  //     setPrevSongId(id)
  //     // document.getElementsByClassName('dropdown_Container').classList.remove('show')
  //   } else {

  //     document.getElementById("dropdown_Container" + id).classList.remove("show");

  //     // document.getElementsByClassName('dropdown_Container').classList.add('show')
  //   }

  // }
  //   window.onclick = function(event) {
  //     console.log(!event.target.matches('.action-btn') && event.target.matches('.dropdown_Container'));

  //     // if (!event.target.matches('.action-btn') &&!event.target.matches('.dropdown_Container')) {
  //     if (!event.target.matches('.action-btn') && !event.target.matches('.maincontainer') && !event.target.matches('.dropdown_Container') &&!event.target.matches('.custom-checkbox')) {
  //     // if (!event.target.matches('.action-btn') && !event.target.matches('.dropdown_Container')&& !event.target.matches('.maincontainer') &&!event.target.matches('#searchPlaylist')&&!event.target.matches('#close_Container')&&!event.target.matches('.custom-checkbox')) {
  //     // if (!event.target.matches('.action-btn')) {
  //       // &&!event.target.matches('#searchPlaylist')&&!event.target.matches('#close_Container')
  //         var dropdowns = document.querySelectorAll(".dropdown_Container");

  //         for (var i = 0; i < dropdowns.length; i++) {
  //             var openDropdown = dropdowns[i];
  //             if (openDropdown.classList.contains('show')) {
  //               console.log(openDropdown);

  //                 openDropdown.classList.remove('show');
  //             }
  //         }
  //     }
  // }

  // Modified click handler

  // Add click handler for dropdown items
  // document.querySelectorAll('.dropdown-content a').forEach(item => {
  //   item.addEventListener('click', (event) => {
  //       // Close dropdown after clicking an item
  //       event.target.closest('.dropdown-content').classList.remove('show');
  //   });
  // });

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // find songs in playlist

  const findPlaylistsWithSong = async(songId) =>{
    try {
      await axios({
        method: "get",
        url: `https://authentication-seven-umber.vercel.app/api/get/playlists${songId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((responce)=>{
            let array = responce.data.playlist

            array.forEach(element => {
              document.getElementById(element.playlistId).checked = "on"
            });
            
            
      })
    } catch (error) {
       console.log(error);
       
    }
  }

  return (
    <>
      <div
        id="dynamicDiv"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "90vh",
          width: "100%",
          borderRadius: "10px",
          paddingRight: "8px",
        }}
      >
        <div
          className="content"
          style={{ padding: "0px", position: "relative" }}
        >
          <div
            className="track"
            id="track"
            style={{
              width: "100%",
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <header
              style={{
                position: "sticky",
                height: "55px",
                width: "100%",
                backgroundColor: "#121212",
                display: "flex",
                alignItems: "center",
                padding: "10px",
                top: "0px",
                zIndex: "1",
              }}
            >
              <NavLink
                to={
                  location.pathname.startsWith("/search") ? "/search/all" : "/"
                }
              >
                <button className="home-button">All</button>
              </NavLink>
              <NavLink
                to={
                  location.pathname.startsWith("/search")
                    ? "/search/song"
                    : "/song"
                }
                className={({ isActive }) => (isActive ? "active" : "inactive")}
              >
                <button className="home-button">Aulbum</button>
              </NavLink>
              <NavLink
                to={
                  location.pathname.startsWith("/search")
                    ? "/search/playlist"
                    : "/playlist"
                }
              >
                <button className="home-button">Playlist</button>
              </NavLink>
              <NavLink
                to={
                  location.pathname.startsWith("/search")
                    ? "/search/artist"
                    : "/artist"
                }
              >
                <button className="home-button">Artist</button>
              </NavLink>
            </header>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                position: "relative",
              }}
            >
              <table
                style={{
                  padding: "0px",
                  borderCollapse: "separate",
                  borderSpacing: "0px 0px",
                  width: "100%",
                  maxHeight: "1000px",
                  // position: "absolute",
                  // top: "260px",
                  backgroundColor: "transparent",

                  // backdropFilter: "blur(10px)",
                  zIndex: "0",
                }}
              >
                <thead>
                  <tr
                    id="theader"
                    style={{
                      height: "50px",
                      position: "sticky",
                      top: "65px",
                      width: "100%",
                      zIndex: 30,
                      backgroundColor: "#121212",
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
                        className="Svg-sc-ytk21e-0 dYnaPI e-9541-icon"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                        <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"></path>
                      </svg>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {album
                    ? album.map((data, index) => {
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
                                src={data.image[2].url}
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
                                  {" "}
                                  {data.artists.all.map((artist) => {
                                    return artist.name + ", ";
                                  })}
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
                                {data.album.name}
                              </div>
                            </td>
                            <td
                              className="tbduration"
                              style={{
                                width: "15%",
                                textAlign: "center",
                                borderRadius: "0 10px 10px 0px",
                                fontSize: "14px",

                                // marginRight:"20px"
                              }}
                            >
                              <div
                                style={{
                                  position: "relative",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  fontSize: "13px",
                                  color: "#9c9c9c",
                                }}
                              >
                                <button
                                  className="action-btn"
                                  ref={buttonRef}
                                  onClick={() => {
                                    if (localStorage.getItem('token')) {
                                      findPlaylistsWithSong(data.id)
                                      toggleDropdown(data.id);
                                      setAddplaylistId([]);
                                    }
                                    else{
                                      toast.error("Please login or sign up first")
                                    }
                                  }}
                                >
                                  <svg
                                    data-encore-id="icon"
                                    role="img"
                                    aria-hidden="true"
                                    className="addSvg"
                                    viewBox="0 0 16 16"
                                  
                                  >
                                    <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                                    <path d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75z"></path>
                                  </svg>
                                </button>

                                {openDropdownId === data.id && (
                                  <div
                                    className="dropdown_Container dropdown-COntainer"
                                    ref={dropdownRef}
                                    style={{
                                      position: "absolute",
                                      top: "100%",
                                      zIndex: 5,
                                      // Add your positioning styles here
                                    }}
                                    id={"dropdown_Container" + data.id}
                                  >
                                    <div className="maincontainer">
                                      <div
                                        style={{
                                          fontFamily: "MyCustomFont",
                                          fontSize: "13px",
                                          marginBottom: "14px",
                                          color: "#aeaeae",
                                          float: "left",
                                          marginTop: "5px",
                                        }}
                                      >
                                        Add to playlist
                                      </div>
                                      <header>
                                        <input
                                          type="text"
                                          id="searchPlaylist"
                                          autoComplete="off"
                                          placeholder="Find playlist"
                                        />
                                      </header>
                                      <div id="userPlaylist">
                                        {privatePlaylist.length !==0 ?privatePlaylist.map((data) => {
                                          return (
                                            <label
                                              style={{}}
                                              className="custom-checkbox addplaylist-card"
                                            >
                                              <div
                                                style={{
                                                  fontSize: "14px",
                                                  display: "flex",
                                                  gap: "10px",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {data.imageUrl.length === 0 &&
                                                data !== undefined ? (
                                                  <div
                                                    style={{
                                                      width: "45px",
                                                      height: "45px",
                                                      backgroundColor:
                                                        "#282828",
                                                      borderRadius: "4px",
                                                      boxShadow:
                                                        "#000000a3 0px 0px 14px 0px",
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
                                                        width: "18px",
                                                        heightL: "18px",
                                                        fill: "rgb(127 127 127",
                                                      }}
                                                    >
                                                      <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path>
                                                    </svg>
                                                  </div>
                                                ) : data.imageUrl.length < 4 ? (
                                                  <div
                                                    style={{
                                                      display: "grid",
                                                      gridTemplateColumns:
                                                        "repeat(1, 1fr)",
                                                      gridTemplateRows:
                                                        "repeat(1, 1fr)",
                                                      width: "45px",
                                                      height: "45px",
                                                      gap: "0px",
                                                      overflow: "hidden",
                                                      borderRadius: "4px",
                                                    }}
                                                  >
                                                    <img
                                                      className="cover-img"
                                                      src={data.imageUrl[0]}
                                                      alt=""
                                                    />
                                                  </div>
                                                ) : (
                                                  <>
                                                    <div
                                                      style={{
                                                        display: "grid",
                                                        gridTemplateColumns:
                                                          "repeat(2, 1fr)",
                                                        gridTemplateRows:
                                                          "repeat(2, 1fr)",
                                                        width: "45px",
                                                        height: "45px",
                                                        gap: "0px",
                                                        overflow: "hidden",
                                                        borderRadius: "4px",
                                                      }}
                                                    >
                                                      <img
                                                        className="cover-img"
                                                        src={data.imageUrl[0]}
                                                        alt=""
                                                      />
                                                      <img
                                                        className="cover-img"
                                                        src={data.imageUrl[1]}
                                                        alt=""
                                                      />
                                                      <img
                                                        className="cover-img"
                                                        src={data.imageUrl[2]}
                                                        alt=""
                                                      />
                                                      <img
                                                        className="cover-img"
                                                        src={data.imageUrl[3]}
                                                        alt=""
                                                      />
                                                    </div>
                                                  </>
                                                )}

                                                {data.name}
                                              </div>
                                              <input
                                                onClick={(e) => {
                                                  if (e.target.checked) {
                                                    setAddplaylistId((prev) => [
                                                      ...prev,
                                                      {
                                                        id: data.playlistId,
                                                        name: data.name,
                                                        desc: data.desc,
                                                      },
                                                    ]);
                                                  } else {
                                                    setAddplaylistId((prev) =>
                                                      prev.filter(
                                                        (item) =>
                                                          item.id !==
                                                          data.playlistId
                                                      )
                                                    );
                                                  }
                                                }}
                                                type="checkbox"
                                                id={data.playlistId}
                                              />
                                              <span className="checkmark"></span>
                                            </label>
                                          );
                                        }):<div style={{color:"#d8d8d8",height:"200px",display:"flex",alignItems:"center",fontSize:"16px"}}>
                                             No playlists found. Create one to get started! 🎵
                                          </div>}
                                      </div>
                                    </div>
                                    <div id="close_dropdown">
                                      <button
                                        onClick={() => {
                                          toggleDropdown(data.id);
                                          addthesongs(
                                            data.id,
                                            data.image[2].url
                                          );
                                          // console.log(data);
                                        }}
                                        style={{
                                          width: "70px",
                                          height: "40px",
                                          border:"none",
                                          backgroundColor:"white",
                                          borderRadius:"25px",
                                          color:"black",
                                          fontSize:"15px",
                                          fontWeight:"bold"
                                        }}
                                      >
                                        Add
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {convertToMMSS(Math.floor(data.duration))}
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
        </div>
      </div>
    </>
  );
}

export default Song;
