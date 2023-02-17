import { Flex, Spinner, Box, Divider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { fetch_all_friends_api } from "../api/friend.api";
// import Divider from "../components/Divider";
import Footer from "../components/Footer";
import FriendSidebar from "../components/FriendSidebar";
// import Header from "../components/Header";
import Messages from "../components/Message";

const Chat = ({ socket, messages, friendId, sendMessageOnCall }) => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");

  const fetchAllFriends = async () => {
    const token = localStorage.getItem("token");
    const friends = await fetch_all_friends_api({ token });
    setFriends(friends.friends);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllFriends();
  }, []);

  useEffect(() => {
    socket.on("message", (data, callback) => {
      const msg = {
        senderId: data.from,
        receiverId: data.to,
        text: data.text,
        socketID: data.socketID,
      };
      sendMessageOnCall(msg);

      if (callback) callback();
    });
  }, [socket]);

  const handleSendMessage = () => {
    if (!inputMessage.trim().length) return;

    socket.emit(
      "sendMessage",
      {
        text: inputMessage,
        from: localStorage.getItem("_id"),
        to: friendId,
        socketID1: socket.id,
      },
      () => {
        setInputMessage("");
      }
    );
  };

  if (isLoading) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  return (
    <>
      {/* {console.log(friends?.length)}
      {friends?.length && console.log(friends)} */}
      {/* {friends?.length && <FriendSidebar friends={friends} />} */}
      <Flex w="100%" h="100vh" justify="center" align="center">
        <Flex w="40%" h="90%" flexDir="column">
          {/* <Header /> */}
          {/* <Divider /> */}
          <Messages messages={messages} />
          {/* <Divider /> */}
          <Footer
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default Chat;
