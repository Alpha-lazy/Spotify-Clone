import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useData } from "./DataContext";
import axios from "axios";
import "../App.css";
function Search() {
  const {
    // song,
    setSong,
    songId,
    setSongId,
    setLoading,
    searchTrack,
    setSearchTrack,
    setSuggestion,
    setPlaylistData,
    playlist,
    setPlaylist,
    artist,
    setArtist,
    setArtistId,
    search,
    currPlaylist,
    setCurrPlaylist,
    isPlaying,
    playlistData,
    togglePlayPause,
    audio,
  loading
  } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const idRef = useRef();
  const fetchSongs = async () => {
    try {
      setLoading(false)
      await axios
        .get("https://jiosavan-api2.vercel.app/api/search/songs", {
          params: {
            query: search.trim().length === 0 ? "Payal" : search,
            limit: 4,
            page: page,
          },
        })
        .then((response) => {
          setSong([]);
          setSearchTrack(response.data.data.results);
          setSong(response.data.data.results);
          setLoading(true);
        });
      //  if (album.length !== 0) {

      //   localStorage.setItem("song", JSON.stringify(song))
      //  }
    } catch (error) {
      console.log(error);
    }
  };

  const RetriveSuggestion = (id) => {
    // setSuggestion([])
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
        searchTrack.map((data) => {
          if (data.id === id) {
            setSuggestion([data]);
          }
        });
        setSuggestion((prev) => [...prev, ...responce.data.data]);
        setSong((prev) => [...prev, ...responce.data.data]);
      });
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

  useEffect(() => {
    fetchSongs();
  }, [search]);

  //  Search for playlist

  const fetchPlaylist = async () => {
    await axios
      // .get("https://saavn.dev/api/search/playlists", {
      .get("https://jiosavan-api2.vercel.app/api/search/playlists", {
        params: {
          query: location.pathname.startsWith("/search")
            ? search
            : "top playlists",
          limit: 40,
          page: 1,
        },
      })
      .then((response) => {
        setPlaylist([]);
        setPlaylist(response.data.data.results);
      });
  };

  useEffect(() => {
    fetchPlaylist();
  }, [search]);

  const RetrivePlaylist = async (id, link, limit) => {
    setLoading(false);
    await axios
      // .get("https://saavn.dev/api/playlists", {
      .get("https://jiosavan-api2.vercel.app/api/playlists", {
        params: {
          id: id,
          link: link,
          page: 1,
          limit: limit,
        },
      })
      .then(async (responce) => {
        setPlaylistData([]);
        setPlaylistData(await responce.data.data);

        setLoading(true);
      });
  };

  const playlist_track = (id, link, limit) => {
    RetrivePlaylist(id, link, limit);

    navigate("/playlist/track");
  };

  // Search artist

  // setLoading(true);
  const retriveArtist = async () => {
    await axios
      .get("https://jiosavan-api2.vercel.app/api/search/artists", {
        params: {
          query: location.pathname.startsWith("/search")
            ? search
            : "Top Artist",
          limit: 32,
        },
      })
      .then((responce) => {
        setArtist(responce.data.data.results);
      });
  };

  useEffect(() => {
    retriveArtist();
  }, [search]);

  const paly_playlist = async (id, link, limit) => {
    setLoading(false);
    await axios
      // .get("https://saavn.dev/api/playlists", {
      .get("https://jiosavan-api2.vercel.app/api/playlists", {
        params: {
          id: id,
          link: link,
          page: 1,
          limit: limit,
        },
      })
      .then(async (responce) => {
        setPlaylistData([]);
        setPlaylistData(await responce.data.data);

        let palylistsongid = await responce.data.data.songs[0].id;
        setSong(await responce.data.data.songs);
        setSuggestion(await responce.data.data.songs);
        setCurrPlaylist(await responce.data.data);

        setSongId(palylistsongid);
        //   setLoading(true);

        setPlaylistData([]);
        setPlaylistData(await responce.data.data);

        setLoading(true);
      });
  };

  const onlyPlay_Playlist = async (id, link, limit) => {
    paly_playlist(id, link, limit);
    if (!isPlaying) {
      togglePlayPause();
      document.getElementById(`${id}onlyplay`).style.display = "none";
      document.getElementById(`${id}onlypause`).style.display = "block";
    } else if (isPlaying) {
      togglePlayPause();
      document.getElementById(`${id}onlyplay`).style.display = "block";
      document.getElementById(`${id}onlypause`).style.display = "none";
    }

    idRef.current = id;
  };

  useEffect(() => {

    if (idRef.current) {
      if (audio.paused) {
        document.getElementById(`${idRef.current}onlyplay`).style.display =
          "block";
        document.getElementById(`${idRef.current}onlypause`).style.display =
          "none";
      } else {
        document.getElementById(`${idRef.current}onlyplay`).style.display =
          "none";
        document.getElementById(`${idRef.current}onlypause`).style.display =
          "block";
      }
    }
  }, [audio.paused]);

  useEffect(() => {
    if (currPlaylist && playlistData) {
      setPlaylistData(currPlaylist);
    }
    console.log(currPlaylist);
  }, []);

  // artist

  const retriveArtistData = async (id) => {
    await axios
      .get(`https://jiosavan-api2.vercel.app/api/artists/${id}`, {
        params: {
          query: "Top Artist",
          limit: 32,
        },
      })
      .then((responce) => {
        setCurrPlaylist(responce.data.data);
      });
  };

  const paly_artist = async (id) => {
    setLoading(false);

    await axios
      .get(`https://jiosavan-api2.vercel.app/api/artists/${id}/songs`, {
        params: {
          sortBy: "popularity",
          sortOrder: "desc",
          limit: 100,
          page: 0,
        },
      })
      .then(async (responce) => {
        let palylistsongid = await responce.data.data.songs[0].id;
        setSong(await responce.data.data.songs);
        setSuggestion(await responce.data.data.songs);
        // setCurrPlaylist(await responce.data.data)
        console.log(responce.data.data.songs);

        setSongId(palylistsongid);
        setLoading(true);
      });
  };

  const onlyPlay_Artist = async (id) => {
    paly_artist(id);
    if (!isPlaying) {
      togglePlayPause();
      document.getElementById(`${id}onlyplay`).style.display = "none";
      document.getElementById(`${id}onlypause`).style.display = "block";
    } else if (isPlaying) {
      togglePlayPause();
      document.getElementById(`${id}onlyplay`).style.display = "block";
      document.getElementById(`${id}onlypause`).style.display = "none";
    }

    idRef.current = id;
  };
  console.log(loading);
  

  return (
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
      <div className="content" style={{ padding: "0px" }}>
        {searchTrack !== undefined &&
        search.trim().length !== 0 &&
        searchTrack.length !== 0 &&
        searchTrack[0].artists.all[0].name ? (
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
                zIndex: "2",
              }}
            >
              <NavLink to="/search/all">
                <button className="home-button">All</button>
              </NavLink>
              <NavLink
                to="/search/song"
                className={({ isActive }) => (isActive ? "active" : "inactive")}
              >
                <button className="home-button">Aulbum</button>
              </NavLink>
              <NavLink
                to="/search/playlist"
                className={({ isActive }) => (isActive ? "active" : "inactive")}
              >
                <button className="home-button">Playlist</button>
              </NavLink>
              <NavLink to="/search/artist">
                <button
                  className="home-button"
                  onClick={() => {
                    navigate("/search/playlist");
                  }}
                >
                  Artist
                </button>
              </NavLink>
            </header>

            <div>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  paddingLeft: "30px",
                  marginTop: "10px",
                  flexWrap: "wrap",
                  padding: "30px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: "0px",
                      color: "white",
                      marginBottom: "10px",
                    }}
                  >
                    Top result
                  </h2>
                  <div
                    className=" searchCard "
                    style={
                      songId === searchTrack[0].id
                        ? { backgroundColor: "#222222" }
                        : { backgroundColor: "#181818" }
                    }
                    onClick={() => {
                      setSongId(searchTrack[0].id);
                      setSong(searchTrack);
                      RetriveSuggestion(searchTrack[0].id);
                      setCurrPlaylist([]);
                    }}
                  >
                 
                   <div>
                    {/* {loading? */}
                     <img
                      
                        src={searchTrack[0].image[2].url}
                        width="100px"
                        height="100px"
                        alt="Song"
                        style={{
                          boxShadow: "#000000ab 0px 0px 12px 0px",
                          borderRadius: "5px"
                        }}
                      />
                      {/* :<div */}
                      {/* // style={{ */}
                      {/* //    boxShadow: "#000000ab 0px 0px 12px 0px",
                      //     borderRadius: "5px",
                      //     height:"100px",
                      //     width:"100px"
                      // }}
                      // > */}
                        
                      {/* //   </div>} */}
                    </div>
                    <div>
                      <div>
                        <div
                          style={{
                            fontSize: "29px",
                            fontWeight: "bolder",
                            marginTop: "10px",
                            whiteSpace: "nowrap",
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "white",
                          }}
                          title={searchTrack[0].name}
                        >
                          {searchTrack[0].name}
                        </div>
                        <p
                          style={{
                            margin: "0px 0px",
                            color: "#b0b0b0",
                            fontSize: "14px",
                            display: "flex",
                            gap: "5px",
                          }}
                        >
                          {searchTrack[0].type}{" "}
                          <section
                            style={{
                              color: "white",
                              fontSize: "14px",
                              whiteSpace: "nowrap",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {searchTrack[0].artists.primary.map((artist) => {
                              return artist.name + ", ";
                            })}
                          </section>
                        </p>
                      </div>
                    </div>
                   

                  </div>
                  
                  
                        
                          
                </div>
                <div style={{ flex: "1" }}>
                  <h2
                    style={{
                      margin: "0px",
                      color: "white",
                      marginBottom: "10px",
                    }}
                  >
                    Songs
                  </h2>
                  <div
                    className="top5song"
                    style={{
                      display: "flex",
                      height: "180px",
                      alignItems: "center",
                      marginTop: "30px",
                    }}
                  >
                    <table class="music-table">
                      <tbody>
                        {searchTrack.map((data) => {
                          return (
                            <tr
                              onClick={() => {
                                // setSongId(data.id);
                                // RetriveSuggestion(data.id);
                                setSongId(data.id);
                                setSong(searchTrack);
                                RetriveSuggestion(data.id);
                                setCurrPlaylist([]);
                              }}
                            >
                              <td
                                style={{
                                  padding: "0px 0px",
                                  width: "5%",
                                  borderTopLeftRadius: "5px",
                                  borderBottomLeftRadius: "5px",
                                }}
                              >
                                <img
                                  width="40px"
                                  height="40px"
                                  style={{
                                    borderRadius: "5px",
                                    marginLeft: "10px",
                                  }}
                                  src={data.image[2].url}
                                  alt=""
                                />
                              </td>
                              <td class="song-info" data-label="Song & Artist">
                                <div
                                  style={{ fontWeight: "bold" }}
                                  className={
                                    data.id === songId
                                      ? "Active-audio"
                                      : "songName"
                                  }
                                  title={data.name}
                                >
                                  {data.name}
                                </div>
                                <div className="SearchArtist">
                                  {data.artists.primary.map((artist) => {
                                    return artist.name + ", ";
                                  })}
                                </div>
                              </td>
                              <td
                                data-label="Duration"
                                style={{
                                  color: " #a7a7a7",
                                  fontSize: "15px",
                                  textAlign: "center",
                                  borderTopRightRadius: "5px",
                                  borderBottomRightRadius: "5px",
                                  fontWeight: "600",
                                }}
                              >
                                {convertToMMSS(Math.floor(data.duration))}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Playlist section */}

              {playlist && playlist.length !== 0 ? (
                <div style={{ height: "320px", padding: "20px" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h2
                      style={{
                        margin: "0px",
                        color: "white",
                        marginBottom: "10px",
                        marginLeft: "10px",
                      }}
                    >
                      Playlists
                    </h2>

                    <div>
                      <NavLink to="/search/playlist">
                        <button
                          className="showArtist"
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                            fontSize: "15px",
                            color: "#b3b3b3",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          Show all
                        </button>
                      </NavLink>
                    </div>
                  </div>
                  <div className="searchPlaylist">
                    {playlist
                      ? playlist.map((data) => {
                          return (
                            <div
                              className={`Playlist-card ${
                                currPlaylist
                                  ? currPlaylist.id === data.id &&
                                    !audio.paused &&
                                    currPlaylist.length !== 0
                                    ? "active"
                                    : ""
                                  : ""
                              }`}
                              key={data.id}
                              id={data.id}
                              style={{
                                minWidth: "170px",
                                maxWidth: "190px",
                                height: "270px",
                              }}
                            >
                              <div
                                onClick={() => {
                                  playlist_track(
                                    data.id,
                                    data.url,
                                    data.songCount
                                  );
                                }}
                              >
                                <div className="card-img">
                                  <img
                                    width="100%"
                                    height="100%"
                                    style={{ borderRadius: "5px" }}
                                    src={data.image[2].url}
                                    alt=""
                                  />
                                </div>
                                <div className="info">
                                  <div className="name">
                                    <div style={{ width: "175px" }}>
                                      {data.name}
                                    </div>
                                    <p className="card-artist">{data.type}</p>
                                  </div>
                                </div>
                              </div>
                              <button
                                className="playbutton"
                                onClick={() => {
                                  onlyPlay_Playlist(
                                    data.id,
                                    data.url,
                                    data.songCount
                                  );
                                }}
                              >
                                <svg
                                  width="20px"
                                  height="20px"
                                  fill="black"
                                  className="onlyplay"
                                  id={data.id + "onlyplay"}
                                  data-encore-id="icon"
                                  role="img"
                                  aria-hidden="true"
                                  class="Svg-sc-ytk21e-0 dYnaPI e-9541-icon"
                                  viewBox="0 0 16 16"
                                  style={
                                    currPlaylist
                                      ? currPlaylist.id !== data.id
                                        ? { display: "block" }
                                        : { display: "none" }
                                      : { display: "block" }
                                  }
                                >
                                  <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                                </svg>
                                <svg
                                  width="20px"
                                  height="20px"
                                  fill="black"
                                  id={data.id + "onlypause"}
                                  data-encore-id="icon"
                                  className="onlypause"
                                  role="img"
                                  aria-hidden="true"
                                  class="Svg-sc-ytk21e-0 dYnaPI e-9541-icon"
                                  viewBox="0 0 16 16"
                                  style={
                                    currPlaylist
                                      ? currPlaylist.id === data.id
                                        ? { display: "block" }
                                        : { display: "none" }
                                      : { display: "none" }
                                  }
                                >
                                  <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
                                </svg>
                              </button>
                            </div>
                          );
                        })
                      : ""}
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              {/* Artist section */}

              {artist && artist.length !== 0 ? (
                <div style={{ padding: "30px" }} className="artist">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h2
                      style={{
                        margin: "0px",
                        color: "white",
                        marginBottom: "10px",
                        marginLeft: "10px",
                      }}
                    >
                      Artists
                    </h2>
                    <div>
                      <NavLink to="/search/artist">
                        <button
                          className="showArtist"
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                            fontSize: "15px",
                            color: "#b3b3b3",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          Show all
                        </button>
                      </NavLink>
                    </div>
                  </div>
                  <div className="searchArtist">
                    {artist !== undefined
                      ? artist.map((data) => {
                          return (
                            <div
                              className={`Playlist-card ${
                                currPlaylist
                                  ? currPlaylist.id === data.id &&
                                    !audio.paused &&
                                    currPlaylist.length !== 0
                                    ? "active"
                                    : ""
                                  : ""
                              }`}
                              style={{
                                minWidth: "170px",
                                maxWidth: "190px",
                                height: "260px",
                              }}
                              // style={{
                              //   height: "270px",
                              // }}
                            >
                              <div
                                onClick={() => {
                                  setLoading(false)
                                  setArtistId(data.id);
                                  navigate("/artist/track");
                                }}
                              >
                                <div className="card-img">
                                  <img
                                    src={data.image[2].url}
                                    width="100%"
                                    height="100%"
                                    style={{ borderRadius: "50%" }}
                                    alt=""
                                  />
                                </div>

                                <div className="info">
                                  <div className="name">
                                    <div style={{ width: "175px" }}>
                                      {data.name}
                                    </div>
                                    <p className="card-artist">{data.type}</p>
                                  </div>
                                </div>
                              </div>

                              <button
                                className="playbutton"
                                onClick={() => {
                                  onlyPlay_Artist(data.id);
                                  retriveArtistData(data.id);
                                }}
                              >
                                <svg
                                  width="20px"
                                  height="20px"
                                  fill="black"
                                  className="onlyplay"
                                  id={data.id + "onlyplay"}
                                  data-encore-id="icon"
                                  role="img"
                                  aria-hidden="true"
                                  class="Svg-sc-ytk21e-0 dYnaPI e-9541-icon"
                                  viewBox="0 0 16 16"
                                  style={
                                    currPlaylist
                                      ? currPlaylist.id !== data.id
                                        ? { display: "block" }
                                        : { display: "none" }
                                      : { display: "block" }
                                  }
                                >
                                  <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                                </svg>
                                <svg
                                  width="20px"
                                  height="20px"
                                  fill="black"
                                  id={data.id + "onlypause"}
                                  data-encore-id="icon"
                                  className="onlypause"
                                  role="img"
                                  aria-hidden="true"
                                  class="Svg-sc-ytk21e-0 dYnaPI e-9541-icon"
                                  viewBox="0 0 16 16"
                                  style={
                                    currPlaylist
                                      ? currPlaylist.id === data.id
                                        ? { display: "block" }
                                        : { display: "none" }
                                      : { display: "none" }
                                  }
                                >
                                  <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
                                </svg>
                              </button>
                            </div>
                          );
                        })
                      : ""}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          <div>No any songs are found about {search}</div>
        )}
      </div>
    </div>
  );
}

export default Search;
