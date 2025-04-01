
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useData } from "./DataContext";
import axios from "axios";
import "../App.css";


function Home() {
  // const {setPlaylistData} = useData()
  useEffect(()=>{

    setPlaylistData([])
  },[])

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
  } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [trending,setTrending] = useState()
  const idRef = useRef();

  const RetriveTrendingSongs = async (id) => {
    // setLoading(false);
    await axios
      // .get("https://saavn.dev/api/playlists", {
      .get("https://jiosavan-api2.vercel.app/api/playlists", {
        params: {
          id: 6689255,
          page: 1,
          limit:200
        },
      })
      .then(async (responce) => {
        // setPlaylistData([]);
        setPlaylistData(await responce.data.data);
        setTrending(await responce.data.data.songs)
        setSong(await responce.data.data.songs)
        console.log(await responce.data.data.songs);
        
        if (id) {
console.log(await responce.data.data.songs.filter(song => song.id === id));
idRef.current = id;
        setCurrPlaylist(await responce.data.data.songs.filter(song => song.id === id)[0])
        // setSongId(await responce.data.data.songs.filter(song => song.id === id).id)
      }
        setLoading(true);
      });
      
  };

  useEffect(()=>{
    RetriveTrendingSongs()
  },[])

  const onlyPlay_newSong = async (id) => {
    RetriveTrendingSongs(id);
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



  const fetchSongs = async () => {
    try {
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
    // RetrivePlaylist(id, link, limit);

    navigate(`/playlist/track/${id}`);
  };

  // Search artist

  setLoading(false);
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

  const onlyPlay_Playlist = async (id,link,limit) => {
    paly_playlist(id,link, limit);
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
      console.log(currPlaylist);
      
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

  return (
    <div
      id="dynamicDiv"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "90vh",
        width: "100%",
        borderRadius: "10px",
        paddingRight:"10px"
      }}
    >
      <div className="content" style={{ padding: "0px 0px" }}>
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
            width: "97%",
            backgroundColor: "#121212",
            display: "flex",
            alignItems: "center",
            padding: "8px",
            top: "0",
            zIndex:"2"
          }}
        >
          <NavLink to="/">
            <button className="home-button">All</button>
          </NavLink>
          <NavLink to="/song">
            <button className="home-button">Aulbum</button>
          </NavLink>
          <NavLink to="/playlist">
            <button className="home-button">Playlist</button>
          </NavLink>
          <NavLink to="/artist">
            <button className="home-button">Artist</button>
          </NavLink>
        </header>

      
                   
      <div>
        {/* New release */}
        {trending && trending.length !== 0 ? (
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
                            New Releases 
                          </h2>
                          <div
                             
                          
                           >
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

                               onClick={()=>{navigate('/playlist/track/6689255')}}>
                        
                                Show all
                              </button>
                          </div>
                        </div>
                        <div className="searchPlaylist">
                          {trending
                            ? trending.map((data) => {
                                return (
                                  <div
                                    className={`Playlist-card ${
                                      currPlaylist
                                        ? currPlaylist.id === data.id &&
                                          currPlaylist.length !== 0 && !audio.paused
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
                                        setSongId(data.id);
                                        RetriveTrendingSongs(data.id).then(()=>{setLoading(true)});
                                        RetriveSuggestion(data.id);
                                        
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
                                        setSongId(data.id)
                                        onlyPlay_newSong(data.id)
                                        RetriveSuggestion(data.id)
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
                            <NavLink to="/playlist">
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
                            <NavLink to="/artist">
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
      </div>
    </div>
  );
}

export default Home;
