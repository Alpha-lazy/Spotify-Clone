import axios from "axios";
import React, { useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useData } from "./DataContext";
var page = 0;
function Artist() {
  const {
    artist,
    setArtist,
    setArtistId,
    setLoading,
    search,
    currPlaylist,
    audio,
    setSuggestion,
    setSongId,
    setSong,
    setCurrPlaylist,
    isPlaying,
    togglePlayPause,
    setPlaylistData,
  } = useData();
  setLoading(false);
  const navigate = useNavigate();
  const location = useLocation();
  const idRef = useRef();
  //  const {limit,setLimit} = useData(20)
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

  const paly_playlist = async (id) => {
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

        setSongId(palylistsongid);
        setLoading(true);
      });
  };

  const onlyPlay_Playlist = async (id) => {
    console.log(currPlaylist);

    paly_playlist(id);
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
    if (currPlaylist) {
      setPlaylistData(currPlaylist);
    }
  }, []);

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
      <div className="content" style={{ overflowY: "hidden", padding: "0px" }}>
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
            <NavLink
              to={location.pathname.startsWith("/search") ? "/search/all" : "/"}
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
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1px",
              padding: "0px 20px",
            }}
          >
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
                        height: "270px",
                      }}
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
                            <div style={{ width: "175px" }}>{data.name}</div>
                            <p className="card-artist">{data.type}</p>
                          </div>
                        </div>
                      </div>

                      <button
                        className="playbutton"
                        onClick={() => {
                          onlyPlay_Playlist(data.id);
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
      </div>
    </div>
  );
}

export default Artist;
