import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import demoImage from "../Images/demo.jpeg";
import axios from "axios";
import { useData } from "./DataContext";

function Playlist() {
  const navigate = useNavigate();
  const location = useLocation();

  let idRef = useRef();
  const {
    setPlaylistData,
    playlist,
    setPlaylist,
    setLoading,
    search,
    playlistData,
    setSongId,
    setSong,
    isPlaying,
    togglePlayPause,
    audio,
    setSuggestion,
    currPlaylist,
    setCurrPlaylist,
  } = useData();

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
      <div className="content" style={{ padding: "0px 0px" }}>
        <div
          className="track"
          style={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            margin: "auto",
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
              top: "0",
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

          {playlist ? (
            <div
              style={
                playlist.length > 3
                  ? {
                      display: "grid",
                      gridTemplateColumns:
                        " repeat(auto-fill, minmax(200px, 1fr))",
                      gap: "1px",
                    }
                  : {
                      display: "grid",
                      gridTemplateColumns:
                        " repeat(auto-fill, minmax(200px, 1fr))",
                      gap: "1px",
                    }
              }
            >
              {playlist
                ? playlist.map((data) => {
                    return (
                      <>
                        <div
                          className={`Playlist-card ${
                            currPlaylist
                              ? currPlaylist.id === data.id && !audio.paused
                                ? "active"
                                : ""
                              : ""
                          }`}
                          key={data.id}
                          id={data.id}
                        >
                          <div
                            onClick={() => {
                              playlist_track(data.id, data.url, data.songCount);
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
                      </>
                    );
                  })
                : ""}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Playlist;
