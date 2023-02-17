import { Box, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { fetch_friend_chat_api } from "../api/chat.api";
import { fetch_all_friends_api } from "../api/friend.api";
import FriendSidebar from "../components/FriendSidebar";
import Chat from "./Chat";

const ChatPage = ({ socket }) => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [friendId, setFriendId] = useState();
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [chat, setChat] = useState([]);

  const fetchAllFriends = async () => {
    const token = localStorage.getItem("token");
    const friends = await fetch_all_friends_api({ token });
    setFriends(friends.friends);
    setIsLoading(false);
  };

  useEffect(() => {
    // undefined -> why ?
    // console.log(socket.id, "-> client");
    socket.emit("login", {
      userId: localStorage.getItem("_id"),
    });

    fetchAllFriends();
  }, []);

  useEffect(() => {
    socket.on("onlineUsers", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });
  }, [onlineUsers]);

  const fetchChat = async () => {
    if (friendId !== undefined && friendId !== localStorage.getItem("_id")) {
      const token = localStorage.getItem("token");
      const chatFetched = await fetch_friend_chat_api({ token, friendId });
      setChat(chatFetched.chat);
      setMessages(chatFetched.chat);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [friendId]);

  if (isLoading) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  const sendMessageOnCall = (data) => {
    setMessages((old) => [...old, data]);
  };
  const changeFriendId = (data) => {
    setFriendId(data);
  };

  return (
    <>
      <FriendSidebar
        changeFriendId={changeFriendId}
        friends={friends}
        onlineUsers={onlineUsers}
      >
        <Chat
          socket={socket}
          messages={messages}
          sendMessageOnCall={sendMessageOnCall}
          friendId={friendId}
          token={localStorage.getItem("token")}
        />
      </FriendSidebar>
    </>
  );
};

export default ChatPage;
