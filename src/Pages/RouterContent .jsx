import { useLocation } from "react-router-dom";
import { Route, Routes, BrowserRouter, NavLink } from "react-router-dom";
import React from "react";
import Header from "./Header";
import Home from "./Home";
import Footer from "./Footer";
import Faverate from "./Faverate";
import Song from "./Song";
import Playlist from "./Playlist";
import Playlist_track from "./Playlist_track";
import Artist from "./Artist";
import Artist_track from "./Artist_track";
import Login from "./Login";
import { useData } from "./DataContext";
import Signup from "./Signup";
import Search from "./Search";

function RouterContent() {
  const { setSong } = useData();
  const location = useLocation();
  return (
    <>
      {!location.pathname.startsWith("/auth") && <Header />}

      <div
        style={{
          display: "flex",
          height: "85vh",
          flexWrap: "nowrap",
          gap: "10px",
        }}
      >
        {!location.pathname.startsWith("/auth") && <Faverate />}

        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/song" element={<Song />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/playlist/track" element={<Playlist_track />} />
          <Route path="/artist" element={<Artist />} />
          <Route path="/artist/track" element={<Artist_track />} />

          <Route path="/search/all" element={<Search />} />
          <Route path="/search/playlist" element={<Playlist />} />
          <Route path="/search/song" element={<Song />} />
          <Route path="/search/artist" element={<Artist />} />



        </Routes>
      </div>

      {!location.pathname.startsWith("/auth") && <Footer />}
    </>
  );
}

export default RouterContent;
