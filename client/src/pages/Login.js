import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";

import { login_api } from "../api/auth.api";
import Toast from "../utils/showToast";
import { UserContext } from "../routes/MainRoute";

export default function Login({ socket }) {
  const [loginDetail, setLoginDetail] = useState({ email: "", password: "" });
  const { loggedIn, setLoggedIn } = useContext(UserContext);

  const [toast, showToast] = Toast();
  const navigate = useNavigate();

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setLoginDetail((prevVal) => {
      return {
        ...prevVal,
        [name]: value,
      };
    });
  };

  const handleOnClick = async (e) => {
    try {
      e.preventDefault();

      const response = await login_api(loginDetail);

      if (response.statusCode === 200) {
        localStorage.setItem("token", response.token);
        showToast({
          title: "Login Successful.",
          description: "Enjoy....",
          status: "success",
        });
        setLoggedIn(true);

        // To decode the jwt token
        const user = jwt(response.token);

        // As login successfull -> connect socket
        socket.auth = { username: user.username, _id: user._id };
        socket.connect();

        localStorage.setItem("userName", user.username);
        localStorage.setItem("_id", user._id);
        navigate("/chat");
      }
      if (response.statusCode !== 200) {
        showToast({
          title: "Please enter valid details.",
          description: response.message,
          status: "error",
        });
      }
    } catch (err) {
      showToast({
        title: "Something went wrong...",
        description: "Something went wrong...",
        status: "error",
      });
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" name="email" onChange={inputChangeHandler} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                onChange={inputChangeHandler}
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleOnClick}
              >
                Login
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
