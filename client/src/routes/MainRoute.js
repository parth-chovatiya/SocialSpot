import { Routes, Route, Navigate } from "react-router-dom";
import React, { createContext, useContext, useEffect, useState } from "react";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import socketIO from "socket.io-client";

import axios from "axios";
import { API } from "../api/api_url";
import ChatPage from "../pages/ChatPage";

const socket = socketIO.connect("http://localhost:8081", {
  autoConnect: false,
});

const UserContext = createContext();

const MainRoute = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  // useEffect(() => {
  //   checkLogin();
  // }, []);
  // const checkLogin = async () => {
  //   const token = localStorage.getItem("token");
  //   const responce = await axios.post(`${API}/auth/checkauth`, {
  //     token,
  //   });
  //   console.log(token);
  //   if (responce.statusCode === 200) setLoggedIn(true);
  //   else setLoggedIn(false);
  // };

  return (
    <>
      <UserContext.Provider value={{ loggedIn, setLoggedIn }}>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          {!loggedIn && (
            <Route
              exact
              path="/login"
              element={<Login socket={socket} />}
            ></Route>
          )}
          {loggedIn && (
            <Route
              exact
              path="/chat"
              element={<Chat socket={socket} />}
            ></Route>
          )}
          {loggedIn && (
            <Route path="/chat1" element={<ChatPage socket={socket} />} />
          )}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
};

export { MainRoute, UserContext };
