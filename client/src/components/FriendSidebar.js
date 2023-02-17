import React from "react";
import {
  Box,
  Flex,
  useColorModeValue,
  Text,
  Button,
  Divider,
} from "@chakra-ui/react";

export default function FriendSidebar({
  friends,
  changeFriendId,
  onlineUsers,
  children,
}) {
  const handleOnCall = (e) => {
    changeFriendId(e.target.name);
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")}>
        <Box
          bg={useColorModeValue("white", "gray.900")}
          borderRight="1px"
          borderRightColor={useColorModeValue("gray.200", "gray.700")}
          w={{ base: "full", md: 60 }}
          pos="fixed"
          pt="5px"
          h="full"
        >
          <Flex
            alignItems="center"
            mx="8"
            justifyContent="space-between"
            flexDir={"column"}
          >
            <Text fontSize="xl">
              Welcome: {localStorage.getItem("userName")}
            </Text>
            <Text
              pt="15px"
              fontSize="2xl"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Your Friends
            </Text>
          </Flex>
          <Box
            justifyContent={"center"}
            marginLeft={"auto"}
            display={"flex"}
            flexDirection={"column"}
            marginRight={"auto"}
          >
            {console.log(onlineUsers)}
            {friends.map((link) => (
              <Button
                border={"1px solid grey"}
                margin={"1px 0"}
                key={link._id}
                onClick={handleOnCall}
                style={{ textDecoration: "none" }}
                _focus={{ boxShadow: "none" }}
                name={link._id}
              >
                {link.username}
                {onlineUsers.find((user) => user.userId === link._id) && (
                  <Text fontSize={"xs"}>Active</Text>
                )}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
      <Box>{children}</Box>
    </>
  );
}
