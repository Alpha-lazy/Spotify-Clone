import React, { useEffect } from "react";
import image from "../Images/alpha_logo_no_bg.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import { useData } from "./DataContext";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSearch ,setLoading} = useData();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      document.getElementById("unauthorize").style.display = "flex";
      document.getElementById("logout").style.display = "none";
    } else {
      document.getElementById("unauthorize").style.display = "none";
      document.getElementById("logout").style.display = "flex";
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate(0);
  };

  // function debounce(func, delay) {
  //   let timeoutId;
  //   return function(...args) {
  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(() => {
  //       func.apply(this, args);
  //     }, delay);
  //   };
  // }

  function handleOnSearch (query) {
    if ( query.trim().length !== 0) {
      
      setSearch(query);
      navigate("/search/all");
    }
    else{
      navigate("/");
    }
   
    if (!location.pathname.startsWith("/search")&& query.trim().length !== 0) {
      navigate("/search/all");
      setLoading(false)
    }
  };

  // const debouncedSearch = debounce(handleOnSearch, 1000);

  useEffect(()=>{
   document.getElementById("serach-input").addEventListener("keypress",(e)=>{
    if (e.key === 'Enter') {
      handleOnSearch(document.getElementById("serach-input").value)
   }
  })
  },[])

  

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 10px",
        alignItems: "center",
      }}
    >
      <NavLink to="/">
      <div className="logo" style={{ width: "300px" }}>
        <img src={image} width="130px" height="40px" alt="" />
      </div>
      </NavLink>
      <div className="search" style={{ display: "flex", gap: "20px" }}>
        <div>
          <NavLink to="/">
            <button
              className="button"
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                justifyContent: "center",
                border: "none",
                borderRadius: "50%",
                backgroundColor: "#1f1f1f",
              }}
            >
              <svg
                fill="white"
                width="35px"
                height="27px"
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                class="Svg-sc-ytk21e-0 bneLcE e-9541-icon"
                viewBox="0 0 24 24"
              >
                <path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z"></path>
              </svg>
            </button>
          </NavLink>
        </div>
        <input
          type="search"
          placeholder="What do you want to play?"
          style={{
            height: "50px",
            // outline: "none",
            padding: "20px",
            color: "white",
            fontSize: "18px",
            border: "none",
            borderRadius: "40px",
            width: "450px",
            backgroundColor: "#1f1f1f",
          }}
          id="serach-input"
          className="serach-box"
          onInput={(e)=>{
            if(e.target.value.trim().length ==0){
                 navigate("/")
            }
        }}
          // onChange={}
        />
      </div>

      <div className="auth" id="unauthorize">
        <div>
          <a href="/auth/signup" style={{ textDecoration: "none" }}>
            <button
              className="sign"
              style={{
                backgroundColor: "transparent",
                width: "80px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Sign up
            </button>
          </a>
        </div>

        <div
          id="unauthorize"
          className="logindiv"
          // style={{
          //   width: "100px",
          //   height: "auto",
          //   display: "flex",
          //   justifyContent: "center",
          // }}
        >
          <a href="/auth/login">
            <button
              className="login"
              style={{
                backgroundColor: "white",
                color: "black",
                boxSizing: "border-box",
              }}
            >
              Login
            </button>
          </a>
        </div>
      </div>
      <div
        className="auth"
        style={{
          display: "flex",
          width: "100px",
          justifyContent: "center",
        }}
        id="logout"
      >
        <button
          onClick={logout}
          className="login"
          style={{
            backgroundColor: "white",
            color: "black",
            boxSizing: "border-box",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
