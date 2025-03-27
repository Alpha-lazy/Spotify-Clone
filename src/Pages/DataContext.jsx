import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
// import { use } from "react";

// Create a Context
const DataContext = createContext();

// Create a provider to wrap around your app or components that need access
export const DataProvider = ({ children }) => {
  const [song, setSong] = useState([]);
  const [songId, setSongId] = useState();
  const [currId, setCurrId] = useState();
  const [playlistData, setPlaylistData] = useState();
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState();
  const [album, setAlbum] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [artist, setArtist] = useState();
  const [artistSong, setArtistSong] = useState([]);
  const [artistId, setArtistId] = useState("");
  const [fevroite, setFevroite] = useState();
  const [search, setSearch] = useState("songs");
  const [searchTrack, setSearchTrack] = useState([]);
  const [currPlaylist, setCurrPlaylist] = useState();
  const [audio] = useState(new Audio()); // Single audio instance
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("");
  const [privatePlaylist, setPrivatePlaylist] = useState([]);

  // Load audio track
  const loadTrack = useCallback(
    (src) => {
      audio.pause();
      audio.src = src;
      setCurrentTrack(src);
      audio.play();
      setIsPlaying(true);
    },
    [audio]
  );

  // Play/pause toggle
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [audio, isPlaying]);
  // if (JSON.parse(localStorage.getItem('currsong')) ) {
  //      console.log(JSON.parse(localStorage.getItem('currsong')))
  // }
  return (
    <DataContext.Provider
      value={{
        song,
        setSong,
        songId,
        setSongId,
        currId,
        setCurrId,
        playlistData,
        setPlaylistData,
        setLoading,
        loading,
        playlist,
        setPlaylist,
        setAlbum,
        album,
        suggestion,
        setSuggestion,
        artist,
        setArtist,
        artistSong,
        setArtistSong,
        artistId,
        setArtistId,
        fevroite,
        setFevroite,
        search,
        setSearch,
        searchTrack,
        setSearchTrack,
        isPlaying,
        currentTrack,
        loadTrack,
        togglePlayPause,
        audio,
        currPlaylist,
        setCurrPlaylist,
        privatePlaylist,
        setPrivatePlaylist
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use context
export const useData = () => useContext(DataContext);
