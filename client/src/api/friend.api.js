import { API } from "./api_url";

// Fetch all my friends API
export const fetch_all_friends_api = async ({ token }) => {
  const res = await fetch(`${API}/friend/friends`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return res.json();
};
