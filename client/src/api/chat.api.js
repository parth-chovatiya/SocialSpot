import { API } from "./api_url";

// Fetch friend chat
export const fetch_friend_chat_api = async ({ token, friendId }) => {
  const res = await fetch(`${API}/chat/fetchChat/${friendId}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return res.json();
};
