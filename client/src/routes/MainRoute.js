import { Routes, Route, Navigate } from "react-router-dom";
import React, { createContext, useState } from "react";
import socketIO from "socket.io-client";

import Login from "../pages/Login";
import Home from "../pages/Home";
import ChatPage from "../pages/ChatPage";

const socket = socketIO.connect("http://localhost:8081", {
  autoConnect: false,
});

const UserContext = createContext();

const MainRoute = () => {
  const [loggedIn, setLoggedIn] = useState(false);

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
            <Route path="/chat" element={<ChatPage socket={socket} />} />
          )}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
};

export { MainRoute, UserContext };
