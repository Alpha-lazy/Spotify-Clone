import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useData } from "./DataContext";
import Playlist from "./Playlist";
import { useNavigate } from "react-router-dom";

function Faverate() {
  const {
    fevroite,
    setFevroite,
    setLoading,
    setPlaylistData,
    playlistData,
    privatePlaylist,
    setPrivatePlaylist,
    loading,
    setSong,
  } = useData();
  const navigate = useNavigate();
  const [playlistInfo, setplaylistInfo] = useState({
    name: "",
    desc: "",
  });

  // const [currPlaylist, setcurrPlaylist] = useState();
  const fetchfevorite = async () => {
    try {
      if (localStorage.getItem("token")) {
        const response = await axios({
          method: "get",
          url: "https://authentication-seven-umber.vercel.app/api/playlists/favorites",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // .then((response) => {
        let data = response.data;
        // setFevroite(data.reverse());
        return data.reverse();
        // })

        // .catch((error) => {
        //   // localStorage.removeItem('token');
        //   // navigate('/auth/login');

        //   console.log(error.response.data.message);
        // });
      }
    } catch (error) {
      toast.error("Network Error");
    }
  };
  useEffect(() => {
    let element = document.getElementById("dynamicDiv");
    if (element.style.width !== "85px") {
      document.querySelectorAll("#fevinfo").forEach((element) => {
        element.style.display = "flex";
      });
    } else {
      document.querySelectorAll("#fevinfo").forEach((element) => {
        element.style.display = "none";
      });
    }
    // console.log("mukltiple request",fevroite);
  }, [fevroite]);

  useEffect(() => {
    const favPlaylistData = async () => {
      const favdata = await fetchfevorite();
      console.log(favdata);

      // Only update state if data exists and has changed
      if (favdata && JSON.stringify(favdata) !== JSON.stringify(fevroite)) {
        setFevroite(favdata);
      }
    };

    favPlaylistData();
  }, [fevroite]);

  // fevroite

  function library() {
    let element = document.getElementById("dynamicDiv");
    let fevoritecont = document.getElementById("fevoritecont");
    if (element.style.width === "75px") {
      element.style.width = "600px";
      // document.getElementById("libHeader").style.justifyContent = "left";
      document.getElementById("libHeader").style.justifyContent =
        "space-between";
      document.getElementById("libHeader").style.alignItems = "start";
      document.getElementById("libHeader").style.flexDirection = "unset";
      document.getElementById("libHeader").style.height = "50px";
      document.getElementById("libHeader").style.paddingTop = "18px";

      // document.getElementById("libHeader").style.paddingLeft = "20px";
      document.getElementById("fevoritecont").style.padding = "0px 15px";
      document.getElementById("bt-label").style.display = "block";
      document.getElementById("creatbt-label").style.display = "block";
      // document.getElementById("create").style.display = "flex";
      document.getElementById("create").classList.add("create");
      document.querySelectorAll("#fevinfo").forEach((element) => {
        element.style.display = "flex";
      });
    } else {
      element.style.width = "75px";

      document.getElementById("libHeader").style.justifyContent = "start";
      document.getElementById("libHeader").style.alignItems = "center";
      document.getElementById("libHeader").style.flexDirection = "column";
      document.getElementById("libHeader").style.height = "95px";
      document.getElementById("libHeader").style.paddingTop = "18px";
      // document.getElementById("libHeader").style.paddingLeft = "0px";
      document.getElementById("fevoritecont").style.padding = "0px 0px";
      document.getElementById("bt-label").style.display = "none";
      document.getElementById("creatbt-label").style.display = "none";
      document.getElementById("create").classList.remove("create");
      // document.getElementById("create").style.height = "18px";
      // document.getElementById("create").style.borderRadius = "50%";
      // document.getElementById("create").style.padding = "0px 0px";
      // document.getElementById("create").style.display = "none";
      document.querySelectorAll("#fevinfo").forEach((element) => {
        element.style.display = "none";
      });
    }
  }

  // Fetch playlist track
  useEffect(() => {
    console.log(loading);
  }, [loading]);

  const fevPlaylisttrack = async (id, url, limit) => {
    try {
      setLoading(false);
      await axios
        // .get("https://saavn.dev/api/playlists", {
        .get("https://jiosavan-api2.vercel.app/api/playlists", {
          params: {
            id: id,
            link: url,
            page: 1,
            limit: limit,
          },
        })
        .then(async (responce) => {
          setLoading(true);
          setPlaylistData([]);
          setPlaylistData(await responce.data.data);
          navigate("/playlist/track");
        });
    } catch (error) {
      console.log(error);

      // toast.error("Network Error")
    }
  };

  useEffect(() => {
    if (playlistData) {
      setLoading(true);
    }
  }, [playlistData]);

  // Create playlist

  const createPlaylist = () => {
    if (document.getElementById("showCreate").style.display != "flex") {
      document.getElementById("showCreate").style.display = "flex";
    } else {
      document.getElementById("showCreate").style.display = "none";
    }
    document.getElementById("Playlistdesc").value = "";
    document.getElementById("Playlistname").value = "";
    setplaylistInfo({
      name: "",
      desc: "",
    });
  };

  const handleOnChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setplaylistInfo({
      ...playlistInfo,
      [name]: value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      if (localStorage.getItem("token")) {
        await axios({
          method: "post",
          url: "https://authentication-seven-umber.vercel.app/api/create/playlist",
          data: playlistInfo, // Body
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            toast.success(response.data.message, { duration: 2000 });
            createPlaylist();
            setPrivatePlaylist([]);
          })
          .catch((error) => {
            console.log(error);
            toast.error(error.response.data.message, { duration: 2000 });
          });
      } else {
        toast.error("Please login or signup first");
      }
    } catch (error) {
      toast.error("Internla server Error");
    }
  };

  // Fetch created playlists

  const fetchCreatedPlaylist = async () => {
    try {
      if (localStorage.getItem("token")) {
        const responce = await axios({
          method: "get",
          url: "https://authentication-seven-umber.vercel.app/api/all/playlist",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // .then(async(responce)=>{
        //   console.log(responce);
        // setLoading(true);
        let data = await responce.data.playlist.reverse();
        setPrivatePlaylist(data);
        return data;
        // setPrivatePlaylist(data)
        // })

        // .catch((error) => {
        //   toast.error(error.response.data.message, { duration: 2000 });
        // });
      }
    } catch (error) {
      toast.error("Internla server Error");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // const newData = await fetchCreatedPlaylist();
      fetchCreatedPlaylist();

      let element = document.getElementById("dynamicDiv");
      if (element.style.width === "75px") {
        document.querySelectorAll("#fevinfo").forEach((element) => {
          element.style.display = "none";
        });
      }
      // console.log("Fetched data:", newData); // Debug log

      // Only update state if data exists and has changed
      // if (newData && JSON.stringify(newData) !== JSON.stringify(privatePlaylist)) {
      //   setPrivatePlaylist(newData);
      // }
    };

    loadData();
  }, [privatePlaylist]);

  // privatePlaylist

  // fetch private playlist track

  // const PrivatePlaylisttrack = async(name,desc,playlistId , songs) =>{
  //   let array = songs
  //  if (songs.length !== 0) {

  //   array.forEach(async(id) => {
  //     await axios
  //             .get(`https://jiosavan-api-tawny.vercel.app/api/songs/${id}`)
  //             .then(async(responce) => {
  //               let index = array.indexOf(id);
  //               array.splice(index, 1, await responce.data.data[0]);
  //               setPlaylistData([]);
  //             let data =  {name:name,desc:desc,playlistId:playlistId,songs:array}
  //               setPlaylistData(data)
  //               navigate("/playlist/track");

  //               console.log({name:name,desc:desc,playlistId:playlistId,songs:array});

  //    }).then(()=>{
  //     setLoading(true)
  //    })

  //   //  playlistData({name:name,desc:desc,playlistId:playlistId,songs:[]})
  //           //  console.log(playlistId,songs);

  //    })
  //   }
  //   else{
  //     setPlaylistData({name:name,desc:desc,playlistId:playlistId,songs:[]})
  //     setLoading(true)
  //   }

  //   }

  const PrivatePlaylisttrack = async (name, desc, playlistId, songs) => {
    // let array = songs
    setLoading(false);
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
              setSong(data.songs);
              // setLoading(true)
            })
            .then(() => {
              navigate("/playlist/track");
              setLoading(true);
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
        navigate("/playlist/track");
        setLoading(true);
      }

      // setFevroite([])
    });
  };
  // useEffect(()=>{

  //   console.log(loading);
  // },[loading])

  const addthesongs = async () => {
    try {
      var newarray = [];
      if (playlistData.songs !== undefined) {
        let arrays = playlistData.songs;

        if (playlistData.songs !== undefined && playlistData.songs.length > 3) {
          for (let index = 0; index <= 4; index++) {
            if (arrays[index] !== undefined) {
              let image = arrays[index].image[2].url;
              newarray.push(image);
            }
          }
        } else {
          let image = arrays[0].image[2].url;
          newarray.push(image);
        }

        if (localStorage.getItem("token")) {
          await axios({
            method: "post",
            url: `https://authentication-seven-umber.vercel.app/api/playlists/add/songs${playlistData.playlistId}`,
            data: {
              songs: [],
              imageUrl: newarray,
            }, // Body
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((response) => {
              // toast.success(response.data.message, { duration: 2000 });
              // setFevroite([])
            })
            .catch((error) => {
              // toast.error(error.response.data.message, { duration: 2000 });
              console.log(error);
            });
        } else {
          // toast.error("Please login or signup first");
        }
      } else {
        newarray.push([]);
      }
    } catch (error) {
      toast.error("Internla server Error");
      console.log(error);
    }
  };

  // useEffect(() => {
  //   addthesongs();
  // }, [playlistData]);

  // useEffect(()=>{
  //   PrivatePlaylisttrack(playlistData.name,playlistData.desc,playlistData.playlistId,playlistData.songs)
  // },[playlistData])
  // const data  = (songs) => {

  //   if (songs !== undefined) {
  //     if (songs.length !== 0) {
  //       setLoading(false);
  //     songs.forEach(async (id) => {
  //       await axios
  //         .get(`https://jiosavan-api-tawny.vercel.app/api/songs/${id}`)
  //         .then(async(responce) => {
  //           let index = songs.indexOf(id);
  //          songs.splice(index, 1, await responce.data.data[0]);
  //           setPlaylistData([]);
  //           // setPlaylistData( currPlaylist[0]);
  //           console.log(currPlaylist);

  //           //  setPlaylistData(currPlaylist[0])
  //           // navigate("/playlist/track");
  //           // setLoading(true)

  //           // navigate("/playlist/track");
  //           //
  //         })
  //         .catch((error) => {
  //           toast.error("somthing Internal error");
  //         });
  //         // setLoading(true);
  //     });

  //   }
  //   else{

  //     setPlaylistData(currPlaylist[0]);
  //     setLoading(true)
  //     navigate("/playlist/track");
  //     console.log("undefined");

  //   }
  //   } else {

  //     setPlaylistData(currPlaylist);

  //   }
  // };

  // console.log(playlistData.songs);

  return (
    <>
      <div
        id="dynamicDiv"
        style={{
          float: "left",
          display: "flex",
          flexDirection: "column",
          minHeight: "90vh",
          width: "75px",
          borderRadius: "10px",
          paddingLeft: "8px",
          paddingRight: "0px",
        }}
      >
        <div
          className="content"
          id="fevoritecont"
          style={{
            // padding: "0px 15px",
            overflowX: "hidden",

            // width:"87px"
          }}
        >
          <header
            id="libHeader"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "center",
              height: "95px",
              width: "100%",
              justifyContent: "start",
            }}
          >
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
              onClick={() => {
                library();
              }}
              className="bt-library"
            >
              <section>
                <svg
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  class="Svg-sc-ytk21e-0 bneLcE e-9541-icon"
                  viewBox="0 0 24 24"
                  width="25px"
                  height="25px"
                  fill="#b3b3b3"
                >
                  <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z"></path>
                </svg>
              </section>
              <div
                id="bt-label"
                style={{
                  cursor: "pointer",
                  display: "none",
                  fontSize: "16px",
                  color: "#b3b3b3",
                  fontWeight: "600",
                }}
              >
                Your Library
              </div>
            </button>

            <button
              title="Create playlist"
              id="create"
              className="changeCreate"
              onClick={() => {
                createPlaylist();
              }}
            >
              <section>
                <svg
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  class="e-9640-icon"
                  viewBox="0 0 16 16"
                  width="16px"
                  height="16px"
                  //  fill="#8b8b8b"
                >
                  <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path>
                </svg>
              </section>
              <div
                id="creatbt-label"
                style={{
                  cursor: "pointer",
                  display: "none",
                  fontSize: "14px",
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Create
              </div>
            </button>
          </header>

          <div
            style={{
              marginTop: "0px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {fevroite
              ? fevroite.map((data) => {
                  return (
                    <div
                      id="fevCard"
                      title={data.name}
                      key={data.id}
                      className={`${data.id} ${
                        playlistData
                          ? data.id === playlistData.id
                            ? "fevactive"
                            : ""
                          : ""
                      }`}
                      onClick={() => {
                        // setLoading(false)
                        fevPlaylisttrack(data.id, data.url, data.songCount);
                      }}
                      style={{
                        marginTop: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:"center",
                        width:"100%",
                        gap: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={data.imageUrl}
                        style={{ borderRadius: "5px" }}
                        width="50px"
                        height="50px"
                        alt=""
                      />
                      <div id="fevinfo" style={{ height: "100%" }}>
                        <div
                          style={{
                            width: "300px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ margin: "0px", fontWeight: "normal" }}>
                            {data.name}
                          </span>
                          <p
                            style={{
                              fontSize: "13px",
                              marginTop: "5px",
                              margin: "0px",
                              color: "#7a7a7a",
                            }}
                          >
                            Total {data.songCount} by Alpha
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              : ""}

            {privatePlaylist
              ? privatePlaylist.map((data) => {
                  return (
                    <div
                      id="fevCard"
                      title={data.name}
                      key={data.playlistId}
                      className={`${data.id} ${
                        playlistData
                          ? data.playlistId === playlistData.playlistId
                            ? "fevactive"
                            : ""
                          : ""
                      }`}
                      onClick={() => {
                        PrivatePlaylisttrack(
                          data.name,
                          data.desc,
                          data.playlistId,
                          data.songs
                        );
                        // setLoading(true)
                      }}
                      style={{
                        marginTop: "5px",
                        display: "flex",
                        width:"100%",
                        alignItems: "center",
                        justifyContent:"center",
                        gap: "10px",
                        cursor: "pointer",
                      }}
                    >
                      {data.imageUrl && data.songs.length > 0 ? (
                        <>
                          <div
                            style={
                              data.imageUrl.length > 3
                                ? {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    gridTemplateRows: "repeat(2, 1fr)",
                                    width: "50px",
                                    height: "50px",
                                    gap: "0px",
                                    overflow: "hidden",
                                    borderRadius: "5px",
                                  }
                                : {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(1, 1fr)",
                                    gridTemplateRows: "repeat(1, 1fr)",
                                    width: "50px",
                                    height: "50px",
                                    gap: "0px",
                                    overflow: "hidden",
                                    borderRadius: "5px",
                                  }
                            }
                          >
                            {" "}
                            {data.imageUrl.length > 3 ? (
                              <>
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
                              </>
                            ) : (
                              <img
                                className="cover-img"
                                src={data.imageUrl[0]}
                                alt=""
                              />
                            )}
                          </div>
                          {/* <img
                          src={data.imageUrl[0]}
                          style={{ borderRadius: "5px" }}
                          width="55px"
                          height="55px"
                          alt=""
                        /> */}
                        </>
                      ) : (
                        <div
                          style={{
                            width: "55px",
                            height: "55px",
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
                              width: "25px",
                              heightL: "25px",
                              fill: "rgb(127 127 127",
                            }}
                          >
                            <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path>
                          </svg>
                        </div>
                      )}
                      <div id="fevinfo" style={{ height: "100%" }}>
                        <div
                          style={{
                            width: "300px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ margin: "0px", fontWeight: "normal" }}>
                            {data.name}
                          </span>
                          <p
                            style={{
                              fontSize: "13px",
                              marginTop: "5px",
                              margin: "0px",
                              color: "#7a7a7a",
                            }}
                          >
                            {data.desc} by Alpha
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
      </div>
      <div
        id="showCreate"
        // onClick={() => {
        //   createPlaylist();
        // }}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0c0c0c8f",
          position: "absolute",
          top: "0%",
          zIndex: "4",
          // display: "flex",
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "458px",
            minHeight: "376px",
            backgroundColor: "rgb(40, 40, 40)",
            borderRadius: "8px",
            padding: "0px 25px",
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "80px",
            }}
          >
            <div style={{ fontWeight: "600", fontSize: "25px" }}>
              Edit details
            </div>
            <button
            id="closePlaylist"
              onClick={() => {
                createPlaylist();
              }}
            >
              <svg
                data-encore-id="icon"
                role="img"
                aria-label="Close"
                aria-hidden="false"
                viewBox="0 0 16 16"
                style={{
                  width:"15px",
                  height:"15px",
                  fill:"rgb(191 191 191)"
                }}
                
              >
                <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z"></path>
              </svg>
            </button>
          </header>

          <div style={{ display: "flex", gap: "20px" }}>
            <div
              style={{
                width: "180px",
                height: "180px",
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

            <div style={{ width: "50%" }}>
              <form method="post" onSubmit={handleOnSubmit}>
                <input
                  name="name"
                  type="text"
                  id="Playlistname"
                  placeholder="Add a name"
                  style={{
                    width: "110%",
                    height: "30px",
                    padding: "5px",
                    borderRadius: "5px",
                    border: "1px solid rgb(75, 75, 75)",
                    outline: "none",
                    backgroundColor: "rgba(63, 62, 62, 0.38)",
                    fontSize: "13px",
                    fontFamily: "MyCustomFont",
                  }}
                  onChange={handleOnChange}
                  required
                />
                <br />
                <textarea
                  name="desc"
                  id="Playlistdesc"
                  placeholder="Description"
                  onChange={handleOnChange}
                  style={{
                    marginTop: "5px",
                    minHeight: "120px",
                    minWidth: "110%",
                    maxHeight: "120px",
                    maxWidth: "110%",
                    padding: "5px",
                    outline: "none",
                    borderRadius: "5px",
                    border: "1px solid rgb(75, 75, 75)",
                    backgroundColor: "rgba(63, 62, 62, 0.38)",
                    fontSize: "13px",
                    fontFamily: "MyCustomFont",
                  }}
                ></textarea>
                <button
                  type="submit"
                  style={{
                    float: "right",
                    width: "100px",
                    height: "45px",
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "30px",
                    color: "black",
                    fontSize: "16px",
                    fontWeight: "bold",
                    fontFamily: "MyCustomFont",
                    marginTop: "10px",
                  }}
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Faverate;
