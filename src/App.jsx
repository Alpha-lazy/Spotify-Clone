import { useState } from "react";
// import { Route, Routes, BrowserRouter, NavLink, useLocation } from "react-router-dom";
import "./App.css";
import { DataProvider } from "./Pages/DataContext";
import RouterContent from "./Pages/RouterContent ";
import { BrowserRouter } from "react-router-dom";
import React from "react";

function App() {
  // const location = useLocation();

  return (
    <DataProvider>
      <BrowserRouter>
        <RouterContent />
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
