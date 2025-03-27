import React, { useEffect, useState } from "react";
import { useData } from "./DataContext";
import axios from "axios";

function Artist_track() {
  const {
    loading,
    songId,
    setSongId,
    setSong,
    setLoading,
    setSuggestion,
    artistId,
    setArtistSong,
    artistSong,
  } = useData();
  const [artistData, setArtistData] = useState();
  const [page, setPage] = useState(0);

  const RetriveArtistSong = async (id) => {
    await axios
      .get(`https://jiosavan-api2.vercel.app/api/artists/${id}/songs`, {
        params: {
          sortBy: "popularity",
          sortOrder: "desc",
          page: page,
        },
      })
      .then((responce) => {
        if (responce.data.data.songs.length !== 0) {
          setArtistSong((prev) => [...prev, ...responce.data.data.songs]);

          // page++
        } else {
        }
      });
  };

  const retriveArtistData = async (id) => {
    setArtistSong([]);
    await axios
      .get(`https://jiosavan-api2.vercel.app/api/artists/${id}`, {
        params: {
          query: "Top Artist",
          limit: 32,
        },
      })
      .then((responce) => {
        setArtistData(responce.data.data);
        setLoading(true);
      });
  };

  useEffect(() => {
    RetriveArtistSong(artistId);
    // setLoading(false)
  }, [page]);

  useEffect(() => {
    // RetriveArtistSong(artistId);
    retriveArtistData(artistId);
    // setLoading(false)
  }, []);

  const playsong = (id) => {
    setSuggestion(artistSong);
    setSong(artistSong);
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
      getAverageColor(`${artistData.image[2].url}`, 4)
        .then(
          (color) =>
            (document.getElementById(
              "playlistInfo"
            ).style.background = `linear-gradient(to bottom, ${color.rgb}, transparent)`)
        )
        .catch(console.error);
    }
  }, [artistData]);
  const infinitescroll = () => {
    console.log("ho");

    if (
      document.getElementById("track").scrollTop +
        document.getElementById("track").clientHeight +
        1 >=
      document.getElementById("track").scrollHeight
    ) {
      // Check if current page is less than 5 before updating
      setPage((prevPage) => {
        if (artistId.length === 0) return prevPage; // Stop at page 5
        return prevPage + 1;
      });
    }
  };

  const header = () => {
    const header = document.getElementById("theader");

    const rect = header.getBoundingClientRect();
    // console.log(rect.top);

    if (rect.top <= 72) {
      header.classList.add("stuck");
    } else {
      header.classList.remove("stuck");
    }
    infinitescroll();
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
                  height: "300px",
                  gap: "20px",
                }}
              >
                <div id="PlaylistImg">
                  <img
                    width="230px"
                    style={{
                      borderRadius: "50%",
                      boxShadow: "black 0px 0px 14px 0px",
                    }}
                    height="230px"
                    src={artistData.image[2].url}
                    alt=""
                  />
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
                      {artistData.name}
                    </div>

                    <div
                      style={{
                        color: "rgb(127,127,127)",
                        fontSize: "14px",
                        marginTop: "-7px",
                      }}
                    >
                      {artistData.followerCount}
                    </div>
                    <div>
                      <li
                        style={{
                          color: "rgb(127,127,127)",
                          fontSize: "14px",
                          marginTop: "10px",
                        }}
                      >
                        {artistData.fanCount + " Fans"}
                      </li>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tcontainer"
              style={{
                width: "100%",
                // display: "flex",
                // justifyContent: "center",
                position: "absolute",
                top: "300px",
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
                  backgroundColor: "rgb(0,0,0,0.1)",

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
                  {artistSong
                    ? artistSong.map((data, index) => {
                        return (
                          <tr
                            className="PlaylistRow"
                            onClick={() => {
                              playsong(data.id);
                            }}
                            style={{ height: "60px", cursor: "pointer" }}
                            id={data.id}
                          >
                            <td
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
                              {convertToMMSS(Math.floor(data.duration))}
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

export default Artist_track;
