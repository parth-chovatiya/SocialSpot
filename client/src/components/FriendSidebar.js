import React from "react";
import { Box, Flex, useColorModeValue, Text, Button } from "@chakra-ui/react";

export default function FriendSidebar({ friends, changeFriendId, children }) {
  const handleOnCall = (e) => {
    changeFriendId(e.target.name);
  };

  return (
    <>
      <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
        <Box
          bg={useColorModeValue("white", "gray.900")}
          borderRight="1px"
          borderRightColor={useColorModeValue("gray.200", "gray.700")}
          w={{ base: "full", md: 60 }}
          pos="fixed"
          h="full"
        >
          <Flex
            h="20"
            alignItems="center"
            mx="8"
            justifyContent="space-between"
          >
            <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
              Your Friends
            </Text>
          </Flex>
          {friends.map((link) => (
            <Button
              href="#"
              key={link._id}
              onClick={handleOnCall}
              style={{ textDecoration: "none" }}
              _focus={{ boxShadow: "none" }}
              name={link._id}
            >
              {link.username}
            </Button>
          ))}
        </Box>
      </Box>
      <Box>{children}</Box>
    </>
  );
}
